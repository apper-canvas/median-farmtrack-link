import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import CropForm from "@/components/organisms/CropForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import cropService from "@/services/api/cropService";

const Crops = () => {
  const { selectedFarmId } = useOutletContext();
  
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filterStage, setFilterStage] = useState("All");

  useEffect(() => {
    if (selectedFarmId) {
      loadCrops();
    } else {
      setLoading(false);
    }
  }, [selectedFarmId]);

  useEffect(() => {
    if (filterStage === "All") {
      setFilteredCrops(crops);
    } else {
      setFilteredCrops(crops.filter(c => c.growthStage === filterStage));
    }
  }, [crops, filterStage]);

  const loadCrops = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cropService.getByFarmId(selectedFarmId);
      setCrops(data);
    } catch (error) {
      setError("Failed to load crops");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCrop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(id);
        toast.success("Crop deleted successfully!");
        loadCrops();
      } catch (error) {
        toast.error("Failed to delete crop");
        console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadCrops();
  };

  if (loading) return <Loading text="Loading crops..." />;
  if (error) return <Error message={error} onRetry={loadCrops} />;
  
  if (!selectedFarmId) {
    return (
      <Empty
        icon="Map"
        title="No Farm Selected"
        message="Please select a farm from the header to manage crops"
      />
    );
  }

  const stageColors = {
    Planted: "info",
    Growing: "warning",
    Ready: "success",
    Harvested: "default"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Crops</h1>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Crop
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Planted", "Growing", "Ready", "Harvested"].map((stage) => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[40px] ${
              filterStage === stage
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {filteredCrops.length === 0 ? (
        <Empty
          icon="Sprout"
          title="No crops found"
          message={filterStage === "All" 
            ? "Add your first crop to start tracking" 
            : `No crops in ${filterStage} stage`}
          action={filterStage === "All" ? handleAdd : undefined}
          actionText="Add Crop"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredCrops.map((crop) => {
            const daysUntilHarvest = differenceInDays(
              new Date(crop.expected_harvest_date_c),
              new Date()
            );

            return (
              <Card key={crop.Id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Sprout" size={24} className="text-success" />
                      </div>
                      <div>
<h3 className="font-bold text-gray-900 text-lg">{crop.crop_name_c}</h3>
                        <p className="text-sm text-gray-500">{crop.variety_c}</p>
                      </div>
                    </div>
<Badge variant={stageColors[crop.growth_stage_c]}>
                      {crop.growth_stage_c}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Planted</span>
<span className="font-medium text-gray-900">
                        {format(new Date(crop.planting_date_c), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expected Harvest</span>
<span className="font-medium text-gray-900">
                        {format(new Date(crop.expected_harvest_date_c), "MMM d, yyyy")}
                      </span>
                    </div>
{daysUntilHarvest > 0 && crop.status_c === "Active" && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Days Until Harvest</span>
                        <span className="font-bold text-primary">
                          {daysUntilHarvest} days
                        </span>
                      </div>
                    )}
                  </div>

{crop.notes_c && (
                    <p className="text-sm text-gray-600 bg-surface p-3 rounded-lg">
                      {crop.notes_c}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(crop)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit" size={16} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(crop.Id)}
                      className="text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCrop ? "Edit Crop" : "Add New Crop"}
      >
        <CropForm
          farmId={selectedFarmId}
          crop={selectedCrop}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Crops;