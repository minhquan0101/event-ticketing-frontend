import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axiosClient.post("/verify-email", { email, code });
      alert("Xác minh thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Xác minh thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Xác minh Email</h2>
      <p>Email: <strong>{email}</strong></p>
      <form onSubmit={handleVerify}>
        <input
          placeholder="Nhập mã xác nhận"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Xác minh</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
