"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import {
  createKindeAPI,
  getKindeRequiredCSS,
  getKindeRequiredJS,
  getKindeNonce,
  getKindeWidget,
  getKindeCSRF,
} from "@kinde/infrastructure";

export const pageSettings = {
  bindings: {
    "kinde.fetch": {},
    "kinde.env": {},
    url: {},
  },
};

const Layout = async ({ request, context }) => {
  const kindeAPI = await createKindeAPI({
    context: {
      domains: {
        kindeDomain: kinde.env.get("KINDE_DOMAIN").value,
      },
    },
  });

  const { data: businessRes } = await kindeAPI.get({
    endpoint: "business",
  });
  const { business } = businessRes;

  const { data: envRes } = await kindeAPI.get({
    endpoint: "environment",
  });
  const { environment } = envRes;

  return (
    <html lang={request.locale.lang} dir={request.locale.isRtl ? "rtl" : "ltr"}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="csrf-token" content={getKindeCSRF()} />
        <title>{context.widget.content.page_title}</title>

        <link rel="icon" href={environment.favicon_svg} type="image/svg+xml" />
        {getKindeRequiredCSS()}
        {getKindeRequiredJS()}
        <style nonce={getKindeNonce()}>
          {`
            :root {
                --kinde-base-color: rgb(12, 0, 32);
                --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;


                --kinde-button-border-radius: ${environment.button_border_radius}px;
                --kinde-button-primary-background-color: ${environment.button_color.hex};
                --kinde-button-primary-color: ${environment.button_text_color.hex};

                --kinde-control-select-text-border-radius: ${environment.input_border_radius}px;
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
            <img src={environment.logo} />
          </header>
          <main>
            <div class="c-widget">
              <h2>{context.widget.content.heading} INDEX!</h2>
              <p>{context.widget.content.description}</p>
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
