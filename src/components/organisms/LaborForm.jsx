import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import laborService from '@/services/api/laborService';
import farmService from '@/services/api/farmService';

function LaborForm({ farmId, labor, onSuccess, onCancel }) {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    employee_c: '',
    task_c: '',
    time_c: '',
    farm_c: farmId || '',
    Tags: ''
  });

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (labor) {
      setFormData({
        Name: labor.Name || '',
        employee_c: labor.employee_c || '',
        task_c: labor.task_c || '',
        time_c: labor.time_c || '',
        farm_c: labor.farm_c?.Id || farmId || '',
        Tags: labor.Tags || ''
      });
    } else {
      setFormData(prev => ({
        ...prev,
        farm_c: farmId || ''
      }));
    }
  }, [labor, farmId]);

  const loadFarms = async () => {
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      console.error('Error loading farms:', err);
      toast.error('Failed to load farms');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.Name?.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (!formData.employee_c?.trim()) {
      toast.error('Please enter employee name');
      return;
    }

    if (!formData.task_c?.trim()) {
      toast.error('Please enter task description');
      return;
    }

    if (!formData.time_c) {
      toast.error('Please enter time worked');
      return;
    }

    if (!formData.farm_c) {
      toast.error('Please select a farm');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        Name: formData.Name.trim(),
        employee_c: formData.employee_c.trim(),
        task_c: formData.task_c.trim(),
        time_c: parseFloat(formData.time_c),
        farm_c: parseInt(formData.farm_c)
      };

      // Add Tags if provided
      if (formData.Tags?.trim()) {
        submitData.Tags = formData.Tags.trim();
      }

      if (labor) {
        // Update existing labor
        await laborService.update(labor.Id, submitData);
        toast.success('Labor record updated successfully');
      } else {
        // Create new labor
        await laborService.create(submitData);
        toast.success('Labor record created successfully');
      }

      onSuccess();
    } catch (err) {
      toast.error(err.message || `Failed to ${labor ? 'update' : 'create'} labor record`);
      console.error('Error submitting labor:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="Name"
        value={formData.Name}
        onChange={handleChange}
        placeholder="Enter record name"
        required
      />

      <Input
        label="Employee Name"
        name="employee_c"
        value={formData.employee_c}
        onChange={handleChange}
        placeholder="Enter employee name"
        required
      />

      <TextArea
        label="Task Description"
        name="task_c"
        value={formData.task_c}
        onChange={handleChange}
        placeholder="Describe the task performed"
        rows={3}
        required
      />

      <Input
        label="Time Worked (hours)"
        name="time_c"
        type="number"
        step="0.5"
        min="0"
        value={formData.time_c}
        onChange={handleChange}
        placeholder="Enter hours worked"
        required
      />

      <Select
        label="Farm"
        name="farm_c"
        value={formData.farm_c}
        onChange={handleChange}
        required
      >
        <option value="">Select a farm</option>
        {farms.map((farm) => (
          <option key={farm.Id} value={farm.Id}>
            {farm.Name}
          </option>
        ))}
      </Select>

      <Input
        label="Tags (comma-separated)"
        name="Tags"
        value={formData.Tags}
        onChange={handleChange}
        placeholder="e.g., harvest, maintenance, irrigation"
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? 'Saving...' : labor ? 'Update Labor' : 'Add Labor'}
        </Button>
      </div>
    </form>
  );
}

export default LaborForm;