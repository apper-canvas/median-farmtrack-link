import expensesData from "@/services/mockData/expenses.json";

let expenses = [...expensesData];
let budgets = [];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const expenseService = {
  getAll: async () => {
    await delay();
    return [...expenses];
  },

  getById: async (id) => {
    await delay();
    const expense = expenses.find(e => e.Id === parseInt(id));
    return expense ? { ...expense } : null;
  },

  getByFarmId: async (farmId) => {
    await delay();
    return expenses.filter(e => e.farmId === parseInt(farmId)).map(e => ({ ...e }));
  },

  create: async (expense) => {
    await delay();
    const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) : 0;
    const newExpense = {
      Id: maxId + 1,
      ...expense,
      createdAt: Date.now()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  update: async (id, data) => {
    await delay();
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...data };
      return { ...expenses[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses.splice(index, 1);
      return true;
    }
    return false;
  },

  // Budget management functions
  getBudgetsByFarm: async (farmId) => {
    await delay();
    return budgets.filter(b => b.farmId === parseInt(farmId)).map(b => ({ ...b }));
  },

  setBudget: async (farmId, category, budgetAmount) => {
    await delay();
    const existingIndex = budgets.findIndex(b => 
      b.farmId === parseInt(farmId) && b.category === category
    );
    
    const budgetData = {
      Id: existingIndex !== -1 ? budgets[existingIndex].Id : 
          budgets.length > 0 ? Math.max(...budgets.map(b => b.Id)) + 1 : 1,
      farmId: parseInt(farmId),
      category,
      budgetAmount: parseFloat(budgetAmount),
      alertThreshold: 80, // Alert at 80% of budget
      createdAt: existingIndex !== -1 ? budgets[existingIndex].createdAt : Date.now(),
      updatedAt: Date.now()
    };

    if (existingIndex !== -1) {
      budgets[existingIndex] = budgetData;
    } else {
      budgets.push(budgetData);
    }
    
    return { ...budgetData };
  },

  checkBudgetAlerts: async (farmId) => {
    await delay();
    const farmBudgets = budgets.filter(b => b.farmId === parseInt(farmId));
    const farmExpenses = expenses.filter(e => e.farmId === parseInt(farmId));
    const alerts = [];

    for (const budget of farmBudgets) {
      const categoryExpenses = farmExpenses.filter(e => e.category === budget.category);
      const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const percentage = (totalSpent / budget.budgetAmount) * 100;

      if (percentage >= 100) {
        alerts.push({
          category: budget.category,
          type: 'exceeded',
          message: `Budget exceeded for ${budget.category}: $${totalSpent.toFixed(2)} / $${budget.budgetAmount.toFixed(2)}`,
          percentage: Math.round(percentage)
        });
      } else if (percentage >= budget.alertThreshold) {
        alerts.push({
          category: budget.category,
          type: 'warning',
          message: `Approaching budget limit for ${budget.category}: $${totalSpent.toFixed(2)} / $${budget.budgetAmount.toFixed(2)} (${Math.round(percentage)}%)`,
          percentage: Math.round(percentage)
        });
      }
    }

    return alerts;
  }
};

export default expenseService;