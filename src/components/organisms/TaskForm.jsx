import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import taskService from "@/services/api/taskService";
import cropService from "@/services/api/cropService";

const TaskForm = ({ farmId, task, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    title_c: task?.title_c || "",
    description_c: task?.description_c || "",
    due_date_c: task?.due_date_c || "",
    priority_c: task?.priority_c || "Medium",
    status_c: task?.status_c || "Pending",
    crop_id_c: task?.crop_id_c || ""
  });

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCrops();
  }, [farmId]);

  const loadCrops = async () => {
    try {
      const data = await cropService.getByFarmId(farmId);
      setCrops(data);
    } catch (error) {
      console.error("Error loading crops:", error);
    }
  };

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" }
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" }
  ];

  const cropOptions = [
    { value: "", label: "No specific crop" },
...crops.map(crop => ({ value: crop.Id, label: `${crop.crop_name_c} - ${crop.variety_c}` }))
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const taskData = {
        ...formData,
        farm_id_c: farmId,
        crop_id_c: formData.crop_id_c ? parseInt(formData.crop_id_c) : null
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Task Title"
name="title_c"
        value={formData.title_c}
        onChange={handleChange}
        placeholder="e.g., Water corn field"
        required
      />

      <TextArea
        label="Description"
name="description_c"
        value={formData.description_c}
        onChange={handleChange}
        placeholder="Add task details..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Due Date"
name="due_date_c"
          type="date"
          value={formData.due_date_c}
          onChange={handleChange}
          required
        />

        <Select
          label="Priority"
name="priority_c"
          value={formData.priority_c}
          onChange={handleChange}
          options={priorityOptions}
        />

        <Select
          label="Status"
name="status_c"
          value={formData.status_c}
          onChange={handleChange}
          options={statusOptions}
        />

        <Select
          label="Related Crop"
name="crop_id_c"
          value={formData.crop_id_c}
          onChange={handleChange}
          options={cropOptions}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
</Button>
        <Button type="submit" disabled={loading}>
{loading ? "Saving..." : task ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;