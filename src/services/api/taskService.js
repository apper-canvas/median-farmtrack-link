import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

// Predefined task templates for common farm activities
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
    await delay();
    return [...tasks];
  },

  getById: async (id) => {
    await delay();
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  getByFarmId: async (farmId) => {
    await delay();
    return tasks.filter(t => t.farmId === parseInt(farmId)).map(t => ({ ...t }));
  },

  create: async (task) => {
    await delay();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      ...task,
      createdAt: Date.now(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, data) => {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...data };
      return { ...tasks[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks.splice(index, 1);
      return true;
    }
    return false;
  },

  // Template management methods
  getTemplates: async () => {
    await delay();
    return [...taskTemplates];
  },

  getTemplatesByCategory: async (category) => {
    await delay();
    return taskTemplates.filter(t => t.category === category);
  },

  createFromTemplate: async (templateId, customData, farmId) => {
    await delay();
    const template = taskTemplates.find(t => t.Id === parseInt(templateId));
    if (!template) return null;

    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const taskFromTemplate = {
      Id: maxId + 1,
      title: template.title,
      description: template.description,
      priority: template.priority,
      status: "Pending",
      farmId: parseInt(farmId),
      dueDate: "",
      cropId: "",
      ...customData,
      createdAt: Date.now(),
      completedAt: null,
      isFromTemplate: true,
      templateId: template.Id
    };

    tasks.push(taskFromTemplate);
    return { ...taskFromTemplate };
  }
};

export default taskService;