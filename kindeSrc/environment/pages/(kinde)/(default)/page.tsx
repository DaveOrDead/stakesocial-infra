"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import { getKindeWidget, getDarkModeLogoUrl } from "@kinde/infrastructure";
import { Layout } from "../../components/Layout";

const PageLayout = async ({ request, context }) => {
  return (
    <Layout request={request} context={context}>
      <main>
        <div class="c-widget">
          <header>
            <img
              className="c-header"
              src={getDarkModeLogoUrl()}
              alt={context.widget.content.logo_alt}
            />
          </header>
          <h2>{context.widget.content.heading}</h2>
          <p class="c-strapline">{context.widget.content.description} </p>
          <div>{getKindeWidget()}</div>
        </div>
      </main>
    </Layout>
  );
};

export default async function Page(event) {
  const page = await PageLayout({ ...event });
  return renderToString(page);
}
