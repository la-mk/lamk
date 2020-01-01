#!/bin/sh
set -e

# Add any environment variables that you want to be available during runtime.
RUNTIME_ENVVARS=$(cat <<RUNTIME_ENVVAR_TPL
window._env.API_ENDPOINT = \'$API_ENDPOINT\';
window._env.ARTIFACTS_ENDPOINT = \'$ARTIFACTS_ENDPOINT\';
RUNTIME_ENVVAR_TPL
)

echo "Replacing envvars..."
# Replace the 'ENVVARS' template string in index.html with the runtime environment variables.
sed "s~tpl=\"%%ENVVARS%%\"~${RUNTIME_ENVVARS}~g" ./index.html > ./_tmp.html
cat ./_tmp.html > ./index.html && rm ./_tmp.html

echo "Running CMD..."
exec "$@"