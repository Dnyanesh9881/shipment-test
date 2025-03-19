import { useAppBridge } from '@shopify/app-bridge-react';
import { Grid, LegacyCard, Page } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";

function OrderTracking() {
  const [length, setLength] = useState(0);
   const shopify = useAppBridge();
   const [orderData, setOrderData]=useState({});
  let { id } = useParams();
  id = "6377672409155";

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      console.log("fetch Order", response.data);
      setOrderData(response.data);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error; 
    }
  };
   useEffect(()=>{
    fetchOrder();
   }, [])

  const { data: shipmentData, refetch: fetchShipment } = useQuery({
    queryKey: ["shipment", orderData?.fulfillments?.[0]?.trackingInfo?.[0]?.number],
    queryFn: async () => {
      if (!orderData?.fulfillments?.[0]?.trackingInfo?.[0]?.number) return null;
      const awb = orderData.fulfillments[0].trackingInfo[0].number;
      console.log("AWB", awb);

      const response = await fetch(`/api/shipment/${awb}`);
      if (!response.ok) throw new Error("Failed to fetch shipment data");
      return response.json();
    },
    enabled: !!orderData?.fulfillments?.[0]?.trackingInfo?.[0]?.number,
    refetchOnWindowFocus: false,
  });

  return (
    <Page fullWidth>
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard title="Order Tracking" sectioned>
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-10 hh-grayBox pt45 pb20">
                  <div className="row justify-content-between">
                    {shipmentData?.d_Status?.map((code) => (
                      <div className="order-tracking completed" key={code.statusCode}>
                        <span className="is-complete"></span>
                        <p style={{ fontWeight: "600" }}>
                          {code.title} <span style={{ fontWeight: "500" }}>Mon, June 24</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </LegacyCard>
        </Grid.Cell>

        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 12, xl: 8 }}>
              <LegacyCard title="Order Details" sectioned>
                <div>
                  <p>Order No: {orderData?.name}</p>
                  <p>Date: {orderData?.createdAt}</p>
                  <p>Amount: {orderData?.subtotalPriceSet?.presentmentMoney?.amount}</p>
                  <p>Weight: {orderData?.totalWeight}</p>
                </div>
              </LegacyCard>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 12, xl: 8 }}>
              <LegacyCard title="Delivery Address" sectioned>
                <div>
                  <p>{`${orderData?.shippingAddress?.address1} ${orderData?.shippingAddress?.address2 || ''}`}</p>
                  <p>{orderData?.shippingAddress?.zip}</p>
                  <p>{orderData?.shippingAddress?.phone}</p>
                </div>
              </LegacyCard>
            </Grid.Cell>
          </Grid>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

export default OrderTracking;
