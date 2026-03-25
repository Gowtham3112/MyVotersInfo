import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./component/common/LoginPage";
import ProtectedRoute from "./component/common/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./page/admin/dashboard/AdminDashboard";
import AdminCategory from "./page/admin/category/AdminCategory";
import AdminUserGrid from "./page/admin/user/AdminUserGrid";
import AdminPart from "./page/admin/partno/AdminPart";
import AdminWard from "./page/admin/ward/AdminWard";
import AdminArea from "./page/admin/area/AdminArea";
import AdminVoter from "./page/admin/voter/AdminVoter";
import Home from "./component/public/Home";

function App() {
  return (
    <>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="part" element={<AdminPart />} />
          <Route path="ward" element={<AdminWard />} />
          <Route path="area" element={<AdminArea />} />
          <Route path="voter" element={<AdminVoter />} />
          <Route path="user" element={<AdminUserGrid />} />
        </Route>
        
      </Routes>
    </>
  );
}

export default App;
