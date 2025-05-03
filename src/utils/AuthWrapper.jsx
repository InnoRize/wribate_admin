import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "./../app/features/authSlice";
import axios from "axios";
import Swal from "sweetalert2";

const AuthWrapper = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user/getProfile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response);

      if (response.data.status === 1) {
        dispatch(setCredentials(response.data.message));
      } else {
        dispatch(logout());
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthWrapper;
