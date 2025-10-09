import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import TaskForm from "@/components/organisms/TaskForm";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";
import cropService from "@/services/api/cropService";

const Tasks = () => {
  const { selectedFarmId } = useOutletContext();
  
  const [tasks, setTasks] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  useEffect(() => {
    if (selectedFarmId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [selectedFarmId]);

  useEffect(() => {
    if (filterStatus === "All") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(t => t.status === filterStatus));
    }
  }, [tasks, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksData, cropsData] = await Promise.all([
        taskService.getByFarmId(selectedFarmId),
        cropService.getByFarmId(selectedFarmId)
      ]);
      setTasks(tasksData);
      setCrops(cropsData);
    } catch (error) {
      setError("Failed to load tasks");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const handleAdd = () => {
    setSelectedTask(null);
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleUseTemplate = async () => {
    setTemplatesLoading(true);
    try {
      const templateData = await taskService.getTemplates();
      setTemplates(templateData);
      setIsTemplateModalOpen(true);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setIsTemplateModalOpen(false);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(id);
        toast.success("Task deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete task");
        console.error(error);
      }
    }
  };

  const handleToggleStatus = async (task) => {
const newStatus = task.status_c === "Completed" ? "Pending" : "Completed";
    
    try {
await taskService.update(task.Id, {
        ...task,
        status_c: newStatus,
        completedAt: newStatus === "Completed" ? Date.now() : null
      });
      toast.success(`Task marked as ${newStatus.toLowerCase()}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadData();
  };

  if (loading) return <Loading text="Loading tasks..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  if (!selectedFarmId) {
    return (
      <Empty
        icon="Map"
        title="No Farm Selected"
        message="Please select a farm from the header to manage tasks"
      />
    );
  }

  const getCropName = (cropId) => {
const crop = crops.find(c => c.Id === cropId);
    return crop ? `${crop.crop_name_c} - ${crop.variety_c}` : "General Task";
  };

  const priorityColors = {
    High: "error",
    Medium: "warning",
    Low: "success"
  };

  const statusColors = {
    Pending: "warning",
    "In Progress": "info",
    Completed: "success"
  };

  return (
    <div className="space-y-6">
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUseTemplate} disabled={templatesLoading}>
            <ApperIcon name="FileTemplate" size={20} />
            {templatesLoading ? "Loading..." : "Use Template"}
          </Button>
          <Button onClick={handleAdd}>
            <ApperIcon name="Plus" size={20} />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[40px] ${
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          icon="ClipboardList"
          title="No tasks found"
          message={filterStatus === "All" 
            ? "Add your first task to start managing work" 
            : `No tasks with ${filterStatus} status`}
          action={filterStatus === "All" ? handleAdd : undefined}
          actionText="Add Task"
        />
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.Id} hover>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div 
                  className={`w-2 h-16 rounded-full self-start lg:self-auto bg-${priorityColors[task.priority]}`}
                />
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
<button
                        onClick={() => handleToggleStatus(task)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                          task.status_c === "Completed"
                            ? "bg-success border-success"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {task.status_c === "Completed" && (
                          <ApperIcon name="Check" size={16} className="text-white" />
                        )}
                      </button>
                      <div>
<h3 className={`font-bold text-lg ${
                          task.status_c === "Completed" ? "line-through text-gray-500" : "text-gray-900"
                        }`}>
                          {task.title_c}
                        </h3>
<p className="text-sm text-gray-500">{getCropName(task.crop_id_c)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
<Badge variant={priorityColors[task.priority_c]}>
                        {task.priority_c}
                      </Badge>
                      <Badge variant={statusColors[task.status_c]}>
                        {task.status_c}
                      </Badge>
                    </div>
                  </div>

{task.description_c && (
                    <p className="text-gray-600">{task.description_c}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Calendar" size={16} />
<span>Due: {format(new Date(task.due_date_c), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(task)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(task.Id)}
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

{/* Template Selection Modal */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title="Choose Task Template"
      >
        <div className="space-y-6">
          <p className="text-gray-600">Select a pre-defined template for common farm activities:</p>
          
          {templates.reduce((acc, template) => {
            if (!acc[template.category]) {
              acc[template.category] = [];
            }
            acc[template.category].push(template);
            return acc;
          }, {}) && Object.entries(templates.reduce((acc, template) => {
            if (!acc[template.category]) {
              acc[template.category] = [];
            }
            acc[template.category].push(template);
            return acc;
          }, {})).map(([category, categoryTemplates]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-1">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categoryTemplates.map((template) => (
                  <button
                    key={template.Id}
                    onClick={() => handleSelectTemplate(template)}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <ApperIcon name={template.icon} size={20} className="text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900">{template.title}</div>
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">{template.description}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Priority: {template.priority}</span>
                            <span>Duration: {template.estimatedDuration}</span>
                            <span>Frequency: {template.frequency}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={template.priority === 'High' ? 'error' : template.priority === 'Medium' ? 'warning' : 'success'} size="sm">
                        {template.priority}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
title={selectedTask ? "Edit Task" : selectedTemplate ? `Create Task from Template: ${selectedTemplate.title}` : "Add New Task"}
      >
        <TaskForm
          farmId={selectedFarmId}
          task={selectedTask}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Tasks;