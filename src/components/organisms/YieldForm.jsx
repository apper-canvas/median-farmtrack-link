import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import cropYieldService from "@/services/api/cropYieldService";

const YieldForm = ({ yieldRecord, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    crop_name_c: yieldRecord?.crop_name_c || "",
    yield_amount_c: yieldRecord?.yield_amount_c || "",
    yield_unit_c: yieldRecord?.yield_unit_c || "",
    harvest_date_c: yieldRecord?.harvest_date_c || "",
    notes_c: yieldRecord?.notes_c || "",
    Tags: yieldRecord?.Tags || ""
  });
  const [loading, setLoading] = useState(false);

  const yieldUnits = [
    { value: "tons", label: "Tons" },
    { value: "bushels", label: "Bushels" },
    { value: "pounds", label: "Pounds" },
    { value: "kg", label: "Kilograms" },
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
    { value: "crates", label: "Crates" },
    { value: "boxes", label: "Boxes" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (yieldRecord) {
        await cropYieldService.update(yieldRecord.Id, formData);
        toast.success("Yield record updated successfully!");
      } else {
        await cropYieldService.create(formData);
        toast.success("Yield record added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save yield record");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          label="Yield Amount"
          name="yield_amount_c"
          type="number"
          step="0.01"
          min="0"
          value={formData.yield_amount_c}
          onChange={handleChange}
          placeholder="e.g., 150.5"
          required
        />

        <Select
          label="Yield Unit"
          name="yield_unit_c"
          value={formData.yield_unit_c}
          onChange={handleChange}
          options={yieldUnits}
          placeholder="Select unit"
          required
        />

        <Input
          label="Harvest Date"
          name="harvest_date_c"
          type="date"
          value={formData.harvest_date_c}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Tags"
          name="Tags"
          value={formData.Tags}
          onChange={handleChange}
          placeholder="e.g., Organic, High Quality, Premium"
        />

        <TextArea
          label="Notes"
          name="notes_c"
          value={formData.notes_c}
          onChange={handleChange}
          placeholder="Additional notes about this yield record..."
          rows={4}
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
        <Button
          type="submit"
          loading={loading}
          disabled={!formData.crop_name_c || !formData.yield_amount_c || !formData.yield_unit_c || !formData.harvest_date_c}
        >
          {yieldRecord ? "Update" : "Add"} Yield Record
        </Button>
      </div>
    </form>
  );
};

export default YieldForm;