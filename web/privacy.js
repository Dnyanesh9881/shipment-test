import { DeliveryMethod } from "@shopify/shopify-api";
import axios from "axios";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {

  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },
  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("New order received:", payload);
      // try {
      //   const weight = payload.line_items.reduce((acc, item) => acc + item.grams, 0);

      //   const data = {
      //     governmentId: "NA",
      //     invoiceNumber: "Ship15454",
      //     invoiceDate: "2023-10-06 11:56:39",
      //     isScheduledConfirmed: true,
      //     receiverDetails: {
      //       email: payload.customer.email,
      //       address: {
      //         city: payload.customer.default_address.city,
      //         state: payload.customer.default_address.province,
      //         addressLine: payload.customer.default_address.address1,
      //         pincode: payload.customer.default_address.zip
      //       },
      //       pincode: payload.customer.default_address.zip,
      //       phoneNo: payload.customer.default_address.phone,
      //       altPhoneNo: payload.customer.default_address.phone
      //     },
      //     senderDetails: {
      //       email: "sender@example.in",
      //       address: {
      //         city: "gurgaon",
      //         state: "Haryana",
      //         addressLine: "sample sender address line",
      //         pincode: "123456"
      //       },
      //       pincode: "123456",
      //       phoneNo: "9999999999",
      //       altPhoneNo: "9898989898"
      //     },
      //     paymentDetails: {
      //       isPaymentDone: payload.financial_status === "paid" ? true : false,
      //       paymentMode: "NA",
      //       paymentTransactionId: "NA",
      //       amount: payload.total_price
      //     },
      //     shipmentDetails: {
      //       dimensions: {
      //         length: 50,
      //         width: 50,
      //         height: 50
      //       },
      //       weight: weight,
      //       vWeight: weight,
      //       eWayBillNo: "NA"
      //     },
      //     products: payload.line_items.map((item) => ({
      //       SKU: 'SKU1234',
      //       price: item.price,
      //       quantity: item.quantity,
      //       productId: item.id
      //     }))
      //   };

      //   console.log("New order body:", data);

      //   const response = await axios(`${process.env.SHIPMENT_SERVICE_URL}/user/shipment/new`, {
      //     method: "POST",
      //     headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFua2l0Lm1pc2hyYSIsInVzZXJFbWFpbCI6ImFua2l0Lm1pc2hyYUB0ZWNoZWFnbGUuaW4iLCJwcm9qZWN0TmFtZSI6IlRlc3RpbmciLCJpYXQiOjE3MzU4Mjc2MDB9.I6R5kmY8HxowzMuZFeLWaUGFp0rFHQnGfS92Uil_5Nc" },
      //     data: data
      //   });
      //   console.log(response.data);
      // } catch (error) {
      //   console.error('Error: In Shipment', error);
      // }
    }
  },
  PRODUCTS_UPDATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("Product updated received:", payload);
    },
  },
};










