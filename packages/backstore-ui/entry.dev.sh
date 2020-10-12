
#!/bin/sh
set -e

#!/bin/sh
set -e

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
          npm install;
        fi
        echo "Starting application...";
        npm run dev &
        chksum1=$chksum2
        echo "Waiting for changes ...\n"
    fi
    sleep 3s;
done
