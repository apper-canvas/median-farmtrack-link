// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Mock budget data for budget management (not in database yet)
let budgets = [];

const expenseService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('expense_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('expense_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await apperClient.fetchRecords('expense_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (expense) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: expense.Name || expense.description_c?.substring(0, 50),
          category_c: expense.category_c,
          amount_c: parseFloat(expense.amount_c),
          date_c: expense.date_c,
          description_c: expense.description_c,
          farm_id_c: parseInt(expense.farm_id_c),
          Tags: expense.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('expense_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error creating expense:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || data.description_c?.substring(0, 50),
          category_c: data.category_c,
          amount_c: parseFloat(data.amount_c),
          date_c: data.date_c,
          description_c: data.description_c,
          farm_id_c: data.farm_id_c ? parseInt(data.farm_id_c) : null,
          Tags: data.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('expense_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      return null;
    } catch (error) {
      console.error("Error updating expense:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('expense_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
        }
        return successful.length > 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      return false;
    }
  },

  // Budget management functions - using mock data as budgets not in database
  getBudgetsByFarm: async (farmId) => {
    return budgets.filter(b => b.farmId === parseInt(farmId)).map(b => ({ ...b }));
  },

  setBudget: async (farmId, category, budgetAmount) => {
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
    const farmBudgets = budgets.filter(b => b.farmId === parseInt(farmId));
    
    // Get expenses from database for alert calculation
    const farmExpenses = await expenseService.getByFarmId(farmId);
    const alerts = [];

    for (const budget of farmBudgets) {
      const categoryExpenses = farmExpenses.filter(e => e.category_c === budget.category);
      const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount_c, 0);
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

export default expenseService;