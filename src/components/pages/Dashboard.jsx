import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Weather from "@/components/pages/Weather";
import Tasks from "@/components/pages/Tasks";
import Crops from "@/components/pages/Crops";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import cropYieldService from "@/services/api/cropYieldService";
import expenseService from "@/services/api/expenseService";
import taskService from "@/services/api/taskService";
import weatherService from "@/services/api/weatherService";
import cropService from "@/services/api/cropService";

const Dashboard = () => {
  const { selectedFarmId } = useOutletContext();
  const navigate = useNavigate();
  
const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [yields, setYields] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedFarmId) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [selectedFarmId]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

try {
const [cropsData, tasksData, expensesData, yieldsData, weatherData] = await Promise.all([
        cropService.getByFarmId(selectedFarmId),
        taskService.getByFarmId(selectedFarmId),
        expenseService.getByFarmId(selectedFarmId),
        cropYieldService.getAll(),
        weatherService.getCurrent()
      ]);
setCrops(cropsData);
      setTasks(tasksData);
      setExpenses(expensesData);
      setYields(yieldsData);
      setWeather(weatherData);
    } catch (error) {
      setError("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  
  if (!selectedFarmId) {
    return (
      <Empty
        icon="Map"
        title="No Farm Selected"
        message="Please select a farm from the header to view your dashboard"
      />
    );
  }

const activeCrops = crops.filter(c => c.status_c === "Active");
  const pendingTasks = tasks.filter(t => t.status_c === "Pending");
  const monthExpenses = expenses
    .filter(e => {
      const expenseDate = new Date(e.date_c);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + (e.amount_c || 0), 0);
    
const recentYields = yields
    .filter(y => {
      const yieldDate = new Date(y.harvest_date_c);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return yieldDate >= thirtyDaysAgo;
    })
    .length;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Crops"
          value={activeCrops.length}
          icon="Sprout"
          color="success"
        />
        <StatCard
          title="Recent Yields"
          value={recentYields}
          icon="BarChart"
          color="info"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          icon="ClipboardList"
          color="warning"
        />
        <StatCard
          title="This Month"
          value={`$${monthExpenses.toFixed(0)}`}
          icon="DollarSign"
          color="error"
        />
      </div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Crops</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/crops")}
            >
              View All
            </Button>
          </div>
          
          {activeCrops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active crops</p>
              <Button size="sm" onClick={() => navigate("/crops")}>
                Add Crop
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCrops.slice(0, 5).map((crop) => (
                <div
                  key={crop.Id}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Sprout" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{crop.crop_name_c}</p>
                      <p className="text-sm text-gray-500">{crop.variety_c}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                    {crop.growth_stage_c}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Yields</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/crops")}
            >
              View All
            </Button>
          </div>
          
          {yields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No yield records</p>
              <Button size="sm" onClick={() => navigate("/crops")}>
                Add Yield
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
{yields.slice(0, 5).map((yieldRecord) => (
                <div
                  key={yieldRecord.Id}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="BarChart" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{yieldRecord.crop_name_c}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(yieldRecord.harvest_date_c), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {yieldRecord.yield_amount_c} {yieldRecord.yield_unit_c}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/tasks")}
            >
              View All
            </Button>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No pending tasks</p>
              <Button size="sm" onClick={() => navigate("/tasks")}>
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map((task) => {
                const priorityColor = {
                  High: "error",
                  Medium: "warning",
                  Low: "success"
                };
                
                return (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-3 bg-surface rounded-lg"
>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        task.priority_c === 'High' ? 'bg-error/10' :
                        task.priority_c === 'Medium' ? 'bg-warning/10' : 'bg-success/10'
                      }`}>
                        <ApperIcon name="ClipboardList" size={20} className={
                          task.priority_c === 'High' ? 'text-error' :
                          task.priority_c === 'Medium' ? 'text-warning' : 'text-success'
                        } />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{task.title_c}</p>
                        <p className="text-sm text-gray-500">
                          Due: {format(new Date(task.due_date_c), "MMM d")}
                        </p>
                      </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {weather && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Weather</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={weather.icon} size={40} className="text-info" />
            </div>
            <div>
              <p className="text-4xl font-bold text-gray-900">{weather.temp}°F</p>
              <p className="text-lg text-gray-600">{weather.condition}</p>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Feels Like</p>
                <p className="font-medium text-gray-900">{weather.feelsLike}°F</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-medium text-gray-900">{weather.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Wind Speed</p>
                <p className="font-medium text-gray-900">{weather.windSpeed} mph</p>
              </div>
            </div>
            <Button onClick={() => navigate("/weather")}>
              View Forecast
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;