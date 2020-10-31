
#!/bin/sh
set -e

# When we run `npm install` or `npm run dev` the user is switched to `nobody`, and it can't read package.json or package-lock.json as a consequence. For development we can just run with unsafe-perm;
npm config set unsafe-perm true

# Don't autoopen browser when running cra start.
export BROWSER=none;
# See https://github.com/facebook/create-react-app/issues/8956. We set CI=true so we can run CRA in the background.
export CI=true;
chksum1=""
while [[ true ]]; do
    chksum2=$(cat package-lock.json | md5sum | cut -d " " -f 1);
    if [[ "$chksum1" != "$chksum2" ]] ; then 
        if [[ ! -z "$chksum1" ]]; 
        then 
          echo "Killing application and installing new dependencies...";
          pkill -f node;
          npm install --no-package-lock;
        fi
        echo "Starting application...";
        npm run dev &
        chksum1=$chksum2
        echo "Waiting for changes ...\n"
    fi
    sleep 3s;
done
