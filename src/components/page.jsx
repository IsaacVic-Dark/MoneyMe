import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calculator, TrendingUp, Wallet, CreditCard, PiggyBank, ShoppingCart } from 'lucide-react';

// Import calculations from separate file
import {
  calculateDifference,
  calculateCategoryTotal,
  calculatePlanTotal,
  calculateRemainingAmount,
  formatCurrency
} from '../utils/calculations';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

const MoneyManagement = () => {
  // Initial data state
  const [income, setIncome] = useState({ plan: 25000, actual: 0 });
  
  const [essentialExpenses, setEssentialExpenses] = useState([
    { id: 'rent', name: 'Rent', plan: 7500, actual: 0 },
    { id: 'water', name: 'Water', plan: 200, actual: 0 },
    { id: 'electricity', name: 'Electricity', plan: 500, actual: 0 },
    { id: 'phone', name: 'Cell Phone Bill', plan: 600, actual: 0 },
    { id: 'groceries', name: 'Groceries', plan: 1200, actual: 0 },
    { id: 'internet', name: 'Internet', plan: 1600, actual: 0 },
    { id: 'gym', name: 'Gym Membership', plan: 1500, actual: 0 },
    { id: 'transport', name: 'Transport', plan: 4800, actual: 0 },
    { id: 'shopping', name: 'Shopping', plan: 3000, actual: 0 },
  ]);

  const [nonEssentialExpenses, setNonEssentialExpenses] = useState([
    { id: 'dining', name: 'Dining Out', plan: 2400, actual: 0 },
    { id: 'personalcare', name: 'Personal Care', plan: 500, actual: 0 },
    { id: 'clothes', name: 'Clothes', plan: 200, actual: 0 },
  ]);

  const [savingsInvestments, setSavingsInvestments] = useState([
    { id: 'emergency', name: 'Emergency Fund', plan: 0, actual: 0 },
    { id: 'sinking', name: 'Sinking Fund', plan: 0, actual: 0 },
    { id: 'investment', name: 'Investment Fund', plan: 0, actual: 0 },
  ]);

  const [debt, setDebt] = useState([
    { id: 'creditcard', name: 'Credit Card', plan: 0, actual: 0 },
    { id: 'loans', name: 'Loans', plan: 0, actual: 0 },
  ]);

  // Temporary input states for debouncing
  const [tempInputs, setTempInputs] = useState({});
  
  // Debounced values
  const debouncedInputs = useDebounce(tempInputs, 500); // 500ms delay

  // Effect to apply debounced changes
  useEffect(() => {
    Object.entries(debouncedInputs).forEach(([key, value]) => {
      const [category, id, field] = key.split('-');
      const numValue = parseFloat(value) || 0;
      
      if (category === 'income') {
        setIncome(prev => ({ ...prev, [field]: numValue }));
      } else if (category === 'essential') {
        setEssentialExpenses(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: numValue } : item
        ));
      } else if (category === 'nonessential') {
        setNonEssentialExpenses(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: numValue } : item
        ));
      } else if (category === 'savings') {
        setSavingsInvestments(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: numValue } : item
        ));
      } else if (category === 'debt') {
        setDebt(prev => prev.map(item => 
          item.id === id ? { ...item, [field]: numValue } : item
        ));
      }
    });
  }, [debouncedInputs]);

  // Calculate totals using imported functions
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
    { name: 'Income', value: income.actual || 0, color: COLORS[0] },
    { name: 'Essential Expenses', value: essentialTotal, color: COLORS[1] },
    { name: 'Non-Essential Expenses', value: nonEssentialTotal, color: COLORS[2] },
    { name: 'Savings & Investments', value: savingsTotal, color: COLORS[3] },
    { name: 'Debt/Loans', value: debtTotal, color: COLORS[4] },
  ].filter(item => item.value > 0);

  const barData = [
    { category: 'Income', planned: income.plan, actual: income.actual || 0 },
    { category: 'Essential', planned: calculatePlanTotal(essentialExpenses), actual: essentialTotal },
    { category: 'Non-Essential', planned: calculatePlanTotal(nonEssentialExpenses), actual: nonEssentialTotal },
    { category: 'Savings', planned: calculatePlanTotal(savingsInvestments), actual: savingsTotal },
    { category: 'Debt', planned: calculatePlanTotal(debt), actual: debtTotal },
  ];

  // Debounced update functions
  const updateIncomeDebounced = (field, value) => {
    const key = `income--${field}`;
    setTempInputs(prev => ({ ...prev, [key]: value }));
  };

  const updateCategoryDebounced = (categoryType, id, field, value) => {
    const key = `${categoryType}-${id}-${field}`;
    setTempInputs(prev => ({ ...prev, [key]: value }));
  };

  // Get current display value (temp input or actual value)
  const getDisplayValue = (categoryType, id, field, currentValue) => {
    const key = categoryType === 'income' 
      ? `income--${field}` 
      : `${categoryType}-${id}-${field}`;
    return tempInputs.hasOwnProperty(key) ? tempInputs[key] : currentValue;
  };

  // Table component
  const CategoryTable = ({ title, categories, setCategories, icon: Icon, bgColor, textColor, categoryType }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-6 h-6 ${textColor}`} />
        <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b-2 ${textColor.replace('text-', 'border-')}`}>
              <th className="text-left py-3 px-2 font-semibold">Category</th>
              <th className="text-center py-3 px-2 font-semibold">Plan (KES)</th>
              <th className="text-center py-3 px-2 font-semibold">Actual (KES)</th>
              <th className="text-center py-3 px-2 font-semibold">Difference</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const difference = calculateDifference(category.actual, category.plan);
              return (
                <tr key={category.id} className="border-b border-gray-200 hover:bg-white/50">
                  <td className="py-3 px-2 font-medium">{category.name}</td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={getDisplayValue(categoryType, category.id, 'plan', category.plan)}
                      onChange={(e) => updateCategoryDebounced(categoryType, category.id, 'plan', e.target.value)}
                      className="w-full text-center border rounded px-2 py-1 bg-white/80"
                      min="0"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      value={getDisplayValue(categoryType, category.id, 'actual', category.actual)}
                      onChange={(e) => updateCategoryDebounced(categoryType, category.id, 'actual', e.target.value)}
                      className="w-full text-center border rounded px-2 py-1 bg-white/80"
                      min="0"
                    />
                  </td>
                  <td className={`py-3 px-2 text-center font-semibold ${
                    difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {formatCurrency(Math.abs(difference))}
                    {difference > 0 && ' over'}
                    {difference < 0 && ' under'}
                  </td>
                </tr>
              );
            })}
            <tr className={`font-bold text-lg border-t-2 ${textColor.replace('text-', 'border-')}`}>
              <td className="py-3 px-2">TOTAL</td>
              <td className="py-3 px-2 text-center">{formatCurrency(calculatePlanTotal(categories))}</td>
              <td className="py-3 px-2 text-center">{formatCurrency(calculateCategoryTotal(categories))}</td>
              <td className={`py-3 px-2 text-center ${
                calculateCategoryTotal(categories) - calculatePlanTotal(categories) > 0 
                  ? 'text-red-600' 
                  : calculateCategoryTotal(categories) - calculatePlanTotal(categories) < 0 
                    ? 'text-green-600' 
                    : 'text-gray-600'
              }`}>
                {formatCurrency(Math.abs(calculateCategoryTotal(categories) - calculatePlanTotal(categories)))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Money Management Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track your finances and achieve your financial goals</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-semibold">Income</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(income.actual)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-400 to-red-600 p-4 rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-5 h-5" />
              <h4 className="font-semibold">Essential</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(essentialTotal)}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <h4 className="font-semibold">Non-Essential</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(nonEssentialTotal)}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-5 h-5" />
              <h4 className="font-semibold">Savings</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(savingsTotal)}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-4 rounded-xl text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5" />
              <h4 className="font-semibold">Debt</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(debtTotal)}</p>
          </div>
          <div className={`bg-gradient-to-br p-4 rounded-xl text-white shadow-lg ${
            leftAmount >= 0 
              ? 'from-emerald-400 to-emerald-600' 
              : 'from-red-500 to-red-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <h4 className="font-semibold">Remaining</h4>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(leftAmount)}</p>
          </div>
        </div>

        {/* Income Section */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-700" />
            <h3 className="text-xl font-bold text-green-700">Income</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Planned (KES)</label>
              <input
                type="number"
                value={getDisplayValue('income', null, 'plan', income.plan)}
                onChange={(e) => updateIncomeDebounced('plan', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white/80"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Actual (KES)</label>
              <input
                type="number"
                value={getDisplayValue('income', null, 'actual', income.actual)}
                onChange={(e) => updateIncomeDebounced('actual', e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white/80"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Difference</label>
              <div className={`w-full border rounded px-3 py-2 bg-white/60 text-center font-semibold ${
                calculateDifference(income.actual, income.plan) > 0 ? 'text-green-600' : 
                calculateDifference(income.actual, income.plan) < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {formatCurrency(Math.abs(calculateDifference(income.actual, income.plan)))}
                {calculateDifference(income.actual, income.plan) > 0 && ' over'}
                {calculateDifference(income.actual, income.plan) < 0 && ' under'}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tables */}
        <div className="space-y-6 mb-8">
          <CategoryTable
            title="Essential Expenses"
            categories={essentialExpenses}
            setCategories={setEssentialExpenses}
            icon={ShoppingCart}
            bgColor="bg-gradient-to-br from-red-100 to-red-200"
            textColor="text-red-700"
            categoryType="essential"
          />
          
          <CategoryTable
            title="Non-Essential Expenses"
            categories={nonEssentialExpenses}
            setCategories={setNonEssentialExpenses}
            icon={Wallet}
            bgColor="bg-gradient-to-br from-orange-100 to-orange-200"
            textColor="text-orange-700"
            categoryType="nonessential"
          />
          
          <CategoryTable
            title="Savings & Investments"
            categories={savingsInvestments}
            setCategories={setSavingsInvestments}
            icon={PiggyBank}
            bgColor="bg-gradient-to-br from-purple-100 to-purple-200"
            textColor="text-purple-700"
            categoryType="savings"
          />
          
          <CategoryTable
            title="Debt/Loans"
            categories={debt}
            setCategories={setDebt}
            icon={CreditCard}
            bgColor="bg-gradient-to-br from-pink-100 to-pink-200"
            textColor="text-pink-700"
            categoryType="debt"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Planned vs Actual</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyManagement;