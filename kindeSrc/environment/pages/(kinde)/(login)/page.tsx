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
  getDarkModeLogoUrl,
} from "../../utils/kindeInfra";

const Layout = async ({ request, context }) => {
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
          `}
        </style>
        <style nonce={getKindeNonce()}>
          {`
            :root {
                --kinde-base-color: rgb(12, 0, 32);
                --kinde-base-font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica, Arial, Segoe UI, Roboto, sans-serif;

                --kinde-control-select-text-border-color: #666;
                --kinde-base-focus-outline-color: #ff1493;

                --kinde-button-block-size: 3.75rem;
                --kinde-button-font-size: 1.2rem;
                --kinde-button-letter-spacing: 0.5px;


                --kinde-button-primary-background-color-hover: transparent;
                --kinde-button-primary-color-hover: #ff1493;

            }

            [data-kinde-button-variant="primary"]:hover {
                text-shadow: 0 0 1px rgba(0, 0, 0, 0.8);
                border-color: #ff1493;
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

         .c-nav-tabs {
  align-items: center;
  background-color: #010101;
  display: flex;
  opacity: 1;
  text-transform: uppercase;
  transition: opacity 250ms;
}

.c-nav-tabs--spacing-default {
  margin-bottom: 1rem;
}



.h-is-scrolling-down .c-nav-tabs {
  opacity: 0;
  transition: opacity 250ms;
}


.c-nav-tabs__item {
  display: flex;
  width: 100%;
}

.c-nav-tabs__link {
  align-items: center;
  border-bottom: 2px solid transparent;
  color: #c6c6c6;
  display: flex;
  justify-content: center;
  padding: 1rem 0 0.75rem;
  text-align: center;
  text-decoration: none;
  width: 100%;
}

.c-nav-tabs__link.is-active {
  border-bottom-color: #ff1493;
  color: #fff;
}

.c-nav-tabs__link.is-active:focus,
.c-nav-tabs__link:active {
  outline: none;
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
              <ul class="c-nav-tabs c-nav-tabs--spacing-4x-large">
                <li class="c-nav-tabs__item" role="presentation">
                  <a class="c-nav-tabs__link is-active" href="">
                    <span class="c-nav-tabs__label">Login</span>
                  </a>
                </li>
                <li class="c-nav-tabs__item" role="presentation">
                  <a class="c-nav-tabs__link" href="">
                    <span class="c-nav-tabs__label">Sign Up</span>
                  </a>
                </li>
              </ul>
              <div>{getKindeWidget()}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
};

export default async function Page(event) {
  const page = await Layout({ ...event });
  return renderToString(page);
}
