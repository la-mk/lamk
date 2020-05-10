#!/bin/sh
set -e

# Add any environment variables that you want to be available during runtime.
RUNTIME_ENVVARS=$(cat <<RUNTIME_ENVVAR_TPL
window._env.API_ENDPOINT = \'$REACT_APP_API_ENDPOINT\';
window._env.ARTIFACTS_ENDPOINT = \'$REACT_APP_ARTIFACTS_ENDPOINT\';
window._env.ENABLE_SIGNUP = \'$REACT_APP_ENABLE_SIGNUP\';
RUNTIME_ENVVAR_TPL
)

NO_NEWLINE_ENVVARS=$(echo $RUNTIME_ENVVARS)
TPL_STRING='tpl=\"%%ENVVARS%%\"'

echo "Replacing envvars..."
# Replace the 'ENVVARS' template string in index.html with the runtime environment variables.
sed -e "s~${TPL_STRING}~${NO_NEWLINE_ENVVARS}~g" ./index.html > ./_tmp.html
cat ./_tmp.html > ./index.html && rm ./_tmp.html

echo "Running CMD..."
exec "$@"