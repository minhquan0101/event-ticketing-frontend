import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axiosClient.post("/login", { email, password });

    const token = res.data.token;
    if (!token) {
      setError("Không nhận được token từ server");
      return;
    }

    localStorage.setItem("accessToken", token);
    console.log("Đã lưu token:", localStorage.getItem("accessToken"));

    navigate("/");
  } catch (err: any) {
    const message = err?.response?.data?.error || "Lỗi không xác định";
    setError(message);
  }
};



  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start bg-light"
      style={{ height: "100vh", paddingTop: "40px", overflow: "hidden" }}
    >
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Mật khẩu"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-danger mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>
        <div className="text-center mt-3">
          Chưa có tài khoản? <a href="/register">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
