import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface EventInput {
  name: string;
  description: string;
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
    location: "",
    date: "",
    available_tickets: 0,
    ticket_price: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return navigate("/");

      try {
        const decoded: MyJwtPayload = jwtDecode(token);
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

    if (!imageFile) {
      setError("Vui lòng chọn ảnh cho sự kiện");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("date", new Date(form.date).toISOString());
      formData.append("total_tickets", String(form.available_tickets));
      formData.append("available_tickets", String(form.available_tickets));
      formData.append("ticket_price", String(form.ticket_price));
      formData.append("image", imageFile);

      await axiosClient.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
            name="image"
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
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
