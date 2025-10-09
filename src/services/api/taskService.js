// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Predefined task templates for common farm activities - kept in memory
const taskTemplates = [
  // Crop Management
  {
    Id: 1,
    category: "Crop Management",
    title: "Daily Watering",
    description: "Water crops thoroughly, checking soil moisture levels and adjusting irrigation as needed.",
    priority: "High",
    estimatedDuration: "1-2 hours",
    frequency: "Daily",
    season: "All seasons",
    icon: "Droplets"
  },
  {
    Id: 2,
    category: "Crop Management", 
    title: "Fertilizer Application",
    description: "Apply balanced fertilizer according to crop requirements and growth stage.",
    priority: "Medium",
    estimatedDuration: "2-3 hours",
    frequency: "Monthly",
    season: "Growing season",
    icon: "Sprout"
  },
  {
    Id: 3,
    category: "Crop Management",
    title: "Pruning and Trimming",
    description: "Remove dead branches, suckers, and excess growth to promote healthy plant development.",
    priority: "Medium",
    estimatedDuration: "3-4 hours",
    frequency: "Bi-weekly",
    season: "Growing season",
    icon: "Scissors"
  },
  
  // Pest Control
  {
    Id: 4,
    category: "Pest Control",
    title: "Pest Inspection",
    description: "Inspect crops for signs of pests, diseases, and nutrient deficiencies. Document findings.",
    priority: "High",
    estimatedDuration: "1-2 hours",
    frequency: "Weekly",
    season: "All seasons",
    icon: "Search"
  },
  {
    Id: 5,
    category: "Pest Control",
    title: "Organic Pest Treatment",
    description: "Apply organic pest control measures including neem oil, companion planting, or beneficial insects.",
    priority: "Medium",
    estimatedDuration: "2-3 hours",
    frequency: "As needed",
    season: "Growing season",
    icon: "Bug"
  },
  
  // Harvesting
  {
    Id: 6,
    category: "Harvesting",
    title: "Harvest Preparation",
    description: "Prepare harvesting equipment, containers, and storage areas. Check crop maturity indicators.",
    priority: "High",
    estimatedDuration: "1-2 hours",
    frequency: "Pre-harvest",
    season: "Harvest season",
    icon: "Package"
  },
  {
    Id: 7,
    category: "Harvesting",
    title: "Crop Collection",
    description: "Harvest mature crops using proper techniques to maintain quality. Sort and grade produce.",
    priority: "High",
    estimatedDuration: "4-6 hours",
    frequency: "Harvest period",
    season: "Harvest season", 
    icon: "ShoppingBasket"
  },
  {
    Id: 8,
    category: "Harvesting",
    title: "Post-Harvest Processing",
    description: "Clean, sort, package, and store harvested crops. Update inventory and prepare for distribution.",
    priority: "Medium",
    estimatedDuration: "2-4 hours",
    frequency: "Post-harvest",
    season: "Harvest season",
    icon: "Archive"
  },
  
  // Equipment & Maintenance
  {
    Id: 9,
    category: "Maintenance",
    title: "Equipment Maintenance",
    description: "Inspect, clean, and maintain farm equipment. Check oil levels, belts, and moving parts.",
    priority: "Medium",
    estimatedDuration: "2-3 hours",
    frequency: "Monthly",
    season: "All seasons",
    icon: "Wrench"
  },
  {
    Id: 10,
    category: "Maintenance",
    title: "Greenhouse Cleaning",
    description: "Clean greenhouse surfaces, check ventilation systems, and sanitize growing areas.",
    priority: "Low",
    estimatedDuration: "3-4 hours",
    frequency: "Monthly",
    season: "All seasons",
    icon: "Home"
  },
  {
    Id: 11,
    category: "Maintenance",
    title: "Irrigation System Check",
    description: "Inspect irrigation lines, emitters, and timers. Test water pressure and repair any leaks.",
    priority: "High",
    estimatedDuration: "2-3 hours",
    frequency: "Weekly",
    season: "All seasons",
    icon: "Settings"
  },
  
  // Soil Management
  {
    Id: 12,
    category: "Soil Management", 
    title: "Soil Testing",
    description: "Collect soil samples and test pH, nutrients, and organic matter content. Plan amendments based on results.",
    priority: "Medium",
    estimatedDuration: "1-2 hours",
    frequency: "Seasonally",
    season: "All seasons",
    icon: "TestTube"
  }
];

const taskService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      return response?.data || null;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByFarmId: async (farmId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "Tags"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  create: async (task) => {
    try {
      // Only include Updateable fields for create operation
      const params = {
        records: [{
          Name: task.Name || task.title_c,
          title_c: task.title_c,
          description_c: task.description_c,
          due_date_c: task.due_date_c,
          priority_c: task.priority_c,
          status_c: task.status_c,
          farm_id_c: parseInt(task.farm_id_c),
          crop_id_c: task.crop_id_c ? parseInt(task.crop_id_c) : null,
          Tags: task.Tags || ""
        }]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
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
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      // Only include Updateable fields for update operation
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.Name || data.title_c,
          title_c: data.title_c,
          description_c: data.description_c,
          due_date_c: data.due_date_c,
          priority_c: data.priority_c,
          status_c: data.status_c,
          farm_id_c: data.farm_id_c ? parseInt(data.farm_id_c) : null,
          crop_id_c: data.crop_id_c ? parseInt(data.crop_id_c) : null,
          Tags: data.Tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
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
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
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
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

  // Template management methods - using in-memory templates
  getTemplates: async () => {
    return [...taskTemplates];
  },

  getTemplatesByCategory: async (category) => {
    return taskTemplates.filter(t => t.category === category);
  },

  createFromTemplate: async (templateId, customData, farmId) => {
    const template = taskTemplates.find(t => t.Id === parseInt(templateId));
    if (!template) return null;

    const taskFromTemplate = {
      title_c: template.title,
      description_c: template.description,
      priority_c: template.priority,
      status_c: "Pending",
      farm_id_c: parseInt(farmId),
      due_date_c: "",
      crop_id_c: null,
      ...customData
    };

    return await taskService.create(taskFromTemplate);
  }
};

export default taskService;