import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import TextArea from "@/components/atoms/TextArea";
import Button from "@/components/atoms/Button";
import expenseService from "@/services/api/expenseService";

const ExpenseForm = ({ farmId, expense, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category: expense?.category || "Seeds",
    amount: expense?.amount || "",
    date: expense?.date || "",
    description: expense?.description || ""
  });

  const [loading, setLoading] = useState(false);

  const categoryOptions = [
    { value: "Seeds", label: "Seeds" },
    { value: "Fertilizer", label: "Fertilizer" },
    { value: "Equipment", label: "Equipment" },
    { value: "Labor", label: "Labor" },
    { value: "Other", label: "Other" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expenseData = {
        ...formData,
        farmId,
        amount: parseFloat(formData.amount)
      };

      if (expense) {
        await expenseService.update(expense.Id, expenseData);
        toast.success("Expense updated successfully!");
      } else {
        await expenseService.create(expenseData);
        toast.success("Expense added successfully!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Failed to save expense");
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
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
        />

        <Input
          label="Amount ($)"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Add expense details..."
        rows={3}
        required
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
          {loading ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;