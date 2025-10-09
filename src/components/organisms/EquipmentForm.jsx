import React, { useState } from "react";
import { toast } from "react-toastify";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import equipmentService from "@/services/api/equipmentService";

const EquipmentForm = ({ equipment, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name_c: equipment?.name_c || "",
    description_c: equipment?.description_c || "",
    type_c: equipment?.type_c || "Tractor",
    purchase_date_c: equipment?.purchase_date_c || "",
    price_c: equipment?.price_c || "",
    is_active_c: equipment?.is_active_c !== undefined ? equipment.is_active_c : true,
    Tags: equipment?.Tags || ""
  });

  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: "Tractor", label: "Tractor" },
    { value: "Harvester", label: "Harvester" },
    { value: "Plow", label: "Plow" },
    { value: "Seeder", label: "Seeder" },
    { value: "Irrigation System", label: "Irrigation System" },
    { value: "Other", label: "Other" }
  ];

  const statusOptions = [
    { value: true, label: "Active" },
    { value: false, label: "Inactive" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const equipmentData = {
        ...formData,
        price_c: formData.price_c ? parseFloat(formData.price_c) : null
      };

      if (equipment) {
        await equipmentService.update(equipment.Id, equipmentData);
        toast.success("Equipment updated successfully!");
      } else {
        await equipmentService.create(equipmentData);
        toast.success("Equipment added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save equipment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Equipment Name"
        name="name_c"
        value={formData.name_c}
        onChange={handleChange}
        placeholder="e.g., John Deere 5075E"
        required
      />

      <TextArea
        label="Description"
        name="description_c"
        value={formData.description_c}
        onChange={handleChange}
        placeholder="Add equipment details..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Equipment Type"
          name="type_c"
          value={formData.type_c}
          onChange={handleChange}
          options={typeOptions}
          required
        />

        <Select
          label="Status"
          name="is_active_c"
          value={formData.is_active_c}
          onChange={(e) => setFormData({...formData, is_active_c: e.target.value === 'true'})}
          options={statusOptions}
        />

        <Input
          label="Purchase Date"
          name="purchase_date_c"
          type="date"
          value={formData.purchase_date_c}
          onChange={handleChange}
        />

        <Input
          label="Purchase Price"
          name="price_c"
          type="number"
          step="0.01"
          min="0"
          value={formData.price_c}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Tags"
        name="Tags"
        value={formData.Tags}
        onChange={handleChange}
        placeholder="e.g., heavy-duty, maintenance-due"
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
          {loading ? "Saving..." : equipment ? "Update Equipment" : "Add Equipment"}
        </Button>
      </div>
    </form>
  );
};

export default EquipmentForm;