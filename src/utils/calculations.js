// calculations.js - Money Management Logic

/**
 * Calculate the difference between actual and planned amounts
 * @param {number} actual - The actual amount spent/earned
 * @param {number} plan - The planned amount
 * @returns {number} The difference (positive means over budget, negative means under budget)
 */
export const calculateDifference = (actual, plan) => {
  return (actual || 0) - (plan || 0);
};

/**
 * Calculate the total actual amount for a category
 * @param {Array} categories - Array of category objects with actual amounts
 * @returns {number} The sum of all actual amounts
 */
export const calculateCategoryTotal = (categories) => {
  return categories.reduce((sum, category) => sum + (category.actual || 0), 0);
};

/**
 * Calculate the total planned amount for a category
 * @param {Array} categories - Array of category objects with planned amounts
 * @returns {number} The sum of all planned amounts
 */
export const calculatePlanTotal = (categories) => {
  return categories.reduce((sum, category) => sum + (category.plan || 0), 0);
};

/**
 * Calculate the remaining amount after all expenses
 * @param {number} income - Total income
 * @param {number} essentialExpenses - Total essential expenses
 * @param {number} nonEssentialExpenses - Total non-essential expenses
 * @param {number} savings - Total savings and investments
 * @param {number} debt - Total debt payments
 * @returns {number} The remaining amount
 */
export const calculateRemainingAmount = (income, essentialExpenses, nonEssentialExpenses, savings, debt) => {
  return (income || 0) - (essentialExpenses || 0) - (nonEssentialExpenses || 0) - (savings || 0) - (debt || 0);
};

/**
 * Calculate percentage breakdown for pie chart
 * @param {number} totalIncome - Total income amount
 * @param {number} essentialExpenses - Essential expenses total
 * @param {number} nonEssentialExpenses - Non-essential expenses total
 * @param {number} savings - Savings and investments total
 * @param {number} debt - Debt payments total
 * @returns {Array} Array of objects with category name and percentage
 */
export const calculatePercentageBreakdown = (totalIncome, essentialExpenses, nonEssentialExpenses, savings, debt) => {
  if (totalIncome === 0) return [];
  
  return [
    {
      name: 'Essential Expenses',
      value: essentialExpenses,
      percentage: ((essentialExpenses / totalIncome) * 100).toFixed(1)
    },
    {
      name: 'Non-Essential Expenses',
      value: nonEssentialExpenses,
      percentage: ((nonEssentialExpenses / totalIncome) * 100).toFixed(1)
    },
    {
      name: 'Savings & Investments',
      value: savings,
      percentage: ((savings / totalIncome) * 100).toFixed(1)
    },
    {
      name: 'Debt/Loans',
      value: debt,
      percentage: ((debt / totalIncome) * 100).toFixed(1)
    }
  ].filter(item => item.value > 0);
};

/**
 * Format amount as Kenyan Shilling currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Validate if a value is a positive number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid positive number
 */
export const isValidPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Calculate budget health score (0-100)
 * @param {number} income - Total income
 * @param {number} totalExpenses - Total expenses
 * @returns {number} Health score between 0-100
 */
export const calculateBudgetHealthScore = (income, totalExpenses) => {
  if (income === 0) return 0;
  
  const savingsRate = ((income - totalExpenses) / income) * 100;
  
  if (savingsRate >= 20) return 100; // Excellent
  if (savingsRate >= 10) return 80;  // Good
  if (savingsRate >= 5) return 60;   // Fair
  if (savingsRate >= 0) return 40;   // Poor
  return 20; // Critical
};

/**
 * Get budget status message based on remaining amount
 * @param {number} remainingAmount - The remaining amount after all expenses
 * @returns {object} Object with status and message
 */
export const getBudgetStatus = (remainingAmount) => {
  if (remainingAmount > 0) {
    return {
      status: 'positive',
      message: `You have ${formatCurrency(remainingAmount)} left in your budget`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    };
  } else if (remainingAmount < 0) {
    return {
      status: 'negative',
      message: `You are over budget by ${formatCurrency(Math.abs(remainingAmount))}`,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    };
  } else {
    return {
      status: 'balanced',
      message: 'Your budget is perfectly balanced',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    };
  }
};

/**
 * Calculate recommended budget allocation (50/30/20 rule)
 * @param {number} income - Total income
 * @returns {object} Recommended allocation amounts
 */
export const calculateRecommendedAllocation = (income) => {
  return {
    needs: income * 0.5,      // 50% for needs (essential expenses)
    wants: income * 0.3,      // 30% for wants (non-essential expenses)
    savings: income * 0.2     // 20% for savings and debt repayment
  };
};

/**
 * Compare actual spending with recommended allocation
 * @param {number} income - Total income
 * @param {number} essentialExpenses - Essential expenses
 * @param {number} nonEssentialExpenses - Non-essential expenses
 * @param {number} savings - Savings amount
 * @returns {object} Comparison with recommendations
 */
export const compareWithRecommended = (income, essentialExpenses, nonEssentialExpenses, savings) => {
  const recommended = calculateRecommendedAllocation(income);
  
  return {
    needs: {
      actual: essentialExpenses,
      recommended: recommended.needs,
      difference: essentialExpenses - recommended.needs,
      percentage: income > 0 ? ((essentialExpenses / income) * 100).toFixed(1) : 0
    },
    wants: {
      actual: nonEssentialExpenses,
      recommended: recommended.wants,
      difference: nonEssentialExpenses - recommended.wants,
      percentage: income > 0 ? ((nonEssentialExpenses / income) * 100).toFixed(1) : 0
    },
    savings: {
      actual: savings,
      recommended: recommended.savings,
      difference: savings - recommended.savings,
      percentage: income > 0 ? ((savings / income) * 100).toFixed(1) : 0
    }
  };
};