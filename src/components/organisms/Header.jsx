import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FarmSelector from "@/components/molecules/FarmSelector";

const Header = ({ selectedFarmId, onFarmChange }) => {
  const { user } = useSelector((state) => state.user);
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-primary">FarmTrack</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <FarmSelector 
              selectedFarmId={selectedFarmId}
              onFarmChange={onFarmChange}
            />
            
            <div className="flex items-center gap-3">
              {user && (
                <span className="text-sm text-gray-600 hidden lg:block">
                  Welcome, {user.firstName || user.name || 'User'}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;