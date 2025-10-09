import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import ExpenseForm from "@/components/organisms/ExpenseForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import expenseService from "@/services/api/expenseService";

const Expenses = () => {
  const { selectedFarmId } = useOutletContext();
  
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    if (selectedFarmId) {
      loadExpenses();
    } else {
      setLoading(false);
    }
  }, [selectedFarmId]);

  useEffect(() => {
    if (filterCategory === "All") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(e => e.category === filterCategory));
    }
  }, [expenses, filterCategory]);

  const loadExpenses = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await expenseService.getByFarmId(selectedFarmId);
      setExpenses(data);
    } catch (error) {
      setError("Failed to load expenses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expenseService.delete(id);
        toast.success("Expense deleted successfully!");
        loadExpenses();
      } catch (error) {
        toast.error("Failed to delete expense");
        console.error(error);
      }
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    loadExpenses();
  };

  if (loading) return <Loading text="Loading expenses..." />;
  if (error) return <Error message={error} onRetry={loadExpenses} />;
  
  if (!selectedFarmId) {
    return (
      <Empty
        icon="Map"
        title="No Farm Selected"
        message="Please select a farm from the header to manage expenses"
      />
    );
  }

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif"
    },
    labels: Object.keys(categoryTotals),
    colors: ["#2D5016", "#8B6914", "#E67E22", "#27AE60", "#3498DB"],
    legend: {
      position: "bottom"
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(0) + "%";
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "$" + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(0);
              }
            }
          }
        }
      }
    }
  };

  const chartSeries = Object.values(categoryTotals);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryColors = {
    Seeds: "success",
    Fertilizer: "warning",
    Equipment: "info",
    Labor: "error",
    Other: "default"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" size={20} />
          Add Expense
        </Button>
      </div>

      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Expense Breakdown</h2>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={350}
            />
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-primary">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                {Object.entries(categoryTotals).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{category}</span>
                    <span className="font-bold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {["All", "Seeds", "Fertilizer", "Equipment", "Labor", "Other"].map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 min-h-[40px] ${
              filterCategory === category
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredExpenses.length === 0 ? (
        <Empty
          icon="DollarSign"
          title="No expenses found"
          message={filterCategory === "All" 
            ? "Add your first expense to start tracking costs" 
            : `No expenses in ${filterCategory} category`}
          action={filterCategory === "All" ? handleAdd : undefined}
          actionText="Add Expense"
        />
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.Id} hover>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="DollarSign" size={24} className="text-error" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </h3>
                      <Badge variant={categoryColors[expense.category]}>
                        {expense.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{expense.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ApperIcon name="Calendar" size={16} />
                      <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(expense)}
                  >
                    <ApperIcon name="Edit" size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(expense.Id)}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedExpense ? "Edit Expense" : "Add New Expense"}
      >
        <ExpenseForm
          farmId={selectedFarmId}
          expense={selectedExpense}
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Expenses;