#!/bin/sh
set -e

# When we run `npm install` or `npm run dev` the user is switched to `nobody`, and it can't read package.json or package-lock.json as a consequence. For development we can just run with unsafe-perm;
npm config set unsafe-perm true

chksum1=""
while [[ true ]]; do
    chksum2=$(cat yarn.lock | md5sum | cut -d " " -f 1);
    if [[ "$chksum1" != "$chksum2" ]] ; then 
        if [[ ! -z "$chksum1" ]]; 
        then 
          echo "Killing application and installing new dependencies...";
          pkill -f node;
          yarn install --no-lockfile;
        fi
        echo "Starting application...";
        yarn run dev &
        chksum1=$chksum2
        echo "Waiting for changes ...\n"
    fi
    sleep 3s;
done
