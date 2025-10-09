// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const equipmentService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "is_active_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('equipment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching equipment:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "is_active_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('equipment_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  create: async (equipment) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: equipment.Name || equipment.name_c,
          name_c: equipment.name_c,
          description_c: equipment.description_c || "",
          type_c: equipment.type_c,
          purchase_date_c: equipment.purchase_date_c || null,
          price_c: equipment.price_c ? parseFloat(equipment.price_c) : null,
          is_active_c: equipment.is_active_c !== undefined ? equipment.is_active_c : true,
          Tags: equipment.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('equipment_c', params);
      
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
      console.error("Error creating equipment:", error?.response?.data?.message || error);
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
          description_c: data.description_c || "",
          type_c: data.type_c,
          purchase_date_c: data.purchase_date_c || null,
          price_c: data.price_c ? parseFloat(data.price_c) : null,
          is_active_c: data.is_active_c !== undefined ? data.is_active_c : true,
          Tags: data.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('equipment_c', params);
      
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
      console.error("Error updating equipment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('equipment_c', params);
      
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
      console.error("Error deleting equipment:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default equipmentService;