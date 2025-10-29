import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import laborService from "@/services/api/laborService";
import farmService from "@/services/api/farmService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import LaborForm from "@/components/organisms/LaborForm";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Modal from "@/components/molecules/Modal";
function Labors({ selectedFarmId }) {
  const [labors, setLabors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [farms, setFarms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState(null);

  useEffect(() => {
    const loadFarm = async () => {
      if (selectedFarmId) {
        try {
          const farmData = await farmService.getById(selectedFarmId);
          setSelectedFarm(farmData);
        } catch (err) {
          console.error('Error loading farm:', err);
        }
      }
    };
    loadFarm();
  }, [selectedFarmId]);

  useEffect(() => {
    if (selectedFarm?.Id) {
      loadLabors();
    }
  }, [selectedFarm]);

  const loadLabors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await laborService.getAll();
      
      // Filter by selected farm
      const filtered = data.filter(labor => 
        labor.farm_c?.Id === selectedFarm.Id
      );
      
      setLabors(filtered);
    } catch (err) {
      setError(err.message || 'Failed to load labor records');
      console.error('Error loading labors:', err);
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
    if (!window.confirm('Are you sure you want to delete this labor record?')) {
      return;
    }

    try {
      await laborService.delete(id);
      toast.success('Labor record deleted successfully');
      loadLabors();
    } catch (err) {
      toast.error(err.message || 'Failed to delete labor record');
      console.error('Error deleting labor:', err);
    }
  };
const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedLabor(null);
    loadLabors();
    toast.success(selectedLabor ? 'Labor record updated successfully' : 'Labor record created successfully');
  };
if (!selectedFarm?.Id) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please select a farm to view labor records</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Labor Records</h1>
          <p className="text-gray-600 mt-1">Track employee work hours and tasks</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon name="Plus" size={20} />
          <span>Add Labor</span>
        </button>
      </div>

      {/* Labor List */}
{labors.length === 0 ? (
        <Empty
          message="No labor records found"
          action={
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Plus" size={20} />
              <span>Add Labor Record</span>
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labors.map((labor) => (
            <Card key={labor.Id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Users" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{labor.Name || 'Unnamed'}</h3>
                    <p className="text-sm text-gray-600">{labor.employee_c || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(labor)}
                    className="text-gray-600 hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <ApperIcon name="Edit" size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(labor.Id)}
                    className="text-gray-600 hover:text-error transition-colors"
                    title="Delete"
                  >
                    <ApperIcon name="Trash2" size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <ApperIcon name="ClipboardList" size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Task</p>
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {labor.task_c || 'No task specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ApperIcon name="Clock" size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Time (hours)</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {labor.time_c || 0} hrs
                    </p>
                  </div>
                </div>

<div className="flex items-start gap-2">
                  <ApperIcon name="MapPin" size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Farm</p>
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {labor.farm_c?.Name || 'N/A'}
                    </p>
                  </div>
                </div>

                {labor.Tags && (
                  <div className="flex items-start gap-2">
                    <ApperIcon name="Tag" size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {labor.Tags.split(',').map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created by {labor.CreatedBy?.Name || 'Unknown'}</span>
                  <span>
                    {labor.CreatedOn
                      ? new Date(labor.CreatedOn).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Labor Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLabor(null);
        }}
        title={selectedLabor ? 'Edit Labor Record' : 'Add Labor Record'}
      >
        <LaborForm
          farmId={selectedFarm?.Id}
          labor={selectedLabor}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLabor(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Labors;