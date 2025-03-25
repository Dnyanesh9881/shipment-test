import { useAppBridge } from '@shopify/app-bridge-react';
import { Grid, LegacyCard, Page } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from "react-router-dom";

function OrderTracking() {
  // const [length, setLength] = useState(0);
   const shopify = useAppBridge();
  //  const [orderData, setOrderData]=useState({});
   const [shipmentData, setShipmentData]=useState({})
  let { awb } = useParams();
  // console.log(useParams())
  console.log("useParams()",useParams());
  // awb = "TEL00098916";
  
  const fetchLocations = async () => {
    try {
      const response = await fetch(`/api/locations`);
      if (!response.ok) {
        throw new Error("Failed to fetch Locations data");
      }
      const data = await response.json();
      console.log("Fetched Locations:", data);
    } catch (error) {
      console.error("Error fetching Locations:", error);
    }
  };

 
  const fetchShipment = async () => {
    try {
      if (!awb) return; // Avoid making a request if AWB is not available
      const response = await fetch(`/api/shipment/${awb}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shipment data");
      }
      const data = await response.json();
      console.log("Fetched Shipment:", data[0]);
      setShipmentData(data[0]);
    } catch (error) {
      console.error("Error fetching shipment:", error);
    }
  };

 
  useEffect(() => {
 
    fetchShipment();
    fetchLocations();
  }, [awb]); 

 
  // useEffect(() => {
  //   if (!orderData?.fulfillments?.[0]?.trackingInfo?.[0]?.number) return;
  //   const awb = orderData.fulfillments[0].trackingInfo[0].number;
  //   console.log("AWB:", awb);
  //   fetchShipment(awb);
  // }, [orderData]); 

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
                  <p>Order No: {shipmentData?.orderNo}</p>
                  <p>Date: {shipmentData?.invoiceDate}</p>
                  <p>Amount: {shipmentData?.paymentDetails?.amount}</p>
                  <p>Weight: {shipmentData?.shipmentDetails?.weight}</p>
                </div>
              </LegacyCard>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 12, xl: 8 }}>
              <LegacyCard title="Delivery Address" sectioned>
                <div>
                  <p>{`${shipmentData?.receiverDetails?.address.addressLine}, ${shipmentData?.receiverDetails?.address.state}, ${shipmentData?.receiverDetails?.address.city}` || ""}</p>
                  <p>{`${shipmentData?.receiverDetails?.address.state}, ${shipmentData?.receiverDetails?.address.city}, ${shipmentData?.receiverDetails?.address.pinCode}`}</p>
                  <p>{shipmentData?.receiverDetails?.phoneNo}</p>
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
