import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { Card, OrderDetails, OrderGraphs } from "../components";
import { useState } from "react";
import { useQuery } from "react-query";

export default function HomePage() {
  const [allOrders, setAllOrders] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCollections, setTotalCollections] = useState([]);

  const { allOrdersData, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setAllOrders(data);
      console.log("ALL ORDERS DATA", data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { getFullfilmentOrderId, refetch: fetFulfillmentOrderId } = useQuery({
    queryKey: ["fulfillment"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/fulfillment");
        const data = await response.json();
        console.log("FULFILLMENT ORDER ID", data);
        return data;
      } catch (error) {
        console.log("ERROR IN GETTING FULFILLMENTORDER ID ", error);
      }
    },
    refetchOnWindowFocus: false,
  });
  const {
    productCountData,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["productCount"],
    queryFn: async () => {
      const response = await fetch("/api/products/count");
      const data = await response.json();
      console.log("productCount", data)
      setTotalProducts(data?.count);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    collectionCountData,
    refetch: refetchCollectionCount
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch("/api/collections");
      const data = await response.json();
      console.log("collections", data)
      setTotalCollections(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });
  return (
    <Page fullWidth>
      <div className="home-section">
        <div className="graphs-section">
          <OrderGraphs />
        </div>
        <div className="cards-section">
          <Layout>
            <Card title="Total Order" data={allOrders.length} />
            <Card title="Fullfilled Order" data={allOrders.filter((order) => order.fulfillments.length !==0).length} />
            <Card title="Remaining Order" data={allOrders.length - allOrders.filter((order) => order.fulfillments.length !==0).length} />
            <Card title="Total Products" data={totalProducts} />
            <Card title="Total Collections" data={totalCollections.length} />
          </Layout>
        </div>
        <div className="order-details-section">
          {/* <OrderDetails /> */}
        </div>
      </div>
    </Page>
  );
}