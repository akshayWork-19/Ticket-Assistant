import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
// check user AUTHENTICATION

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);
    const set = () => setLoading(false);
    if (protectedRoute) {
      if (!token) {
        navigate('/login', { state: { from: location.pathname } });
      } else {
        set();
      }
    } else {
      // 2. Logic for NON-PROTECTED Routes (like /login, /register)
      if (token && (location.pathname === '/login' || location.pathname === '/register')) {
        // ONLY redirect to home if the user is logged in AND trying to access the login/register pages.
        navigate("/");
      } else {
        // For all other public pages (like /Admin, if it's meant to be public but accessible to everyone)
        // OR if the user is not logged in on /login, allow them to view the children.
        set();
      }
    }
  }, [navigate, protectedRoute, location.pathname]);

  if (loading) {
    return <>
      <div>  loading...</div></>
  }
  return children;


}

export default CheckAuth