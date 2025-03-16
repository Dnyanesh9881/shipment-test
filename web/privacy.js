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
      try {
      const weight=payload.line_items.reduce((acc, item)=> acc + item.grams);
      const data={
         topic:"shipmentService-shipment-create",
        body:{
        governmentId: "NA",
         invoiceNumber:"Ship15454",
         invoiceDate:"2023-10-06 11:56:39",
         isScheduledConfirmed: true,
        receiverDetails:{
            email: payload.customer.email,
            address: payload.customer.default_address,
            pincode: payload.customer.default_address.zip,
            phoneNo: payload.customer.default_address.phone,
            altPhoneNo: payload.customer.default_address.phone
        },
        senderDetails:{
           email: "sender@example.in",
            address: {
                city: "gurgaon",
                state: "Haryana",
                addressLine: "sample sender address line",
                pincode: "123456"
            },
            pincode: "123456",
            phoneNo: "9999999999",
            altPhoneNo: "9898989898"
        },
        paymentDetails:{
            isPaymentDone: payload.financial_status ==="paid"? true : false,
            paymentMode: "NA",
            paymentTransactionId: "NA",
            amount: payload.total_price
        },
        shipmentDetails:{
            dimensions: {
                    length: 50,
                    width: 50,
                    height: 50
                },
            weight: weight,
            vWeight: weight,
            eWayBillNo:"NA"
        },
        products: payload.line_items.map((item) => ({
          SKU: item.sku,
          price: item.price,
          quantity: item.quantity,
          productId: item.id
        }))
      },
      method:"POST",
      params:{},
      headers:{},
      query:{}
    };
    console.log("New order body:", data);
   
      const response = await axios('http://localhost:9090', {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        data:data
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error: In Shipment', error);
    }
    
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










