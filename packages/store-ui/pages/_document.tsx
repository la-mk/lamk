import { css, Global } from "@emotion/react";
import { Html, Head, Main, NextScript } from "next/document";
import { envvars } from "../tooling/env";

export default function Document() {
  const font = envvars.UI_TEMPLATE === "elegant" ? "Noto Sans" : "Ubuntu";

  return (
    <Html prefix="og: https://ogp.me/ns#">
      <Head>
        <link rel="dns-prefetch" href={envvars.API_ENDPOINT} />
        <link rel="preconnect" href={envvars.API_ENDPOINT} crossOrigin="true" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        <link
          href={`https://fonts.googleapis.com/css2?family=${font
            .split(" ")
            .join("+")}:wght@400;500&display=swap`}
          rel="stylesheet"
        />

        <Global
          styles={css`
            html {
              height: 100%;
              font-family: "'${font}', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
            }

            a:hover {
              color: "inherit";
            }

            strong {
              font-weight: 500 !important;
            }
          `}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
