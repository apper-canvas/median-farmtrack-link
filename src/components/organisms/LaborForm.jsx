import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import laborService from "@/services/api/laborService";

const LaborForm = ({ farmId, labor, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: labor?.Name || "",
    task_c: labor?.task_c || "",
    employee_c: labor?.employee_c || "",
    time_c: labor?.time_c || "",
    Tags: labor?.Tags || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const laborData = {
        ...formData,
        farm_c: farmId,
        time_c: parseFloat(formData.time_c)
      };

      if (labor) {
        await laborService.update(labor.Id, laborData);
        toast.success("Labor record updated successfully!");
      } else {
        await laborService.create(laborData);
        toast.success("Labor record added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save labor record");
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
        label="Record Name"
        name="Name"
        value={formData.Name}
        onChange={handleChange}
        placeholder="e.g., Morning Harvest - John Doe"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Task"
          name="task_c"
          value={formData.task_c}
          onChange={handleChange}
          placeholder="e.g., Harvesting corn"
          required
        />

        <Input
          label="Employee Name"
          name="employee_c"
          value={formData.employee_c}
          onChange={handleChange}
          placeholder="e.g., John Doe"
          required
        />

        <Input
          label="Hours Worked"
          name="time_c"
          type="number"
          step="0.1"
          min="0"
          value={formData.time_c}
          onChange={handleChange}
          placeholder="e.g., 8.5"
          required
        />
      </div>

      <TextArea
        label="Tags (comma-separated)"
        name="Tags"
        value={formData.Tags}
        onChange={handleChange}
        placeholder="e.g., harvest, overtime, weekend"
        rows={2}
      />

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
          {loading ? "Saving..." : labor ? "Update Labor" : "Add Labor"}
        </Button>
      </div>
    </form>
  );
};

export default LaborForm;