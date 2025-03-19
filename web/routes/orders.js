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
        totalWeight
        subtotalPriceSet{
        presentmentMoney{
        amount
        currencyCode
        }
        shopMoney{
         amount
        currencyCode}
        }
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
          countryCode
          provinceCode
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
          countryCode
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
    const response = await client.request(GET_ORDERS_QUERY);

    // console.log("ORDER response", response.data?.orders?.nodes);
    res.json(response.data?.orders?.nodes);
  } catch (error) {
    console.error("Error fetching orders:", error);

    if (error.response && error.response.body) {
      return res.status(error.response.code).json({ error: error.response.body });
    }

    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.get("/orders/:id", async (req, res) => {
  let id = req.params.id;
  console.log("Original ID:", id);

  id = `gid://shopify/Order/${id}`;
  console.log("Formatted Shopify GID:", id);

  const GET_ORDERS_QUERY = `
    query order($id: ID!) {
      order(id: $id) {
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
        totalWeight
        subtotalPriceSet {
          presentmentMoney {
            amount
            currencyCode
          }
          shopMoney {
            amount
            currencyCode
          }
        }
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
          countryCode
          provinceCode
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
          countryCode
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
  `;

  const session = res.locals.shopify.session;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized: No active session found" });
  }

  const client = new shopify.api.clients.Graphql({ session });

  try {
    const variables = { id: id }; 
    console.log("GraphQL Variables:", variables);

    const response = await client.request(GET_ORDERS_QUERY, variables); 

    if (!response.data || !response.data.order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json(response.data.order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Failed to fetch order", details: error.message });
  }
});


export default router;

const ordereceived = {
  id: 6372088479811,
  admin_graphql_api_id: 'gid://shopify/Order/6372088479811',
  app_id: 1354745,
  browser_ip: '150.242.65.72',
  buyer_accepts_marketing: true,
  cancel_reason: null,
  cancelled_at: null,
  cart_token: null,
  checkout_id: 37982585847875,
  checkout_token: '096268e279a8e215f493480eec2e9afe',
  client_details: {
    accept_language: null,
    browser_height: null,
    browser_ip: '150.242.65.72',
    browser_width: null,
    session_hash: null,
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36(KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
  },
  closed_at: null,
  company: null,
  confirmation_number: 'CEA8VNF87',
  confirmed: true,
  contact_email: 'itsamkankit@gmail.com',
  created_at: '2025-03-16T09:25:03-04:00',
  currency: 'INR',
  current_shipping_price_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  current_subtotal_price: '929.99',
  current_subtotal_price_set: {
    shop_money: { amount: '929.99', currency_code: 'INR' },
    presentment_money: { amount: '929.99', currency_code: 'INR' }
  },
  current_total_additional_fees_set: null,
  current_total_discounts: '0.00',
  current_total_discounts_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  current_total_duties_set: null,
  current_total_price: '929.99',
  current_total_price_set: {
    shop_money: { amount: '929.99', currency_code: 'INR' },
    presentment_money: { amount: '929.99', currency_code: 'INR' }
  },
  current_total_tax: '0.00',
  current_total_tax_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  customer_locale: 'en',
  device_id: null,
  discount_codes: [],
  duties_included: false,
  email: 'itsamkankit@gmail.com',
  estimated_taxes: false,
  financial_status: 'paid',
  fulfillment_status: null,
  landing_site: null,
  landing_site_ref: null,
  location_id: null,
  merchant_business_entity_id: 'MTYyMDE0NDIzMTA3',
  merchant_of_record_app_id: null,
  name: '#1019',
  note: null,
  note_attributes: [],
  number: 19,
  order_number: 1019,
  order_status_url: 'https://bubble-bazaar-store.myshopify.com/62014423107/orders/0797e0137568554fbee9b811285e8685/authenticate?key=0eb632da9d3fcb6708f8e89ff69d0d96',
  original_total_additional_fees_set: null,
  original_total_duties_set: null,
  payment_gateway_names: ['manual'],
  phone: null,
  po_number: null,
  presentment_currency: 'INR',
  processed_at: '2025-03-16T09:25:02-04:00',
  reference: null,
  referring_site: null,
  source_identifier: null,
  source_name: 'shopify_draft_order',
  source_url: null,
  subtotal_price: '929.99',
  subtotal_price_set: {
    shop_money: { amount: '929.99', currency_code: 'INR' },
    presentment_money: { amount: '929.99', currency_code: 'INR' }
  },
  tags: '',
  tax_exempt: true,
  tax_lines: [],
  taxes_included: false,
  test: false,
  token: '0797e0137568554fbee9b811285e8685',
  total_cash_rounding_payment_adjustment_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  total_cash_rounding_refund_adjustment_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  total_discounts: '0.00',
  total_discounts_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  total_line_items_price: '929.99',
  total_line_items_price_set: {
    shop_money: { amount: '929.99', currency_code: 'INR' },
    presentment_money: { amount: '929.99', currency_code: 'INR' }
  },
  total_outstanding: '0.00',
  total_price: '929.99',
  total_price_set: {
    shop_money: { amount: '929.99', currency_code: 'INR' },
    presentment_money: { amount: '929.99', currency_code: 'INR' }
  },
  total_shipping_price_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  total_tax: '0.00',
  total_tax_set: {
    shop_money: { amount: '0.00', currency_code: 'INR' },
    presentment_money: { amount: '0.00', currency_code: 'INR' }
  },
  total_tip_received: '0.00',
  total_weight: 0,
  updated_at: '2025-03-16T09:25:04-04:00',
  user_id: 81872158787,
  billing_address: {
    first_name: 'Ankit',
    address1: 'Rajouri Garden Metro Station (Pink Line) 117 Ring Road Vishal Enclave Raja Garden',
    phone: '+918340446836',
    city: 'New Delhi',
    zip: '110027',
    province: 'Delhi',
    country: 'India',
    last_name: 'Sharma',
    address2: null,
    company: null,
    latitude: 28.6506713,
    longitude: 77.12430739999999,
    name: 'Ankit Sharma',
    country_code: 'IN',
    province_code: 'DL'
  },
  customer: {
    id: 8238054375491,
    email: 'itsamkankit@gmail.com',
    created_at: '2025-03-16T07:35:33-04:00',
    updated_at: '2025-03-16T09:25:03-04:00',
    first_name: 'Ankit',
    last_name: 'Sharma',
    state: 'disabled',
    note: null,
    verified_email: true,
    multipass_identifier: null,
    tax_exempt: true,
    phone: null,
    currency: 'INR',
    tax_exemptions: [],
    admin_graphql_api_id: 'gid://shopify/Customer/8238054375491',
    default_address: {
      id: 9104903864387,
      customer_id: 8238054375491,
      first_name: 'Ankit ',
      last_name: 'Sharma',
      company: '',
      address1: 'Rajouri Garden Metro Station (Pink Line) 117 Ring Road Vishal Enclave Raja Garden',
      address2: '',
      city: 'New Delhi',
      province: 'Delhi',
      country: 'India',
      zip: '110027',
      phone: '+918340446836',
      name: 'Ankit  Sharma',
      province_code: 'DL',
      country_code: 'IN',
      country_name: 'India',
      default: true
    }
  },
  discount_applications: [],
  fulfillments: [],
  line_items: [
    {
      id: 15412085227587,
      admin_graphql_api_id: 'gid://shopify/LineItem/15412085227587',
      attributed_staffs: [],
      current_quantity: 1,
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'Pink Armchair',
      price: '750.00',
      price_set: [Object],
      product_exists: true,
      product_id: 7387448606787,
      properties: [],
      quantity: 1,
      requires_shipping: true,
      sales_line_item_group_id: null,
      sku: null,
      taxable: true,
      title: 'Pink Armchair',
      total_discount: '0.00',
      total_discount_set: [Object],
      variant_id: 42160261464131,
      variant_inventory_management: null,
      variant_title: null,
      vendor: 'Company 123',
      tax_lines: [],
      duties: [],
      discount_allocations: []
    },
    {
      id: 15412085260355,
      admin_graphql_api_id: 'gid://shopify/LineItem/15412085260355',
      attributed_staffs: [],
      current_quantity: 1,
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'Yellow Sofa',
      price: '99.99',
      price_set: [Object],
      product_exists: true,
      product_id: 7387449000003,
      properties: [],
      quantity: 1,
      requires_shipping: true,
      sales_line_item_group_id: null,
      sku: null,
      taxable: true,
      title: 'Yellow Sofa',
      total_discount: '0.00',
      total_discount_set: [Object],
      variant_id: 42160261922883,
      variant_inventory_management: null,
      variant_title: null,
      vendor: 'Home Sweet Home',
      tax_lines: [],
      duties: [],
      discount_allocations: []
    },
    {
      id: 15412085293123,
      admin_graphql_api_id: 'gid://shopify/LineItem/15412085293123',
      attributed_staffs: [],
      current_quantity: 1,
      fulfillable_quantity: 1,
      fulfillment_service: 'manual',
      fulfillment_status: null,
      gift_card: false,
      grams: 0,
      name: 'Yellow Wool Jumper',
      price: '80.00',
      price_set: [Object],
      product_exists: true,
      product_id: 7387449229379,
      properties: [],
      quantity: 1,
      requires_shipping: true,
      sales_line_item_group_id: null,
      sku: null,
      taxable: true,
      title: 'Yellow Wool Jumper',
      total_discount: '0.00',
      total_discount_set: [Object],
      variant_id: 42160262217795,
      variant_inventory_management: null,
      variant_title: null,
      vendor: 'partners-demo',
      tax_lines: [],
      duties: [],
      discount_allocations: []
    }
  ],
  payment_terms: null,
  refunds: [],
  shipping_address: {
    first_name: 'Ankit',
    address1: 'Rajouri Garden Metro Station (Pink Line) 117 Ring Road Vishal Enclave Rajouri Garden',
    phone: '+918340446836',
    city: 'New Delhi',
    zip: '110027',
    province: 'Delhi',
    country: 'India',
    last_name: 'Sharma',
    address2: null,
    company: null,
    latitude: 28.6506713,
    longitude: 77.12430739999999,
    name: 'Ankit Sharma',
    country_code: 'IN',
    province_code: 'DL'
  },
  shipping_lines: [],
  returns: []
}

