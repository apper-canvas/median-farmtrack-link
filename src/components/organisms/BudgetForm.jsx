import { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import expenseService from "@/services/api/expenseService";

const BudgetForm = ({ farmId, budgets, onSuccess, onCancel }) => {
  const categories = ["Seeds", "Fertilizer", "Equipment", "Labor", "Other"];
  
  const [budgetData, setBudgetData] = useState(() => {
    const initialData = {};
    categories.forEach(category => {
      const existingBudget = budgets.find(b => b.category === category);
      initialData[category] = existingBudget ? existingBudget.budgetAmount.toString() : "";
    });
    return initialData;
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (category, value) => {
    setBudgetData(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetsToSave = Object.entries(budgetData)
        .filter(([category, amount]) => amount && parseFloat(amount) > 0)
        .map(([category, amount]) => ({
          category,
          budgetAmount: parseFloat(amount)
        }));

      for (const budget of budgetsToSave) {
        await expenseService.setBudget(farmId, budget.category, budget.budgetAmount);
      }

      toast.success(`Updated budgets for ${budgetsToSave.length} categories`);
      onSuccess();
    } catch (error) {
      toast.error("Failed to save budgets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentBudget = (category) => {
    return budgets.find(b => b.category === category);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Set budget limits for each expense category. You'll receive alerts when spending reaches 80% of your budget.
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {categories.map(category => {
          const currentBudget = getCurrentBudget(category);
          
          return (
            <Card key={category} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{category}</h3>
                  {currentBudget && (
                    <span className="text-sm text-gray-500">
                      Current: ${currentBudget.budgetAmount.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter budget amount"
                  value={budgetData[category]}
                  onChange={(e) => handleInputChange(category, e.target.value)}
                  className="w-full"
                />
                
                {currentBudget && (
                  <div className="text-xs text-gray-400">
                    Alert threshold: ${(currentBudget.budgetAmount * 0.8).toFixed(2)} (80%)
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Budgets"}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;