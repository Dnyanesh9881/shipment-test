import express from "express";
import shopify from "../shopify.js"; // Import Shopify app setup
import axios from "axios";

const router = express.Router();

// Fetch all orders
router.post("/shipment/create", async (req, res) => {
    try {
        // Initialize Shopify GraphQL Client
        const client = new shopify.api.clients.Graphql({
            session: res.locals.shopify.session,
        });
        console.log("ORDER DATA", req.body);
        const shipmentResp = await createShipment(req.body);
        if (shipmentResp.status === "failed") {
            return { ...shipmentResp, statusCode: 500 };
        }
        console.log("SHIPMENT CREATED DATA", shipmentResp.data.data);
        console.log("IDDDDDDDDD", req.body.id);
        const getFulfillmentOrderIdResp = await getFulfillmentOrderId(req.body.id, client);
        if (getFulfillmentOrderIdResp.status === "failed") {
            return { ...shipmentResp, statusCode: 500 };
        }
        const fulfillmentorderId = getFulfillmentOrderIdResp.data;
        const CREATE_FULFILLMENT_MUTATION = `
    mutation fulfillmentCreate($input: FulfillmentInput!) {
      fulfillmentCreate(fulfillment: $input) {
        fulfillment {
          id
          status
          createdAt
          updatedAt
          trackingInfo {
            company
            number
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }`;
 console.log("shipmentResp.data.assignedAWBNumbers", shipmentResp.data.data.assignedAWBNumbers);
        const variables = {
            input: {
                lineItemsByFulfillmentOrder: [
                    {
                        fulfillmentOrderId: fulfillmentorderId,
                        fulfillmentOrderLineItems: []
                    }
                ],
                trackingInfo: {
                    number:shipmentResp.data.data.assignedAWBNumbers,
                    url:`https://4fbc-106-219-154-30.ngrok-free.app/tracking/${shipmentResp.data.data.assignedAWBNumbers}`
                },
                notifyCustomer: true,
                originAddress: {
                    address1: req.body.shippingAddress.address1,
                    countryCode: req.body.shippingAddress.countryCode,
                    city: req.body.shippingAddress.city,
                    provinceCode: req.body.shippingAddress.provinceCode,
                    zip: req.body.shippingAddress.zip
                }
            }
        };
        console.log("CREATE_FULFILLMENT_MUTATION", CREATE_FULFILLMENT_MUTATION, JSON.stringify(variables));
        const response = await client.request(CREATE_FULFILLMENT_MUTATION, {
            variables: variables
        });

        console.log("Created Fullfilment", JSON.stringify(response.data.fulfillmentCreate.fulfillment));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching fulfillment order ID:", error);
        res.status(500).json({ error: error.message });
    }
});
async function createShipment(payload) {
    try {
        // const weight = payload.lineItems.edges.reduce((acc, item) => acc + item["node"].grams, 0);

        const data = {
            governmentId: "NA",
            invoiceNumber: "Ship15454",
            invoiceDate: payload.createdAt,
            isScheduledConfirmed: true,
            orderNo:payload.name,
            destinationLocation:payload.destinationLocation,
            sourceLocation: payload.sourceLocation,
            hubLocation: payload.hubLocation,
            receiverDetails: {
                email: payload.customer.email,
                address: {
                    city: payload.shippingAddress.city,
                    state: payload.shippingAddress.province,
                    addressLine: payload.shippingAddress.address1,
                    pincode: payload.shippingAddress.zip
                },
                pincode: payload.shippingAddress.zip,
                phoneNo: payload.shippingAddress.phone,
                altPhoneNo: payload.shippingAddress.phone
            },
            senderDetails: {
                email: "sender@example.in",
                address: {
                    city: payload.fulfillmentOrders?.edges[0]?.node?.assignedLocation?.city,
                    state: payload.fulfillmentOrders?.edges[0]?.node?.assignedLocation?.province,
                    addressLine: payload.fulfillmentOrders?.edges[0]?.node?.assignedLocation?.address1,
                    pincode: payload.fulfillmentOrders?.edges[0]?.node?.assignedLocation?.zip
                },
                pincode: payload.fulfillmentOrders?.edges[0]?.node?.assignedLocation?.zip,
                phoneNo: "9999999999",
                altPhoneNo: "9898989898"
            },
            paymentDetails: {
                isPaymentDone: payload.displayFinancialStatus === "PAID" ? true : false,
                paymentMode: "NA",
                paymentTransactionId: "NA",
                amount: payload.subtotalPriceSet.presentmentMoney.amount
            },
            shipmentDetails: {
                dimensions: {
                    length: 50,
                    width: 50,
                    height: 50
                },
                weight: payload.totalWeight,
                vWeight: payload.totalWeight,
                eWayBillNo: "NA"
            },
            products: payload.lineItems.edges.map((item) => ({
                SKU: 'SKU1234',
                price: item["node"].originalTotalSet.presentmentMoney.amount,
                quantity: item["node"].quantity,
                productId: item["node"].id
            }))

        };

        console.log("New order body:", data);

        const response = await axios('http://localhost:5001/v1/user/shipment/new', {
            method: "POST",
            headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFua2l0Lm1pc2hyYSIsInVzZXJFbWFpbCI6ImFua2l0Lm1pc2hyYUB0ZWNoZWFnbGUuaW4iLCJwcm9qZWN0TmFtZSI6IlRlc3RpbmciLCJpYXQiOjE3MzU4Mjc2MDB9.I6R5kmY8HxowzMuZFeLWaUGFp0rFHQnGfS92Uil_5Nc" },
            data: data
        });
        //   console.log("SHIPMENT DATA",response.data);
       return response;
    } catch (error) {
        console.error('Error: Create Shipment', error);
        return { status: "failed", message: "Shipment creation error" };
    }

}

async function getFulfillmentOrderId(orderId, client) {
    try {
        const query =
            `{
order(id: "${orderId}") {
id
name
fulfillmentOrders(first: 10) {
  edges {
    node {
      id
      status
      lineItems(first: 10) {
        edges {
          node {
            id
            totalQuantity
            remainingQuantity
            lineItem {
              id
              title
            }
          }
        }
      }
    }
  }
}
}
}
`;
        const fulfillmentOrderIdResp = await client.request(query);
        console.log("fulfillmentOrderIdResp", fulfillmentOrderIdResp.data.order.fulfillmentOrders.edges[0].node.id);
        return { status: "success", message: "Shipment created successfully", data: fulfillmentOrderIdResp.data.order.fulfillmentOrders.edges[0].node.id }
    } catch (error) {
        console.log("ERROR IN GETING FULFILLMENT ORDER ID", error);
        return { status: "failed", message: "Error in getting fulfullment order Id" };
    }
}
router.get("/shipment/:awb", async(req, res) => {
  try {
    const awb = req.params.awb;

    const response = await axios(`http://localhost:5001/v1/user/shipment/get/${awb}`, {
        method: "GET",
        headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFua2l0Lm1pc2hyYSIsInVzZXJFbWFpbCI6ImFua2l0Lm1pc2hyYUB0ZWNoZWFnbGUuaW4iLCJwcm9qZWN0TmFtZSI6IlRlc3RpbmciLCJpYXQiOjE3MzU4Mjc2MDB9.I6R5kmY8HxowzMuZFeLWaUGFp0rFHQnGfS92Uil_5Nc" },
    });
      console.log("SHIPMENT DATA",response.data.data);
      return res.status(200).json(response.data.data);
  } catch (error) {
    console.log("Error In getting shipment", error);
    res.status(500).json({ error: error.message });
  }
})

router.get("/locations", async (req, res) => {
  
    const GET_ORDERS_QUERY = `query {
        locations(first: 10) {
    edges {
      node {
        id
        legacyResourceId
        name
        address {
          address1
          address2
          city
          province
          country
          zip
          latitude
          longitude
        }
        createdAt
      }
    }
  }
      }`

    const session = res.locals.shopify.session;
  
    if (!session) {
      return res.status(401).json({ error: "Unauthorized: No active session found" });
    }
  
    const client = new shopify.api.clients.Graphql({ session });
        
    try {
  
      const response = await client.request(GET_ORDERS_QUERY);
       console.log("GET LOCATIONS RESPONSE", response.data.locations.edges);
      if (!response.data.locations || !response.data.locations.edges) {
        return res.status(404).json({ error: "LOCATIONS not found" });
      }
  
      return res.json(response.data.locations.edges);
    } catch (error) {
      console.error("Error fetching LOCATIONS:", error);
      return res.status(500).json({ error: "Failed to fetch LOCATIONS", details: error.message });
    }
  });
export default router;

