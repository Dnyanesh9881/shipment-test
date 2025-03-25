import { useAppBridge } from '@shopify/app-bridge-react';
import { Page, LegacyCard, DataTable, Button } from '@shopify/polaris';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

function menu() {
  const [allOrders, setAllOrders] = useState([]);
  const [rowsData, setRowsData] = useState([]);
 const shopify = useAppBridge();
 const navigate=useNavigate();
 console.log("SHOPIFY", shopify);
  const { allOrdersData, refetch: fetchAllOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      let data = await response.json();
      setAllOrders(data);
       data= data.filter(order=> order.cancelledAt === null);
      const rowData = data.map((order) => ([
        order.name, 
        'Processing', 
        `${order?.customer?.firstName} ${order?.customer?.lastName}`, 
        order.totalWeight, 
        `${order.shippingAddress?.address1}, ${order.shippingAddress?.city}, ${order.shippingAddress?.zip}`, 
       !order.isDeliverable ? "Not Deliverable":order.fulfillments.length===0? <Button primary onClick={() => handleCreateShipment(order)}>Create Shipment</Button>: <Button monochrome outline  onClick={() => trackOrder(order)}>Track Order</Button>
      ]));
      setRowsData(rowData);
      console.log("ROW DATA", data);
      console.log("ROW DATA", rowData);

      return data;
    },
    refetchOnWindowFocus: false,
  });
  // const rows = [
  //   ['#1001', 'Processing', 'John Doe', '2.5kg', '123 Main St, NY', <Button onClick={() => handleCreateShipment(order)}>Create Shipment</Button>],
  //   ['#1002', 'Shipped', 'Jane Smith', '1.2kg', '456 Elm St, LA', <Button onClick={() => handleCreateShipment(order)}>Create Shipment</Button>],
  //   ['#1003', 'Delivered', 'Alice Johnson', '3.0kg', '789 Pine St, TX', <Button onClick={() => handleCreateShipment(order)}>Create Shipment</Button>],
  //   ['#1004', 'Out for Delivery', 'Bob Brown', '2.8kg', '321 Oak St, FL', <Button onClick={() => handleCreateShipment(order)}>Create Shipment</Button>],
  //   ['#1005', 'Pending', 'Charlie White', '4.5kg', '654 Maple St, IL', <Button onClick={() => handleCreateShipment(order)}>Create Shipment</Button>],
  // ];

  async function handleCreateShipment(order) {
    try {
      const shop=shopify?.config?.shop
      const host=shopify?.config?.host
      const resp = await fetch(`/api/shipment/create?shop=${shop}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(order),
      });
  
      if (!resp.ok) {
        throw new Error(`Server Error: ${resp.statusText}`);
      }
  
      const data = await resp.json();
      console.log("Shipment response:", data);
      fetchAllOrders();
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  }
  function trackOrder(order){
    console.log(order);
    console.log(order.fulfillments[0]?.trackingInfo[0]?.number)
    navigate(`/order/${order.fulfillments[0]?.trackingInfo[0]?.number}`);
  }
  return (
    <Page title="ORDERS" fullWidth>
      <LegacyCard fullWidth>
        <DataTable
          columnContentTypes={[
            'text', // Order No
            'text', // Order Status
            'text', // Customer Name
            'text', // Weight
            'text', // Drop Address
            'text', // Action (Button)
          ]}
          headings={[
            'Order No',
            'Order Status',
            'Customer Name',
            'Weight',
            'Drop Address',
            'Action',
          ]}
          rows={rowsData}
        />
      </LegacyCard>
    </Page>
  );
}
export default menu;