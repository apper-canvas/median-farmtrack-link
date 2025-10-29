import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/organisms/Navigation";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(null);

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