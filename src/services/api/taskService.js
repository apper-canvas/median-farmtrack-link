import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

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
  }
};

export default taskService;