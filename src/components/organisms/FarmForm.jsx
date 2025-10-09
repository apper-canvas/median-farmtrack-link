import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import farmService from "@/services/api/farmService";

const FarmForm = ({ farm, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name_c: farm?.name_c || "",
    size_c: farm?.size_c || "",
    unit_c: farm?.unit_c || "acres",
    location_c: farm?.location_c || "",
    Tags: farm?.Tags || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = "Farm name is required";
    }

    if (formData.size_c && isNaN(parseFloat(formData.size_c))) {
      newErrors.size_c = "Farm size must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (farm) {
        // Update existing farm
        await farmService.update(farm.Id, formData);
        toast.success("Farm updated successfully!");
      } else {
        // Create new farm
        await farmService.create(formData);
        toast.success("Farm created successfully!");
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error.message || (farm ? "Failed to update farm" : "Failed to create farm");
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unitOptions = [
    { value: "acres", label: "Acres" },
    { value: "hectares", label: "Hectares" },
    { value: "square_feet", label: "Square Feet" },
    { value: "square_meters", label: "Square Meters" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Farm Name"
        required
        value={formData.name_c}
        onChange={(e) => handleInputChange("name_c", e.target.value)}
        error={errors.name_c}
        placeholder="Enter farm name"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Size"
          type="number"
          step="0.01"
          min="0"
          value={formData.size_c}
          onChange={(e) => handleInputChange("size_c", e.target.value)}
          error={errors.size_c}
          placeholder="0.00"
        />

        <Select
          label="Unit"
          value={formData.unit_c}
          onChange={(value) => handleInputChange("unit_c", value)}
          options={unitOptions}
        />
      </div>

      <Input
        label="Location"
        value={formData.location_c}
        onChange={(e) => handleInputChange("location_c", e.target.value)}
        placeholder="Enter farm location"
      />

      <Input
        label="Tags"
        value={formData.Tags}
        onChange={(e) => handleInputChange("Tags", e.target.value)}
        placeholder="Enter tags separated by commas"
        helpText="Separate multiple tags with commas"
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="flex-1"
        >
          {farm ? "Update Farm" : "Create Farm"}
        </Button>
      </div>
    </form>
  );
};

export default FarmForm;