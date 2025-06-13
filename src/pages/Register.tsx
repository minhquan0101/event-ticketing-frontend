import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axiosClient.post("/register", form);
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err: any) {
      setError(err?.response?.data?.error || "Đăng ký thất bại");
    }
  };

   return (
    <div className="d-flex flex-column align-items-center justify-content-start bg-light" style={{ height: "100vh", paddingTop: "60px" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">  
            <input
              name="name"
              className="form-control"
              placeholder="Họ tên"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              required
              onChange={handleChange}
            />
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Đăng ký
          </button>
        </form>
        <p className="text-center mt-3">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-decoration-none text-primary">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;  
