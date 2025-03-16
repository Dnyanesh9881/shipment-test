// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import ordersRoutes from "./routes/orders.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
console.log("WORKING FINE");
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({
    webhookHandlers: PrivacyWebhookHandlers
  })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/store/info", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const query = `query getShopInfo {
      shop {
        id
        name
        myshopifyDomain
        email
        contactEmail
        currencyCode
        ianaTimezone
        timezoneAbbreviation
        timezoneOffset
        timezoneOffsetMinutes
        createdAt
        primaryDomain {
          url
        }
        shopOwnerName
        billingAddress {
          address1
          address2
          city
          province
          country
          zip
        }
        orderNumberFormatPrefix
        orderNumberFormatSuffix
        customerAccounts
        fulfillmentServices {
          id
          serviceName
        }
      }
    }`;


    const response = await client.request(query);

    console.log("storeInfo", response.data.shop);

    res.status(200).send(response.data.shop);
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/api/collections", async (req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const query =
      `query CustomCollectionList {
  collections(first: 50) {
    nodes {
      id
      handle
      title
      updatedAt
      descriptionHtml
      sortOrder
      templateSuffix
    }
  }
}`;
    const response = await client.request(query);

    // console.log("collections", response.data.collections.nodes);

    res.status(200).send(response.data.collections.nodes);
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).send({ error: error.message });
  }
});


app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);
  // console.log("countData", countData);
  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));
app.use("/api", ordersRoutes);

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT, () => {

});
