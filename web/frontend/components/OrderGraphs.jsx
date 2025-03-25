import React, { useState, useEffect } from 'react';
import {
  Layout,
  LegacyCard,
  Select,
  Text
} from "@shopify/polaris";
import { Chart } from './Chart';

export function OrderGraphs() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({ labels: [], datasets: [] });
  const [timeframe, setTimeframe] = useState("Daily");
  const [completeOrderData, setCompleteOrderData] = useState({ labels: [], datasets: [] });
  useEffect(() => {
    fetch("/api/orders")
      .then(response => response.json())
      .then(orders => {
        setData(orders);
        filterData(orders, timeframe);
      });
  }, []);

  useEffect(() => {
    filterData(data, timeframe);
  }, [timeframe, data]);

  const filterData = (orders, timeframe) => {
    const groupedOrders = groupOrdersByTimeframe(orders, timeframe);
    console.log("Grouped Orders:", groupedOrders);
    
    const labels = Object.keys(groupedOrders).slice(-6);
    console.log("LABELS", labels);
  
    setFilteredData({
      labels, // Fix: Ensuring labels are correctly referenced
      datasets: [{
        label: "Total Orders",
        data: labels.map(label => groupedOrders[label] || 0),
        backgroundColor: [
          '#5C6AC4', // Indigo
          '#47C1BF', // Teal
          '#F49342', // Orange
          '#9C6ADE', // Purple
          '#50B83C', // Green
          '#DE3618'  
        ]
      }]
    });
  
    const fulfilledOrders = orders.filter(order => order.fulfillments.length !== 0);
    console.log("Fulfilled Orders:", fulfilledOrders);
    
    const groupedFulfilledOrders = groupOrdersByTimeframe(fulfilledOrders, timeframe);
    console.log("Grouped Fulfilled Orders:", groupedFulfilledOrders);
  
    const labelsFulfilled = Object.keys(groupedFulfilledOrders).slice(-6);
    console.log("Fulfilled Labels", labelsFulfilled);
  
    setCompleteOrderData({
      labels: labelsFulfilled, 
      datasets: [{
        label: "Fulfilled Orders",
        data: labelsFulfilled.map(label => groupedFulfilledOrders[label] || 0),
        backgroundColor: [
          '#5C6AC4', // Indigo
          '#47C1BF', // Teal
          '#F49342', // Orange
          '#9C6ADE', // Purple
          '#50B83C', // Green
          '#DE3618'  // Red
        ]
      }]
    });
  };
  

  const groupOrdersByTimeframe = (orders, timeframe) => {
    const grouped = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let key;
      switch (timeframe) {
        case "Daily":
          key = date.toISOString().split('T')[0];
          break;
        case "Weekly":
          key = `Week ${getWeekNumber(date)}`;
          break;
        case "Monthly":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          break;
        case "Yearly":
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toISOString().split('T')[0];
      }
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return grouped;
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - firstDayOfYear) / (24 * 60 * 60 * 1000);
    return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <>
      <div className='select-btn-container'>
        <Select
          label={<Text variant="headingMd" fontWeight="bold">Select Timeframe</Text>}
          options={["Daily", "Weekly", "Monthly", "Yearly"]}
          onChange={setTimeframe}
          value={timeframe}
          oneThird
        />
      </div>
      <Layout>
        <Layout.Section oneHalf>
          <LegacyCard title="Total Orders" sectioned>
            <Chart chartData={filteredData} line />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard title="Completed" sectioned>
            <Chart chartData={completeOrderData} bar />
          </LegacyCard>
        </Layout.Section>
        {/* <Layout.Section oneThird>
          <LegacyCard title="Remaining" sectioned>
            <Chart chartData={filteredData} bar />
          </LegacyCard>
        </Layout.Section> */}
      </Layout>
    </>
  );
};
