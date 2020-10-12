#!/bin/sh
set -e

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
