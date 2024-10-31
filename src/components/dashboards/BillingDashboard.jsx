import React, { useEffect, useState } from 'react';
import ThemeControl from '../ThemeControl';
import { BellAlertIcon, CheckIcon, ClockIcon, QuestionMarkCircleIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { formatMTTR } from '../../util/date';

const BillingDashboard = () => {

  // Latest billing history
  const [billingHistory, setBillingHistory] = useState([
    { id: 1, date: '2023-06-01', paidDate: '2023-06-05', status: 'Paid', amount: 1000 },
    { id: 2, date: '2023-07-01', paidDate: '-', status: 'Pending', amount: 1200 },
    { id: 3, date: '2023-08-01', paidDate: '-', status: 'Pending', amount: 1100 },
    { id: 4, date: '2023-09-01', paidDate: '2023-09-03', status: 'Paid', amount: 1300 },
    { id: 5, date: '2023-10-01', paidDate: '-', status: 'Pending', amount: 1250 },
  ]);

  // Payment history for the last 6 months
  const [paymentHistory, setPaymentHistory] = useState([
    { month: 'May', amount: 950 },
    { month: 'Jun', amount: 1000 },
    { month: 'Jul', amount: 1200 },
    { month: 'Aug', amount: 1100 },
    { month: 'Sep', amount: 1300 },
    { month: 'Oct', amount: 1250 },
  ]);

  // Financial summaries
  const [financialSummaries, setFinancialSummaries] = useState([
    { category: 'Rent', amount: 5000 },
    { category: 'Security Deposit', amount: 2000 },
    { category: 'Meeting Room Bookings', amount: 800 },
    { category: 'Cleaning/Services', amount: 600 },
    { category: 'Parking', amount: 400 },
    { category: 'Rebate', amount: -300 },
  ]);

  // Overdue payments with penalties
  const [overduePayments, setOverduePayments] = useState([
    { id: 1, date: '2023-07-01', dueDate: '2023-07-05', status: 'Overdue', time: 12343, penalty: 50, amount: 1200 },
    { id: 2, date: '2023-08-01', dueDate: '2023-08-05', status: 'Overdue', time: 3232, penalty: 75, amount: 1100 },
  ]);

  // Line chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
    },
    xaxis: {
      categories: paymentHistory.map(item => item.month),
    },
    stroke: {
      curve: 'smooth',
    },
  };

  const chartSeries = [
    {
      name: 'Amount',
      data: paymentHistory.map(item => item.amount),
    },
  ];

  // Filter out the rebate and prepare data for the pie chart
  const filteredSummaries = financialSummaries.filter(item => item.category !== 'Rebate');
  const pieChartOptions = {
    chart: {
      type: 'pie',
    },
    labels: filteredSummaries.map(item => item.category),
  };
  const pieChartSeries = filteredSummaries.map(item => item.amount);

  return (
    <>
    {/* Header (Title, toggles etc) */}
    {/* Header (Title, toggles etc) */}
    <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Billing Dashboard</h1>
        <div className="flex gap-3">
          <ThemeControl />
          <button className="btn btn-primary hover:text-white btn-outline rounded-full">
            <BellAlertIcon className="h-6 w-6" />
          </button>
          <button className="btn btn-primary hover:text-white btn-outline rounded-full">
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <hr className="my-5 text-gray-200"></hr>

      {/* First row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-5">
        {/* Latest Billing History */}
        <div className="col-span-4 card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Latest Billing History</h2>
            <Link to="/tenant/billing">
              <button className="btn btn-primary text-white btn-md">
                <TableCellsIcon className="h-5 w-5" />
                View All
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>Date</th>
                  <th>Paid Date</th>
                  <th>Status</th>
                  <th>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.paidDate}</td>
                    <td>
                      <span className={`badge text-base-100 p-3 gap-1 ${item.status === 'Paid' ? 'badge-success' : 'badge-accent'}`}>
                      {item.status === 'Paid' ? <CheckIcon className="h-5 w-5" /> : <ClockIcon className="h-5 w-5" />}
                        {item.status }
                      </span>
                    </td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History Line Chart */}
        <div className="col-span-3 card p-5">
          <h2 className="text-xl font-bold mb-4">Payment History (Last 6 Months)</h2>
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mt-5">
        {/* Financial Summaries */}
        <div className="col-span-3 card p-5">
          <h2 className="text-xl font-bold mb-4">This Month In Stats</h2>
         

          <ReactApexChart options={pieChartOptions} series={pieChartSeries} type="pie" height={350} />
        </div>

        {/* Overdue Payments */}
        <div className="col-span-4 card p-5">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl font-bold mb-4">Overdue Payments</h2>
            <Link to="/tenant/billing">
                <button className="btn btn-primary text-white btn-md">
                  <TableCellsIcon className="h-5 w-5" />
                  View All
                </button>
              </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Penalty (Rs)</th>
                  <th>Overdue time</th>
                  <th>Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                {overduePayments.map(item => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>
                      <span className="badge badge-error p-3 text-base-100">{item.status}</span>
                    </td>
                    <td>{item.penalty}</td>
                    <td>{ item.time + " days " }</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default BillingDashboard
