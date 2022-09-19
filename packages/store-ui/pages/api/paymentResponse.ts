import { NextApiRequest, NextApiResponse } from "next";
import { sdk, setupSdk } from "../../sdk/sdk";
import { envvars, loadEnv } from "../../tooling/env";

const prepareSdk = () => {
  // The SDK is a singleton, so it's safe to do this check
  if (!sdk) {
    loadEnv();
    setupSdk({
      transport: "rest",
      apiEndpoint: envvars.API_ENDPOINT,
      imagesEndpoint: envvars.ARTIFACTS_ENDPOINT,
      imagesProxyEndpoint: envvars.IMAGES_PROXY_ENDPOINT,
    });
  }
};

const getPage = (data: any) => {
  // Since the `origin` field can only be set to one domain, we need to perform a handshake procedure to ensure the source of the data.
  return `
	<html>
	<script>
		(function () {
			const receiveMessage = (event) => {
				if (event.data && event.data.type === 'handshake_end') {
					const hostMatch = event.origin.match(new RegExp('https://([^:/]+)([:/]*)(.*)$'))
          const host = hostMatch && hostMatch[1];
          // Use this if you want to limit messages from a single caller, it doesn't matter in this case though.
					// if (host === '${"someurl"}' || host === 'localhost') {
						window.parent.postMessage(${JSON.stringify({ type: "data", data })}, '*');
					// }
				}
			}
			window.addEventListener("message", receiveMessage, false);
			window.parent.postMessage(${JSON.stringify({ type: "handshake_start" })}, "*");
		})()
	</script>
	</html>
	`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.statusCode = 200;
  prepareSdk();

  try {
    const createRes = await sdk.orderPayments.create(req.body);
    res.end(getPage({ data: createRes }));
  } catch (err) {
    console.error(err);
    res.end(getPage({ error: err }));
  }
};

export default handler;
