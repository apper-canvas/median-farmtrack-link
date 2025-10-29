import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Navigation = ({ isMobile = false, onNavigate }) => {
const navItems = [
{ path: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/farms", icon: "Farm", label: "Farms" },
    { path: "/crops", icon: "Sprout", label: "Crops" },
    { path: "/equipment", icon: "Truck", label: "Equipment" },
    { path: "/tasks", icon: "ClipboardList", label: "Tasks" },
    { path: "/expenses", icon: "DollarSign", label: "Expenses" },
    { path: "/weather", icon: "CloudSun", label: "Weather" }
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleClick}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px] ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon name={item.icon} size={24} />
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`
            }
          >
            <ApperIcon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;