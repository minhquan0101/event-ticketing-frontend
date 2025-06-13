import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface MyJwtPayload {
  user_id: string;
  email: string;
  role: string;
  exp: number;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken"); // ✅ sửa đúng key

  let isAdmin = false;
  let email = "";

  if (token) {
    try {
      const decoded = jwtDecode<MyJwtPayload>(token);
      isAdmin = decoded.role === "admin";
      email = decoded.email;
    } catch {
      isAdmin = false;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "10px 20px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: 20 }}>
          🏠 Trang chủ
        </Link>
        {token && (
          <Link to="/orders" style={{ marginRight: 20 }}>
            📦 Đơn hàng
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin/events" style={{ marginRight: 20 }}>
            ⚙️ Thêm sự kiện
          </Link>
        )}
      </div>
      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ marginRight: 15 }}>
              Đăng nhập
            </Link>
            <Link to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: 10 }}>👋 {email}</span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
