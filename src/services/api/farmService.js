// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const farmService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('farm_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('farm_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (farm) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: farm.Name || farm.name_c,
          name_c: farm.name_c,
          size_c: farm.size_c ? parseFloat(farm.size_c) : null,
          unit_c: farm.unit_c,
location_c: farm.location_c,
          soil_type_c: farm.soil_type_c || "",
          Tags: farm.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('farm_c', params);
      
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
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || data.name_c,
          name_c: data.name_c,
          size_c: data.size_c ? parseFloat(data.size_c) : null,
          unit_c: data.unit_c,
location_c: data.location_c,
          soil_type_c: data.soil_type_c || "",
          Tags: data.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('farm_c', params);
      
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
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('farm_c', params);
      
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
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default farmService;