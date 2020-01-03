# FUTURE: Check modules to extract common specs: https://www.terraform.io/docs/modules/index.html

########## VARIABLE DEFINITION ############

variable "domain" {
  type = string
}

variable "artifacts_subdomain" {
  type = string
}

variable "droplets_tags" {
  type = list(string)
}

variable "project_name" {
  type = string
}

variable "artifacts-name" {
  type = string
}

variable "environment" {
  type = string
}

########## DO DATA ##############

data "digitalocean_ssh_key" "droplets-ssh-key" {
  name = "steve-do"
}

########### PROVIDER DEFINITION ###########

provider "digitalocean" {
  # You need a DIGITALOCEAN_TOKEN environment variable available, or optionally, provide it as a CLI arg and assign it to token
  # Same is true for SPACES_ACCESS_KEY_ID and SPACES_SECRET_ACCESS_KEY
  # token = var.do_token
  # spaces_access_id = var.spaces_access_id
  # spaces_secret_key = var.spaces_secret_key
}

######## SERVICES ###########

resource "digitalocean_droplet" "services-1" {
  image = "docker-18-04"
  name = "services-1"
  region = "fra1"
  size = "s-2vcpu-2gb"
  tags = var.droplets_tags
  ssh_keys = [data.digitalocean_ssh_key.droplets-ssh-key.id]

  lifecycle {
    create_before_destroy = true
  }
  
  connection {
    type = "ssh"
    user = "root"
    private_key = file("~/.ssh/do_rsa")
    host=self.ipv4_address
  }

  # Workaround until we can set environment variables in remote-exec https://github.com/hashicorp/terraform/issues/22231 https://github.com/hashicorp/terraform/issues/17441

  provisioner "local-exec" {
    # Add any environment variables that you want to be available during runtime. Indentation is important, so leave it as it is.
    command= <<EOT
cat > envvars << ENVVARS_TPL
export SYSTEM_TLD=$SYSTEM_TLD;
export DIGITALOCEAN_TOKEN=$DIGITALOCEAN_TOKEN;
export DOCKERHUB_TOKEN=$DOCKERHUB_TOKEN;
export SPACES_ACCESS_KEY_ID=$SPACES_ACCESS_KEY_ID;
export SPACES_SECRET_ACCESS_KEY=$SPACES_SECRET_ACCESS_KEY;
ENVVARS_TPL
EOT

    environment= {
      SYSTEM_TLD = var.domain
    }
  }

  provisioner "file" {
    source      = "./envvars"
    destination = "/root/envvars"
  }

  provisioner "file" {
    source      = "./docker-compose.yaml"
    destination = "/root/docker-compose.yaml"
  }

  provisioner "remote-exec" {
    inline = [
      "cd /root",
      "echo 'Sourcing envvars...'",
      ". /root/envvars",
      "echo 'Deploying for '$SYSTEM_TLD",
      "docker login --username sradevski --password $DOCKERHUB_TOKEN",
      "echo 'Booting compose file...'",
      "docker-compose up -d"
    ]
  }
}

######### SPACES ##########

resource "digitalocean_spaces_bucket" "artifacts" {
  name   = var.artifacts-name
  region = "fra1"
  acl="private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "digitalocean_certificate" "cdn-cert" {
  name    = "cdn-cert"
  type    = "lets_encrypt"
  domains = [var.artifacts_subdomain]
  depends_on = [digitalocean_domain.default-domain]
}

# Add a CDN endpoint with a custom sub-domain to the Spaces Bucket
resource "digitalocean_cdn" "cdn-subdomain" {
  origin = digitalocean_spaces_bucket.artifacts.bucket_domain_name
  custom_domain = var.artifacts_subdomain
  certificate_id = digitalocean_certificate.cdn-cert.id
}

######### PROXY/LOAD BALANCING ###########

resource "digitalocean_floating_ip" "floating-ip-1" {
  droplet_id = digitalocean_droplet.services-1.id
  region = "fra1"
}

########## DNS ##########

resource "digitalocean_domain" "default-domain" {
   name = var.domain
   ip_address = digitalocean_floating_ip.floating-ip-1.ip_address
}

resource "digitalocean_record" "CNAME-all" {
  domain = digitalocean_domain.default-domain.name
  type = "CNAME"
  name = "*"
  value = "@"
  ttl = 43200
}

########## PROJECT DEFINITION ##########

resource "digitalocean_project" "lamk-project" {
  name        = var.project_name
  description = "Lamk project resources"
  purpose     = "Lamk system infrastructure"
  environment = var.environment
  resources   = [digitalocean_droplet.services-1.urn, digitalocean_floating_ip.floating-ip-1.urn, digitalocean_domain.default-domain.urn, digitalocean_spaces_bucket.artifacts.urn]
}

######### MISC ############

# Just a sample output variable. These can be used to extract valuable info after terraform applies changes.
# The ip of the newly generated droplet.
output "ip" {
    value = digitalocean_droplet.services-1.ipv4_address
}