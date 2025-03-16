import express from "express";
import shopify from "../shopify.js"; // Import Shopify app setup

const router = express.Router();

// Fetch all orders
router.get("/orders", async (req, res) => {
  try {
   const GET_ORDERS_QUERY = `
  query {
    orders(first: 40, query: "financial_status:'paid'") {
      nodes { 
        id
        email
        name
        processedAt
        registeredSourceUrl
        taxesIncluded
        legacyResourceId
        fulfillable
        customerLocale
        phone
        displayFinancialStatus
        confirmed
        closed
        closedAt
        cancelReason
        cancelledAt
        createdAt
        updatedAt
        tags
        lineItems(first: 20) {
          edges {
            node { 
              id
              name
              nonFulfillableQuantity
              quantity
              sku
              taxable
              title
              unfulfilledQuantity
              variantTitle
              vendor
              originalTotalSet { 
                presentmentMoney { amount currencyCode } 
                shopMoney { amount currencyCode } 
              }
              product { 
                id 
                productType 
                title 
                vendor 
                updatedAt 
                tags 
                publishedAt 
                handle 
                descriptionHtml 
                description 
                createdAt 
              }
              variant { 
                id
                barcode
                compareAtPrice
                createdAt
                displayName
                inventoryQuantity
                price
                title
                updatedAt
                image { id altText url width }
              }
              taxLines { 
                priceSet { 
                  presentmentMoney { amount currencyCode } 
                  shopMoney { amount currencyCode } 
                } 
                rate
                ratePercentage
                title
              }
            }
          }
          pageInfo { 
            hasNextPage 
            endCursor 
            hasPreviousPage 
            startCursor 
          } 
        }
        fulfillments { 
          id
          createdAt
          updatedAt
          deliveredAt
          displayStatus
          estimatedDeliveryAt
          legacyResourceId
          name
          status
          totalQuantity
          location { id name }
          trackingInfo { company number url }
        } 
        totalPriceSet { 
          presentmentMoney { amount currencyCode } 
          shopMoney { amount currencyCode } 
        } 
        shippingLine { 
          id
          title
          carrierIdentifier
          custom
          code
          phone
          originalPriceSet { 
            presentmentMoney { amount currencyCode } 
            shopMoney { amount currencyCode } 
          }
          source
          shippingRateHandle
        }
        shippingAddress { 
          address1
          address2
          city
          country
          firstName
          lastName
          phone
          province
          zip
        }
        billingAddress { 
          address1
          address2
          city
          country
          firstName
          lastName
          phone
          province
          zip
        }
        customer { 
          id
          canDelete
          createdAt
          displayName
          email
          firstName
          lastName
          hasTimelineComment
          locale
          note
          updatedAt
        }
        currentSubtotalPriceSet { 
          presentmentMoney { amount currencyCode } 
          shopMoney { amount currencyCode } 
        }
        currentTaxLines { 
          channelLiable
          priceSet { 
            presentmentMoney { amount currencyCode } 
            shopMoney { amount currencyCode } 
          }
          rate
          ratePercentage
          title
        }
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

    // console.log("ORDER response", response.body.data.orders);
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
