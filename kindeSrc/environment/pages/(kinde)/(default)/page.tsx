"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeNonce,
  getKindeWidget,
  getKindeCSRF,
} from "@kinde/infrastructure";
import {
  getLogoUrl,
  getSVGFavicon,
  setKindeDesignerCustomProperties,
} from "../../utils/kindeInfra";

const Layout = async ({ request, context }) => {
  return (
    <html lang={request.locale.lang} dir={request.locale.isRtl ? "rtl" : "ltr"}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.page_title}</title>

        <link rel="icon" href={getSVGFavicon()} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style nonce={getKindeNonce()}>
          {`:root {
          ${setKindeDesignerCustomProperties({
            baseBackgroundColor: "#fff",
            baseLinkColor: "#230078",
            buttonBorderRadius: "0.5rem",
            primaryButtonBackgroundColor: "#230078",
            primaryButtonColor: "#fff",
            inputBorderRadius: "0.5rem",
          })}}
          `}
        </style>
        <style nonce={getKindeNonce()}>
          {`
            :root {
                --kinde-base-color: rgb(12, 0, 32);
                --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;
            }

            [data-kinde-control-select-text]{
                background-color: rgb(250, 250, 251);
            }
            .c-container {
              padding: 1.5rem;
              display: grid;
              gap: 230px;
            }
            .c-widget {
                max-width: 400px;
                width: 100%;
                margin: 0px auto;
            }
            .c-footer {
              border-top: 1px solid rgba(12, 0, 32, 0.08);
              padding-block: 1.5rem;
              display: flex;
              justify-content: space-between;
            }
            .c-footer-links {
                display: flex;
                gap: 1.5rem;
            }
          `}
        </style>
      </head>
      <body>
        <div id="root" data-roast-root="/admin" class="c-container">
          <header class="c-header">
            <img src={getLogoUrl()} alt={context.widget.content.logo_alt} />
          </header>
          <main>
            <div class="c-widget">
              <h2>{context.widget.content.heading} DEFAULT HARDCODED</h2>
              <p>{context.widget.content.description} </p>
              <div>{getKindeWidget()}</div>
            </div>
          </main>
          <footer class="c-footer">
            <p class="c-no-account-link">
              No account? <a href="">Sign up for free</a>
            </p>
            <ul class="c-footer-links">
              <li>
                <a href="">Privacy</a>
              </li>
              <li>
                <a href="">Terms</a>
              </li>
              <li>
                <a href="">Get help</a>
              </li>
            </ul>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default async function Page(event) {
  const page = await Layout({ ...event });
  return renderToString(page);
}
