import React from "react";
import {
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeNonce,
  getKindeCSRF,
} from "@kinde/infrastructure";
import {
  getSVGFavicon,
  setKindeDesignerCustomProperties,
} from "../utils/kindeInfra";

export const Layout = ({ request, context, children }) => {
  return (
    <html
      lang={request.locale.lang}
      dir={request.locale.isRtl ? "rtl" : "ltr"}
      data-kinde-theme="dark"
    >
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <meta name="color-scheme" content="dark" />
        <title>{context.widget.content.page_title}</title>

        <link rel="icon" href={getSVGFavicon()} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style nonce={getKindeNonce()}>
          {`:root {
          ${setKindeDesignerCustomProperties({
            baseBackgroundColor: "#010101",
            baseLinkColor: "#ff1493",
            buttonBorderRadius: "2em",
            primaryButtonBackgroundColor: "#ff1493",
            primaryButtonColor: "#010101",
            inputBorderRadius: "0",
          })}}

            :root {
                --kinde-base-color: rgb(12, 0, 32);
                --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;

                --kinde-control-select-text-border-color: #666;
                --kinde-base-focus-outline-color: #ff1493;

                --kinde-button-letter-spacing: 0.5px;


                --kinde-button-primary-background-color-hover: transparent;
                --kinde-button-primary-color-hover: #ff1493;

            }
                [data-kinde-button-variant="primary"] {
                block-size: 3.75rem;
                }

            [data-kinde-button-variant="primary"]:hover {
                text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);
                border-color: #ff1493;
                font-size:  1.2rem;
            }
        .c-header {
        width: 10rem;
  margin: 3rem auto 1.5rem;
        }
            .c-container {
              padding: 1.5rem;
            }

            .c-widget {
                max-width: 25rem;
                width: 100%;
                margin: 0px auto;
            }
          `}
        </style>
      </head>
      <body>
        <div id="root" data-roast-root="/admin" class="c-container">
          {children}
        </div>
      </body>
    </html>
  );
};
