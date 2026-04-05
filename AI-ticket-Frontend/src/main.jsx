import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./Components/CheckAuth";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"

import Landing from "./pages/Landing";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path='/' element={
            <Landing />
          }
        />
        <Route
          path='/dashboard' element={
            <CheckAuth protectedRoute={true}>
              <Tickets />
            </CheckAuth>
          }
        />
        <Route
          path='/tickets/:id' element={<CheckAuth protectedRoute={true}>
            <TicketDetailsPage />
          </CheckAuth>}
        />
        <Route
          path='/login' element={<CheckAuth protectedRoute={false}>
            <Login />
          </CheckAuth>}
        />
        <Route
          path='/signup' element={<CheckAuth protectedRoute={false}>
            <Signup />
          </CheckAuth>}
        />

        <Route
          path='/admin' element={<CheckAuth protectedRoute={true}>
            <Admin />
          </CheckAuth>}
        />
        <Route
          path='/profile' element={<CheckAuth protectedRoute={true}>
            <Profile />
          </CheckAuth>}
        />


      </Routes>
      <Toaster position="top-center" theme="dark" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
)
