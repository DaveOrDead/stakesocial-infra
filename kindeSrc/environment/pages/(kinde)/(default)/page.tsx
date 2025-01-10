"use server";

import React from "react";
import { renderToString } from "react-dom/server.browser";
import { getKindeWidget } from "@kinde/infrastructure";
import { Layout } from "../../components/Layout";
import { LayoutTwo } from "../../components/LayoutTwo";

const PageLayout = async ({ request, context }) => {
  return (
    <Layout request={request} context={context}>
      <main>
        <div class="c-widget">
          <h2>{context.widget.content.heading}</h2>
          <p>{context.widget.content.description} </p>
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
