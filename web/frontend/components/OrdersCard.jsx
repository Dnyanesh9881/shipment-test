import { useState } from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { useQuery } from "react-query";

export function OrdersCard() {
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  

  return (
    <Card title="Orders" sectioned>
      <TextContainer>
        <Text as="h4" variant="headingMd">
          Total Orders:
          <Text variant="bodyMd" as="p" fontWeight="semibold">
            {isLoadingOrders ? "-" : data?.length || 0}
          </Text>
        </Text>
        {/* Show list of orders */}
        {data?.map((order) => (
          <Text key={order.id}>{order.name} - {order.total_price} USD</Text>
        ))}
      </TextContainer>
    </Card>
  );
}
