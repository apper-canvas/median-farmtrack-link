const cropYieldService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "yield_amount_c"}},
          {"field": {"Name": "yield_unit_c"}},
          {"field": {"Name": "harvest_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "harvest_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('crop_yield_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching crop yields:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "yield_amount_c"}},
          {"field": {"Name": "yield_unit_c"}},
          {"field": {"Name": "harvest_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('crop_yield_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching crop yield ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByCropName(cropName) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "yield_amount_c"}},
          {"field": {"Name": "yield_unit_c"}},
          {"field": {"Name": "harvest_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{"FieldName": "crop_name_c", "Operator": "EqualTo", "Values": [cropName]}],
        orderBy: [{"fieldName": "harvest_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('crop_yield_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching yields for crop ${cropName}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "yield_amount_c"}},
          {"field": {"Name": "yield_unit_c"}},
          {"field": {"Name": "harvest_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [
          {"FieldName": "harvest_date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "harvest_date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ],
        orderBy: [{"fieldName": "harvest_date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('crop_yield_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching yields by date range:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(yieldData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: yieldData.Name || `${yieldData.crop_name_c} - ${yieldData.harvest_date_c}`,
          crop_name_c: yieldData.crop_name_c,
          yield_amount_c: parseFloat(yieldData.yield_amount_c),
          yield_unit_c: yieldData.yield_unit_c,
          harvest_date_c: yieldData.harvest_date_c,
          notes_c: yieldData.notes_c || "",
          Tags: yieldData.Tags || ""
        }]
      };

      const response = await apperClient.createRecord('crop_yield_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} yield records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating crop yield:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || `${data.crop_name_c} - ${data.harvest_date_c}`,
          crop_name_c: data.crop_name_c,
          yield_amount_c: data.yield_amount_c ? parseFloat(data.yield_amount_c) : null,
          yield_unit_c: data.yield_unit_c,
          harvest_date_c: data.harvest_date_c,
          notes_c: data.notes_c || "",
          Tags: data.Tags || ""
        }]
      };

      const response = await apperClient.updateRecord('crop_yield_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} yield records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error(`Error updating crop yield ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('crop_yield_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} yield records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }
    } catch (error) {
      console.error(`Error deleting crop yield ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default cropYieldService;