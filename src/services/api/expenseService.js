import expensesData from "@/services/mockData/expenses.json";

let expenses = [...expensesData];

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
  }
};

export default expenseService;