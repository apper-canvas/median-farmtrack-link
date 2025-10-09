import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "@/components/organisms/Navigation";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [selectedFarmId, setSelectedFarmId] = useState(() => {
    const saved = localStorage.getItem("selectedFarmId");
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (selectedFarmId) {
      localStorage.setItem("selectedFarmId", selectedFarmId.toString());
    }
  }, [selectedFarmId]);

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

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