import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
function Tickets() {

  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  // console.log(token);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "GET"
      })
      console.log(res);

      const data = await res.json();
      setTickets(data || []);


    } catch (error) {
      console.error("Failed to Fetch tickets", error)
    } finally {
      // 🚨 CRITICAL FIX: This MUST run after the initial fetch is complete
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchTickets();

    // const intervalId = setInterval(fetchTickets, 10000); // Poll every 10 seconds (10000ms)

    // // 3. Clean up the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      })
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      // Keep this one, it's the correct placement.
      setLoading(false);
    }
  }
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Navbar/>
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
        <button className="btn btn-primary" type="submit" disabled={loading} >

          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>


      <h2>
        All Tickets
      </h2>
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket._id}
            className="card shadow-md p-4 bg-gray-800"
            to={`/tickets/${ticket._id}`}
          >
            <h3 className="font-bold text-lg">{ticket.title}</h3>
            <p className="text-sm">{ticket.description}</p>
            <p className="text-sm text-gray-500">
              Created At: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </Link>
        ))}
        {tickets.length === 0 && <p>No tickets submitted yet.</p>}
      </div>
    </div>
  )
}

export default Tickets