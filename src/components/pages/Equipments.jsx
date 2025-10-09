import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import EquipmentForm from "@/components/organisms/EquipmentForm";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import equipmentService from "@/services/api/equipmentService";

const Equipments = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = equipment;
    
    // Filter by type
    if (filterType !== "All") {
      filtered = filtered.filter(e => e.type_c === filterType);
    }
    
    // Filter by status
    if (filterStatus !== "All") {
      if (filterStatus === "Active") {
        filtered = filtered.filter(e => e.is_active_c === true);
      } else {
        filtered = filtered.filter(e => e.is_active_c === false);
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description_c?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEquipment(filtered);
  }, [equipment, filterType, filterStatus, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await equipmentService.getAll();
      setEquipment(data);
    } catch (error) {
      setError("Failed to load equipment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEquipment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedEquipment(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await equipmentService.delete(id);
        toast.success("Equipment deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete equipment");
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      await equipmentService.update(item.Id, {
        ...item,
        is_active_c: !item.is_active_c
      });
      toast.success(`Equipment ${item.is_active_c ? 'deactivated' : 'activated'} successfully`);
      loadData();
    } catch (error) {
      toast.error("Failed to update equipment status");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadData();
  };

  if (loading) return <Loading text="Loading equipment..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const equipmentTypes = ["All", "Tractor", "Harvester", "Plow", "Seeder", "Irrigation System", "Other"];
  const statusOptions = ["All", "Active", "Inactive"];

  const typeColors = {
    Tractor: "info",
    Harvester: "warning",
    Plow: "secondary",
    Seeder: "success",
    "Irrigation System": "primary",
    Other: "gray"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Equipment
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {equipmentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[40px] ${
                  filterType === type
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="border-l border-gray-300 mx-2"></div>
          
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[40px] ${
                  filterStatus === status
                    ? "bg-secondary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredEquipment.length === 0 ? (
        <Empty
          icon="Truck"
          title="No equipment found"
          message={
            equipment.length === 0 
              ? "Add your first equipment to start tracking your farm assets"
              : "No equipment matches your current filters"
          }
          action={equipment.length === 0 ? handleAdd : undefined}
          actionText="Add Equipment"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <Card key={item.Id} hover>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${typeColors[item.type_c] || 'gray'}/10`}>
                      <ApperIcon name="Truck" size={20} className={`text-${typeColors[item.type_c] || 'gray'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {item.name_c}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={typeColors[item.type_c] || 'gray'} size="sm">
                          {item.type_c}
                        </Badge>
                        <Badge 
                          variant={item.is_active_c ? 'success' : 'error'} 
                          size="sm"
                        >
                          {item.is_active_c ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`p-1 rounded transition-colors ${
                      item.is_active_c 
                        ? 'text-success hover:bg-success/10' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={item.is_active_c ? 'Deactivate' : 'Activate'}
                  >
                    <ApperIcon name={item.is_active_c ? "ToggleRight" : "ToggleLeft"} size={20} />
                  </button>
                </div>

                {item.description_c && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.description_c}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500">
                  {item.purchase_date_c && (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Calendar" size={16} />
                      <span>Purchased: {format(new Date(item.purchase_date_c), "MMM d, yyyy")}</span>
                    </div>
                  )}
                  {item.price_c && (
                    <div className="flex items-center gap-2">
                      <ApperIcon name="DollarSign" size={16} />
                      <span>${item.price_c.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.Id)}
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

      {/* Equipment Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEquipment ? "Edit Equipment" : "Add New Equipment"}
      >
        <EquipmentForm
          equipment={selectedEquipment}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Equipments;