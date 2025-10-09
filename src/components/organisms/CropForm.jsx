import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import cropService from "@/services/api/cropService";

const CropForm = ({ farmId, crop, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    cropName: crop?.cropName || "",
    variety: crop?.variety || "",
    plantingDate: crop?.plantingDate || "",
    expectedHarvestDate: crop?.expectedHarvestDate || "",
    growthStage: crop?.growthStage || "Planted",
    status: crop?.status || "Active",
    notes: crop?.notes || ""
  });

  const [loading, setLoading] = useState(false);

  const growthStages = [
    { value: "Planted", label: "Planted" },
    { value: "Growing", label: "Growing" },
    { value: "Ready", label: "Ready for Harvest" },
    { value: "Harvested", label: "Harvested" }
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (crop) {
        await cropService.update(crop.Id, formData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create({ ...formData, farmId });
        toast.success("Crop added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save crop");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Crop Name"
          name="cropName"
          value={formData.cropName}
          onChange={handleChange}
          placeholder="e.g., Corn, Wheat, Tomatoes"
          required
        />

        <Input
          label="Variety"
          name="variety"
          value={formData.variety}
          onChange={handleChange}
          placeholder="e.g., Sweet Golden"
          required
        />

        <Input
          label="Planting Date"
          name="plantingDate"
          type="date"
          value={formData.plantingDate}
          onChange={handleChange}
          required
        />

        <Input
          label="Expected Harvest Date"
          name="expectedHarvestDate"
          type="date"
          value={formData.expectedHarvestDate}
          onChange={handleChange}
          required
        />

        <Select
          label="Growth Stage"
          name="growthStage"
          value={formData.growthStage}
          onChange={handleChange}
          options={growthStages}
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      <TextArea
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any additional notes about this crop..."
        rows={3}
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
          {loading ? "Saving..." : crop ? "Update Crop" : "Add Crop"}
        </Button>
      </div>
    </form>
  );
};

export default CropForm;