import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Calculation utilities
const calculateDifference = (actual, plan) => actual - plan;
const calculateCategoryTotal = (categories) => categories.reduce((sum, item) => sum + item.actual, 0);
const calculatePlanTotal = (categories) => categories.reduce((sum, item) => sum + item.plan, 0);
const calculateRemainingAmount = (income, essential, nonEssential, savings, debt) => 
  income - essential - nonEssential - savings - debt;
const formatCurrency = (value) => 
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(value);

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'];

const MoneyManagement = () => {
  // Initial data state
  const [income, setIncome] = useState({ plan: 25000, actual: 22000 });
  
  const [essentialExpenses, setEssentialExpenses] = useState([
    { id: 'rent', name: 'Rent', plan: 7500, actual: 7500, status: 'Paid' },
    { id: 'water', name: 'Water', plan: 200, actual: 180, status: 'Paid' },
    { id: 'electricity', name: 'Electricity', plan: 500, actual: 520, status: 'Paid' },
    { id: 'phone', name: 'Cell Phone Bill', plan: 600, actual: 600, status: 'Paid' },
    { id: 'groceries', name: 'Groceries', plan: 1200, actual: 950, status: 'In Progress' },
    { id: 'internet', name: 'Internet', plan: 1600, actual: 1600, status: 'Paid' },
    { id: 'gym', name: 'Gym Membership', plan: 1500, actual: 0, status: 'Pending' },
    { id: 'transport', name: 'Transport', plan: 4800, actual: 3200, status: 'In Progress' },
  ]);

  const [nonEssentialExpenses, setNonEssentialExpenses] = useState([
    { id: 'dining', name: 'Dining Out', plan: 2400, actual: 1800, status: 'In Progress' },
    { id: 'personalcare', name: 'Personal Care', plan: 500, actual: 450, status: 'Paid' },
    { id: 'clothes', name: 'Clothes', plan: 200, actual: 0, status: 'Pending' },
  ]);

  const [savingsInvestments, setSavingsInvestments] = useState([
    { id: 'emergency', name: 'Emergency Fund', plan: 2000, actual: 2000, status: 'Paid' },
    { id: 'sinking', name: 'Sinking Fund', plan: 1000, actual: 500, status: 'In Progress' },
    { id: 'investment', name: 'Investment Fund', plan: 1500, actual: 0, status: 'Pending' },
  ]);

  const [debt, setDebt] = useState([
    { id: 'creditcard', name: 'Credit Card', plan: 500, actual: 500, status: 'Paid' },
    { id: 'loans', name: 'Loans', plan: 1000, actual: 1000, status: 'Paid' },
  ]);

  // Calculate totals
  const essentialTotal = calculateCategoryTotal(essentialExpenses);
  const nonEssentialTotal = calculateCategoryTotal(nonEssentialExpenses);
  const savingsTotal = calculateCategoryTotal(savingsInvestments);
  const debtTotal = calculateCategoryTotal(debt);
  const leftAmount = calculateRemainingAmount(
    income.actual, 
    essentialTotal, 
    nonEssentialTotal, 
    savingsTotal, 
    debtTotal
  );

  // Data for charts
  const pieData = [
    { name: 'Essential', value: essentialTotal, color: COLORS[1] },
    { name: 'Non-Essential', value: nonEssentialTotal, color: COLORS[2] },
    { name: 'Savings', value: savingsTotal, color: COLORS[3] },
    { name: 'Debt', value: debtTotal, color: COLORS[4] },
  ].filter(item => item.value > 0);

  const barData = [
    { category: 'Income', planned: income.plan, actual: income.actual || 0 },
    { category: 'Essential', planned: calculatePlanTotal(essentialExpenses), actual: essentialTotal },
    { category: 'Non-Essential', planned: calculatePlanTotal(nonEssentialExpenses), actual: nonEssentialTotal },
    { category: 'Savings', planned: calculatePlanTotal(savingsInvestments), actual: savingsTotal },
    { category: 'Debt', planned: calculatePlanTotal(debt), actual: debtTotal },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">MoneyMe</h1>
            <p className="text-gray-500 text-sm md:text-base">Easily track your income and expenses, set budgets, and stay in control of your finances.</p>
          </div>
          {/* <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
              S
            </div>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Income Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 md:p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Income</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                KES {(income.actual / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Jan 01 - Jan 30</p>
            </div>
            <div className="absolute right-2 top-2 md:right-4 md:top-4">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-yellow-300 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 md:p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Expenses</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                KES {((essentialTotal + nonEssentialTotal) / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Jan 01 - Jan 30</p>
            </div>
            <div className="absolute right-2 top-2 md:right-4 md:top-4">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-purple-300 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Savings Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 md:p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Savings</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                KES {(savingsTotal / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Monthly</p>
            </div>
            <div className="absolute right-2 top-2 md:right-4 md:top-4">
              <svg className="w-10 h-10 md:w-14 md:h-14 text-orange-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
            </div>
          </div>

          {/* Remaining Balance Card */}
          <div className={`rounded-2xl p-4 md:p-6 relative overflow-hidden ${
            leftAmount >= 0 
              ? 'bg-gradient-to-br from-green-50 to-green-100' 
              : 'bg-gradient-to-br from-red-50 to-red-100'
          }`}>
            <div className="relative z-10">
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Remaining</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                KES {(Math.abs(leftAmount) / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">Jan 01 - Jan 30</p>
            </div>
            <div className="absolute right-2 top-2 md:right-4 md:top-4">
              <svg className={`w-10 h-10 md:w-14 md:h-14 opacity-40 ${leftAmount >= 0 ? 'text-green-300' : 'text-red-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Planned vs Actual Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
                <h3 className="text-lg font-bold text-gray-800">Planned vs Actual</h3>
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Planned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className="text-gray-600">Actual</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="planned" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="actual" fill="#4ade80" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Essential Expenses Table */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Essential Expenses</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-gray-600">Category</th>
                      <th className="text-center py-3 px-2 text-xs md:text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                      <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {essentialExpenses.slice(0, 5).map((item) => {
                      const progress = (item.actual / item.plan) * 100;
                      return (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-blue-600">{item.name.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium text-gray-800 text-xs md:text-sm block truncate">{item.name}</span>
                                <span className="text-xs text-gray-500 md:hidden">{item.status}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center hidden md:table-cell">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Paid' ? 'bg-green-100 text-green-700' :
                              item.status === 'In Progress' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2 w-full max-w-[120px]">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      progress >= 100 ? 'bg-green-500' : 
                                      progress >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                                  {progress.toFixed(0)}%
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatCurrency(item.actual)}/{formatCurrency(item.plan)}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View All Essential Expenses →
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Expense Breakdown Pie Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Breakdown</h3>
                <select className="text-xs md:text-sm border border-gray-200 rounded-lg px-2 md:px-3 py-1 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-gray-600 truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800 ml-2">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Essential Expenses List */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">To Do List</h3>
                <button className="px-3 md:px-4 py-1.5 bg-green-500 text-white text-xs md:text-sm rounded-lg hover:bg-green-600 font-medium transition-colors">
                  Card View
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {nonEssentialExpenses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={item.status === 'Paid'}
                        className="w-4 h-4 rounded border-gray-300 flex-shrink-0"
                        readOnly
                      />
                      <span className={`text-sm ${item.status === 'Paid' ? 'line-through text-gray-400' : 'text-gray-700'} truncate`}>
                        {item.name}
                      </span>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {savingsInvestments.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={item.status === 'Paid'}
                        className="w-4 h-4 rounded border-gray-300 flex-shrink-0"
                        readOnly
                      />
                      <span className={`text-sm ${item.status === 'Paid' ? 'line-through text-gray-400' : 'text-gray-700'} truncate`}>
                        {item.name}
                      </span>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {debt.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={item.status === 'Paid'}
                        className="w-4 h-4 rounded border-gray-300 flex-shrink-0"
                        readOnly
                      />
                      <span className={`text-sm ${item.status === 'Paid' ? 'line-through text-gray-400' : 'text-gray-700'} truncate`}>
                        {item.name}
                      </span>
                    </div>
                    <button className="text-red-400 hover:text-red-600 transition-colors ml-2 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyManagement;