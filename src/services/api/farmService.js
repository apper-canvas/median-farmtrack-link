import farmsData from "@/services/mockData/farms.json";

let farms = [...farmsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const farmService = {
  getAll: async () => {
    await delay();
    return [...farms];
  },

  getById: async (id) => {
    await delay();
    const farm = farms.find(f => f.Id === parseInt(id));
    return farm ? { ...farm } : null;
  },

  create: async (farm) => {
    await delay();
    const maxId = farms.length > 0 ? Math.max(...farms.map(f => f.Id)) : 0;
    const newFarm = {
      Id: maxId + 1,
      ...farm,
      createdAt: Date.now()
    };
    farms.push(newFarm);
    return { ...newFarm };
  },

  update: async (id, data) => {
    await delay();
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index !== -1) {
      farms[index] = { ...farms[index], ...data };
      return { ...farms[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = farms.findIndex(f => f.Id === parseInt(id));
    if (index !== -1) {
      farms.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default farmService;