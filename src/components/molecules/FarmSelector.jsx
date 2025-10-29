import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";

const FarmSelector = ({ selectedFarmId, onFarmChange }) => {
  const [farms, setFarms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
const data = await farmService.getAll();
      setFarms(data);
      if (data.length > 0 && !selectedFarmId) {
        onFarmChange(data[0]);
      }
    } catch (error) {
      console.error("Error loading farms:", error);
    }
  };

  const selectedFarm = farms.find(f => f.Id === selectedFarmId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-colors duration-200 min-h-[48px]"
      >
        <ApperIcon name="Map" size={20} className="text-primary" />
        <span className="font-medium text-gray-900">
{selectedFarm ? selectedFarm.name_c : "Select Farm"}
        </span>
        <ApperIcon name="ChevronDown" size={20} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              {farms.map((farm) => (
<button
                  key={farm.Id}
                  onClick={() => {
                    onFarmChange(farm);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    farm.Id === selectedFarmId
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
<p className="font-medium">{farm.name_c}</p>
                      <p className="text-sm text-gray-500">
                        {farm.size_c} {farm.unit_c}
                      </p>
                    </div>
                    {farm.Id === selectedFarmId && (
                      <ApperIcon name="Check" size={20} className="text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FarmSelector;