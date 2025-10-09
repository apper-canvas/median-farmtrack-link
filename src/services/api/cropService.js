// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const cropService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('crop_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('crop_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await apperClient.fetchRecords('crop_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (crop) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: crop.Name || crop.crop_name_c,
          crop_name_c: crop.crop_name_c,
          variety_c: crop.variety_c,
          planting_date_c: crop.planting_date_c,
          expected_harvest_date_c: crop.expected_harvest_date_c,
          growth_stage_c: crop.growth_stage_c,
          status_c: crop.status_c,
          notes_c: crop.notes_c,
          farm_id_c: parseInt(crop.farm_id_c),
          Tags: crop.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('crop_c', params);
      
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
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || data.crop_name_c,
          crop_name_c: data.crop_name_c,
          variety_c: data.variety_c,
          planting_date_c: data.planting_date_c,
          expected_harvest_date_c: data.expected_harvest_date_c,
          growth_stage_c: data.growth_stage_c,
          status_c: data.status_c,
          notes_c: data.notes_c,
          farm_id_c: data.farm_id_c ? parseInt(data.farm_id_c) : null,
          Tags: data.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('crop_c', params);
      
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
      console.error("Error updating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('crop_c', params);
      
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
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default cropService;