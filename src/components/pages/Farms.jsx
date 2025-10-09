import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import FarmForm from "@/components/organisms/FarmForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import farmService from "@/services/api/farmService";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (error) {
      setError("Failed to load farms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedFarm(null);
    setIsModalOpen(true);
  };

  const handleEdit = (farm) => {
    setSelectedFarm(farm);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this farm? This action cannot be undone.")) {
      try {
        await farmService.delete(id);
        toast.success("Farm deleted successfully!");
        loadFarms();
      } catch (error) {
        toast.error("Failed to delete farm");
        console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadFarms();
  };

  if (loading) return <Loading text="Loading farms..." />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Farms</h1>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Farm
        </Button>
      </div>

      {farms.length === 0 ? (
        <Empty
          icon="Farm"
          title="No farms found"
          message="Add your first farm to start tracking your agricultural operations"
          action={handleAdd}
          actionText="Add Farm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.Id} hover>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Farm" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{farm.name_c}</h3>
                      <p className="text-sm text-gray-500">
                        {farm.size_c} {farm.unit_c}
                      </p>
                    </div>
                  </div>
                  <Badge variant="info">Active</Badge>
                </div>

                <div className="space-y-2">
                  {farm.location_c && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ApperIcon name="MapPin" size={16} />
                      <span>{farm.location_c}</span>
                    </div>
                  )}
                </div>

                {farm.Tags && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {farm.Tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(farm)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(farm.Id)}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFarm ? "Edit Farm" : "Add New Farm"}
      >
        <FarmForm
          farm={selectedFarm}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Farms;