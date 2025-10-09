import cropsData from "@/services/mockData/crops.json";

let crops = [...cropsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

const cropService = {
  getAll: async () => {
    await delay();
    return [...crops];
  },

  getById: async (id) => {
    await delay();
    const crop = crops.find(c => c.Id === parseInt(id));
    return crop ? { ...crop } : null;
  },

  getByFarmId: async (farmId) => {
    await delay();
    return crops.filter(c => c.farmId === parseInt(farmId)).map(c => ({ ...c }));
  },

  create: async (crop) => {
    await delay();
    const maxId = crops.length > 0 ? Math.max(...crops.map(c => c.Id)) : 0;
    const newCrop = {
      Id: maxId + 1,
      ...crop
    };
    crops.push(newCrop);
    return { ...newCrop };
  },

  update: async (id, data) => {
    await delay();
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      crops[index] = { ...crops[index], ...data };
      return { ...crops[index] };
    }
    return null;
  },

  delete: async (id) => {
    await delay();
    const index = crops.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      crops.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default cropService;