import React, { useEffect, useState } from "react";
import { format, parseISO, subMonths } from "date-fns";
import cropYieldService from "@/services/api/cropYieldService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Crops from "@/components/pages/Crops";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const YieldAnalytics = ({ cropName = null, showCropFilter = true }) => {
  const [yields, setYields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [selectedCrop, setSelectedCrop] = useState(cropName || "all");

  const periods = [
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "12months", label: "Last 12 Months" },
    { value: "all", label: "All Time" }
  ];

  useEffect(() => {
    loadYieldData();
  }, [selectedPeriod, selectedCrop]);

  const loadYieldData = async () => {
    setLoading(true);
    setError("");

    try {
      let data;
      
      if (selectedCrop && selectedCrop !== "all") {
        data = await cropYieldService.getByCropName(selectedCrop);
      } else {
        data = await cropYieldService.getAll();
      }

      // Filter by period if not "all"
      if (selectedPeriod !== "all") {
        const monthsBack = parseInt(selectedPeriod.replace("months", ""));
const cutoffDate = subMonths(new Date(), monthsBack);
        
        data = data.filter(yieldRecord => {
          const harvestDate = parseISO(yieldRecord.harvest_date_c);
          return harvestDate >= cutoffDate;
        });
      }

      setYields(data);
    } catch (error) {
      setError("Failed to load yield data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (yields.length === 0) return null;

    const totalYield = yields.reduce((sum, yield) => sum + (yield.yield_amount_c || 0), 0);
    const averageYield = totalYield / yields.length;
    const highestYield = Math.max(...yields.map(y => y.yield_amount_c || 0));
    const lowestYield = Math.min(...yields.map(y => y.yield_amount_c || 0));

    // Group by crop for crop comparison
    const cropStats = yields.reduce((acc, yield) => {
      const crop = yield.crop_name_c;
      if (!acc[crop]) {
        acc[crop] = { total: 0, count: 0, yields: [] };
      }
      acc[crop].total += yield.yield_amount_c || 0;
      acc[crop].count += 1;
      acc[crop].yields.push(yield);
      return acc;
    }, {});

    const topCrops = Object.entries(cropStats)
      .map(([crop, stats]) => ({
        crop,
        average: stats.total / stats.count,
        total: stats.total,
        count: stats.count
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);

    return {
      totalYield,
      averageYield,
      highestYield,
      lowestYield,
      totalRecords: yields.length,
      topCrops
    };
  };

  const getUniqueUnits = () => {
    return [...new Set(yields.map(y => y.yield_unit_c).filter(Boolean))];
  };

  const getUniqueCrops = () => {
    return [...new Set(yields.map(y => y.crop_name_c).filter(Boolean))];
  };

  const stats = calculateStats();
  const uniqueUnits = getUniqueUnits();
  const uniqueCrops = getUniqueCrops();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadYieldData} />;
  if (!stats) return <Empty icon="BarChart" title="No Yield Data" message="No yield records found for the selected period." />;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Period:</span>
          {periods.map((period) => (
            <Button
              key={period.value}
              size="sm"
              variant={selectedPeriod === period.value ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </div>
        
        {showCropFilter && uniqueCrops.length > 1 && (
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-700 self-center">Crop:</span>
            <Button
              size="sm"
              variant={selectedCrop === "all" ? "default" : "outline"}
              onClick={() => setSelectedCrop("all")}
            >
              All Crops
            </Button>
            {uniqueCrops.slice(0, 4).map((crop) => (
              <Button
                key={crop}
                size="sm"
                variant={selectedCrop === crop ? "default" : "outline"}
                onClick={() => setSelectedCrop(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Wheat" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
              <p className="text-sm text-gray-500">Total Records</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.averageYield.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Average Yield</p>
              <p className="text-xs text-gray-400">{uniqueUnits.join(', ')}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.highestYield}</p>
              <p className="text-sm text-gray-500">Highest Yield</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart" size={24} className="text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalYield.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Total Yield</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Crops */}
      {stats.topCrops.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Performing Crops</h3>
            <ApperIcon name="Trophy" size={20} className="text-warning" />
          </div>
          
          <div className="space-y-4">
            {stats.topCrops.map((crop, index) => (
              <div key={crop.crop} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{crop.crop}</p>
                    <p className="text-sm text-gray-500">{crop.count} records</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{crop.average.toFixed(1)}</p>
                  <p className="text-sm text-gray-500">avg yield</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Yield Records */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Yield Records</h3>
          <ApperIcon name="Clock" size={20} className="text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {yields.slice(0, 10).map((yield) => (
            <div key={yield.Id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sprout" size={20} className="text-success" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{yield.crop_name_c}</p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(yield.harvest_date_c), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {yield.yield_amount_c} {yield.yield_unit_c}
                </p>
                {yield.Tags && (
                  <div className="flex gap-1 mt-1">
                    {yield.Tags.split(',').slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default YieldAnalytics;