import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import YieldForm from "@/components/organisms/YieldForm";
import YieldAnalytics from "@/components/molecules/YieldAnalytics";
import cropYieldService from "@/services/api/cropYieldService";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const CropYields = () => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYield, setSelectedYield] = useState(null);
  const [activeTab, setActiveTab] = useState("records");

  useEffect(() => {
    loadYields();
  }, []);

  const loadYields = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await cropYieldService.getAll();
      setYields(data);
    } catch (error) {
      setError("Failed to load yield records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedYield(null);
    setIsModalOpen(true);
  };

const handleEdit = (yieldRecord) => {
    setSelectedYield(yieldRecord);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this yield record?")) return;
    
    try {
      await cropYieldService.delete(id);
      toast.success("Yield record deleted successfully!");
      loadYields();
    } catch (error) {
      toast.error("Failed to delete yield record");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedYield(null);
    loadYields();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadYields} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Yields</h1>
          <p className="text-gray-600 mt-1">Track and analyze your crop yield performance</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Yield Record
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("records")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "records"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="Database" size={16} />
              Yield Records ({yields.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={16} />
              Analytics
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "records" && (
        <div>
          {yields.length === 0 ? (
            <Empty
              icon="BarChart"
              title="No Yield Records"
              message="Start tracking your crop yields to analyze performance over time."
              action={
                <Button onClick={handleAdd}>
                  <ApperIcon name="Plus" size={20} />
                  Add First Yield Record
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yields.map((yield) => (
                <Card key={yield.Id} hover>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="BarChart" size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{yield.crop_name_c}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(yield.harvest_date_c), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Yield Amount</span>
                        <span className="font-bold text-primary text-lg">
                          {yield.yield_amount_c} {yield.yield_unit_c}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Harvest Date</span>
                        <span className="font-medium text-gray-900">
                          {format(new Date(yield.harvest_date_c), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {yield.Tags && (
                      <div className="flex flex-wrap gap-1">
                        {yield.Tags.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {yield.notes_c && (
                      <p className="text-sm text-gray-600 bg-surface p-3 rounded-lg">
                        {yield.notes_c}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(yield)}
                        className="flex-1"
                      >
                        <ApperIcon name="Edit" size={16} />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(yield.Id)}
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
        </div>
      )}

      {activeTab === "analytics" && (
        <YieldAnalytics />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedYield ? "Edit Yield Record" : "Add New Yield Record"}
      >
        <YieldForm
          yieldRecord={selectedYield}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CropYields;