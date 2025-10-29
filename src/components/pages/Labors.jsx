import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import LaborForm from "@/components/organisms/LaborForm";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import laborService from "@/services/api/laborService";

const Labors = () => {
  const { selectedFarmId } = useOutletContext();
  
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);

  useEffect(() => {
    if (selectedFarmId) {
      loadLabors();
    } else {
      setLoading(false);
    }
  }, [selectedFarmId]);

  const loadLabors = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await laborService.getByFarmId(selectedFarmId);
      setLabors(data);
    } catch (error) {
      setError("Failed to load labor records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedLabor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (labor) => {
    setSelectedLabor(labor);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this labor record?")) {
      try {
        await laborService.delete(id);
        toast.success("Labor record deleted successfully!");
        loadLabors();
      } catch (error) {
        toast.error("Failed to delete labor record");
        console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadLabors();
  };

  if (loading) return <Loading text="Loading labor records..." />;
  if (error) return <Error message={error} onRetry={loadLabors} />;
  
  if (!selectedFarmId) {
    return (
      <Empty
        icon="Map"
        title="No Farm Selected"
        message="Please select a farm from the header to manage labor records"
      />
    );
  }

  const totalHours = labors.reduce((sum, labor) => sum + (labor.time_c || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Labor Records</h1>
          <p className="text-gray-600 mt-1">
            Total Hours: <span className="font-semibold text-primary">{totalHours.toFixed(1)} hrs</span>
          </p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Labor
        </Button>
      </div>

      {labors.length === 0 ? (
        <Empty
          icon="Users"
          title="No labor records found"
          message="Add your first labor record to start tracking work hours"
          action={handleAdd}
          actionText="Add Labor"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {labors.map((labor) => (
            <Card key={labor.Id} hover>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Users" size={24} className="text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {labor.Name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 bg-info/10 text-info rounded-full font-medium">
                          {labor.time_c} hrs
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <ApperIcon name="Briefcase" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Task: </span>
                          <span className="text-sm text-gray-700 font-medium">{labor.task_c}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <ApperIcon name="User" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm text-gray-500">Employee: </span>
                          <span className="text-sm text-gray-700 font-medium">{labor.employee_c}</span>
                        </div>
                      </div>

                      {labor.Tags && (
                        <div className="flex items-start gap-2">
                          <ApperIcon name="Tag" size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex flex-wrap gap-1">
                            {labor.Tags.split(',').map((tag, index) => (
                              <span 
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(labor)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(labor.Id)}
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
        title={selectedLabor ? "Edit Labor Record" : "Add Labor Record"}
      >
        <LaborForm
          farmId={selectedFarmId}
          labor={selectedLabor}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Labors;