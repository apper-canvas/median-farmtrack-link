import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Expenses from "@/components/pages/Expenses";
import Weather from "@/components/pages/Weather";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crops" element={<Crops />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;