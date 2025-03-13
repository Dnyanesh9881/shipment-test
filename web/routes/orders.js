import express from "express";
import shopify from "../shopify.js"; // Import Shopify app setup

const router = express.Router();

// Fetch all orders
router.get("/orders", async (req, res) => {
  try {
    const GET_ORDERS_QUERY = `
      query {
        orders(first: 40, query: "financial_status:paid") {
          nodes {
            id
            name
            displayFulfillmentStatus
          }
        }
      }
    `;

    const session = res.locals.shopify.session;

    if (!session) {
      return res.status(401).json({ error: "Unauthorized: No active session found" });
    }

    const client = new shopify.api.clients.Graphql({ session });

    // Send query in the correct format
    const response = await client.query({
      data: { query: GET_ORDERS_QUERY }
    });

    console.log("ORDER response", response.body.data.orders);
    res.json(response.body.data.orders.nodes);
  } catch (error) {
    console.error("Error fetching orders:", error);

    if (error.response && error.response.body) {
      return res.status(error.response.code).json({ error: error.response.body });
    }

    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.post("/orders/create", (req, res)=>{
  console.log("req.body", req.body);
})
export default router;
