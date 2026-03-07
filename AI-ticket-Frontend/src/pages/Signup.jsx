import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      })
      console.log(res);
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/')
      } else {
        alert(data.message || "Signup Failed!")
      }
    } catch (error) {
      alert("Signup-something went wrong", error);
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <form onSubmit={handleSignup} className="card-body">
          <h2 className="card-title justify-center">Signup</h2>
          <input type='email' name='email' placeholder='email' className='input input-bordered' value={form.email} onChange={handleChange} required />

          <input type='password' name='password' placeholder='password' className='input input-bordered' value={form.password} onChange={handleChange} required />

          <div className='form-control mt-4'>
            <button type="submit" disabled={loading} className='"btn btn-primary w-full"'>
              {loading ? "Signing-in..." : "Sign-Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup