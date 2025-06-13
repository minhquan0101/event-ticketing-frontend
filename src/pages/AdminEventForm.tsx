import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


interface EventInput {
  name: string;
  description: string;
  image_url: string;
  location: string;
  date: string;
  available_tickets: number;
  ticket_price: number;
}

interface MyJwtPayload {
  user_id: string;
  email: string;
  role: string;
  exp: number;
}

const AdminEventForm: React.FC = () => {
  const [form, setForm] = useState<EventInput>({
    name: "",
    description: "",
    image_url: "",
    location: "",
    date: "",
    available_tickets: 0,
    ticket_price: 0,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Kiểm tra quyền admin
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return navigate("/");

      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        if (decoded.role !== "admin") {
          alert("Chỉ admin mới có quyền");
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setForm({
    ...form,
    [name]:
      name === "available_tickets" || name === "ticket_price"
        ? parseInt(value) || 0
        : value,
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const formData = {
      ...form,
      date: new Date(form.date).toISOString(), // ✅ chuyển về ISO format
    };

    await axiosClient.post("/events", formData);
    alert("Tạo sự kiện thành công");
    navigate("/");
  } catch (err: any) {
    setError(err?.response?.data?.error || "Tạo sự kiện thất bại");
  }
};


   return (
    <div className="container d-flex justify-content-center align-items-start" style={{ minHeight: "100vh", paddingTop: "40px" }}>
      <div className="card shadow p-4" style={{ maxWidth: 600, width: "100%" }}>
        <h3 className="text-center mb-4">Thêm Sự Kiện Mới</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="name"
            placeholder="Tên sự kiện"
            required
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            name="image_url"
            placeholder="URL ảnh"
            onChange={handleChange}
          />
          <textarea
            className="form-control mb-3"
            name="description"
            placeholder="Mô tả"
            rows={3}
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            name="location"
            placeholder="Địa điểm"
            required
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            name="date"
            type="datetime-local"
            required
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            name="available_tickets"
            type="number"
            placeholder="Số vé"
            required
            onChange={handleChange}
          />
          <input
            className="form-control mb-4"
            name="ticket_price"
            type="number"
            placeholder="Giá vé"
            required
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary w-100">
            Tạo sự kiện
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEventForm;
