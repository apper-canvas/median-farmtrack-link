import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Navigation from "@/components/organisms/Navigation";

const Layout = () => {
  const [selectedFarmId, setSelectedFarmId] = useState(() => {
    const saved = localStorage.getItem("selectedFarmId");
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (selectedFarmId) {
      localStorage.setItem("selectedFarmId", selectedFarmId.toString());
    }
  }, [selectedFarmId]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedFarmId={selectedFarmId}
        onFarmChange={setSelectedFarmId}
      />
      
      <div className="flex">
        <Navigation />
        
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Outlet context={{ selectedFarmId }} />
          </div>
        </main>
      </div>

      <Navigation isMobile />
    </div>
  );
};

export default Layout;