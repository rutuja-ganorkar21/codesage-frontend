import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import AdminUpdateForm from "./components/AdminUpdateForm.jsx";
import AdminVedio from "./components/AdminVedio"; // ← sirf ek
import AdminUpload from "./components/AdminUpload";
import ProblemPage from "./pages/ProblemPage";
import UserProfile from "./components/UserProfile";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isCheckingAuth = useSelector((state) => state.auth.isCheckingAuth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/Signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/create"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/delete"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDelete />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpdate />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/update/:id"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpdateForm />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin/video"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminVedio />
            ) : (
              <Navigate to="/" />
            )
          }
        />{" "}
        {/* ← sirf ek */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
        <Route
          path="/admin/video/upload/:problemId"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminUpload />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </>
  );
}

export default App;
