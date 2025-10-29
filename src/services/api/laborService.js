// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const laborService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "task_c"}},
          {"field": {"Name": "employee_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "farm_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('labor_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching labors:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "task_c"}},
          {"field": {"Name": "employee_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "farm_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('labor_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching labor ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "task_c"}},
          {"field": {"Name": "employee_c"}},
          {"field": {"Name": "time_c"}},
          {"field": {"Name": "farm_c"}}
        ],
        where: [{"FieldName": "farm_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await apperClient.fetchRecords('labor_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching labors by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (labor) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: labor.Name,
          Tags: labor.Tags || "",
          task_c: labor.task_c,
          employee_c: labor.employee_c,
          time_c: parseFloat(labor.time_c),
          farm_c: parseInt(labor.farm_c)
        }]
      };
      
      const response = await apperClient.createRecord('labor_c', params);
      
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
      console.error("Error creating labor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name,
          Tags: data.Tags || "",
          task_c: data.task_c,
          employee_c: data.employee_c,
          time_c: parseFloat(data.time_c),
          farm_c: parseInt(data.farm_c)
        }]
      };
      
      const response = await apperClient.updateRecord('labor_c', params);
      
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
      console.error("Error updating labor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('labor_c', params);
      
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
      console.error("Error deleting labor:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default laborService;