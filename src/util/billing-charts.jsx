import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


export const BillingStatusPieChart = ({ billingHistory }) => {
    const [chartData, setChartData] = useState({
      series: [],
      options: {},
    });
  
    useEffect(() => {
      // Count bills by status
      const statusCounts = billingHistory.reduce((acc, bill) => {
        acc[bill.status] = (acc[bill.status] || 0) + 1;
        return acc;
      }, {});
  
      const statuses = ['Paid', 'Pending', 'Overdue'];
      const counts = statuses.map((status) => statusCounts[status] || 0);
  
      setChartData({
        series: counts,
        options: {
          chart: {
            type: 'pie',
          },
          labels: statuses,
          legend: {
            position: 'bottom',
          },
            colors: ['#87b37a', '#4c6663', '#2a1e5c'],  
        },
    
      });
    }, [billingHistory]);

    /**
    |--------------------------------------------------
    |  'primary': '#87b37a',     //sage green
          'secondary': '#4c6663',  //bluish gray 
          'accent': '#2a1e5c',      //dark purple
          'neutral': '#fbf5f3',    //dark brown
          'base-100': '#ffffff',    //white
          'info': '#9ce37d',        //bright light green    
    |--------------------------------------------------
    */
  
    return (
      <div className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4">Bills by Status</h2>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height="350"
        />
      </div>
    );

};


export const BillingAmountBarChart = ({ billingHistory }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    // Calculate total amount per company
    const companyAmounts = billingHistory.reduce((acc, bill) => {
      acc[bill.companyName] = (acc[bill.companyName] || 0) + bill.amount;
      return acc;
    }, {});

    const companies = Object.keys(companyAmounts);
    const amounts = companies.map((company) => companyAmounts[company]);

    setChartData({
      series: [
        {
          name: 'Total Amount',
          data: amounts,
        },
      ],
      options: {
        chart: {
          type: 'bar',
        },
        xaxis: {
          categories: companies,
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        
        colors: [ '#4c6663'],  
      },
    });
  }, [billingHistory]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Total Amount Billed per Company</h2>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height="350"
      />
    </div>
  );
};