import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import cropService from "@/services/api/cropService";
import cropYieldService from "@/services/api/cropYieldService";

const CropForm = ({ farmId, crop, onSuccess, onCancel }) => {
const [formData, setFormData] = useState({
    crop_name_c: crop?.crop_name_c || "",
    variety_c: crop?.variety_c || "",
    planting_date_c: crop?.planting_date_c || "",
    expected_harvest_date_c: crop?.expected_harvest_date_c || "",
    growth_stage_c: crop?.growth_stage_c || "Planted",
    status_c: crop?.status_c || "Active",
    notes_c: crop?.notes_c || "",
    crop_yield_c_id_c: crop?.crop_yield_c_id_c || ""
  });
  const [availableYields, setAvailableYields] = useState([]);
  const [loadingYields, setLoadingYields] = useState(false);

  const [loading, setLoading] = useState(false);

useEffect(() => {
    loadYields();
  }, []);

  const loadYields = async () => {
    setLoadingYields(true);
    try {
      const yields = await cropYieldService.getAll();
      setAvailableYields(yields.map(y => ({
        value: y.Id,
        label: `${y.crop_name_c} - ${y.yield_amount_c} ${y.yield_unit_c} (${y.harvest_date_c})`
      })));
    } catch (error) {
      console.error("Error loading yields:", error);
    } finally {
      setLoadingYields(false);
    }
  };

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
        await cropService.create({ ...formData, farm_id_c: farmId });
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
          name="crop_name_c"
          value={formData.crop_name_c}
          onChange={handleChange}
          placeholder="e.g., Corn, Wheat, Tomatoes"
          required
        />

        <Input
          label="Variety"
          name="variety_c"
          value={formData.variety_c}
          onChange={handleChange}
          placeholder="e.g., Sweet Golden"
          required
        />

        <Input
          label="Planting Date"
          name="planting_date_c"
          type="date"
          value={formData.planting_date_c}
          onChange={handleChange}
          required
        />

        <Input
          label="Expected Harvest Date"
          name="expected_harvest_date_c"
          type="date"
          value={formData.expected_harvest_date_c}
          onChange={handleChange}
          required
        />

        <Select
          label="Growth Stage"
          name="growth_stage_c"
          value={formData.growth_stage_c}
          onChange={handleChange}
          options={growthStages}
        />

        <Select
          label="Status"
          name="status_c"
          value={formData.status_c}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Select
          label="Associated Yield Record (Optional)"
          name="crop_yield_c_id_c"
          value={formData.crop_yield_c_id_c}
          onChange={handleChange}
          options={availableYields}
          placeholder={loadingYields ? "Loading yields..." : "Select a yield record"}
          disabled={loadingYields}
        />
      </div>

      <TextArea
        label="Notes"
name="notes_c"
        value={formData.notes_c}
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