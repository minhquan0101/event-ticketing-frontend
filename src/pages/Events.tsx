import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Event {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  date: string;
  available_tickets: number;
  ticket_price: number;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    axiosClient
      .get("/events")
      .then((res) => setEvents(res.data ?? []))
      .catch(() => alert("Không thể tải sự kiện"))
      .finally(() => setLoading(false));
  };

  const isAdmin = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.role === "admin";
  } catch {
    return false;
  }
};

  const handleOrder = (eventId: string) => {
    navigate(`/order/${eventId}`);
  };

  const handleDelete = async (eventId?: string) => {
  console.log("ID truyền vào:", eventId); // ← Thêm dòng này để xác minh

  if (!eventId || eventId === "undefined") {
    alert("Không tìm thấy ID sự kiện");
    return;
  }

  try {
    const confirmed = window.confirm("Bạn có chắc muốn xoá sự kiện?");
    if (!confirmed) return;

    await axiosClient.delete(`/events/${eventId}`);
    setEvents(events.filter((e) => e.id !== eventId));
  } catch (err: any) {
    console.error("Lỗi khi xoá:", err.response?.data || err.message);
    alert("Xoá sự kiện thất bại");
  }
};


  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Danh sách sự kiện</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        events.map((ev) => (
          <div
            key={ev.id}
            style={{
              position: "relative",
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            {/* Nút Delete */}
            {isAdmin() && (
              <button
              onClick={() => handleDelete(ev.id)} // hoặc ev._id nếu bạn sửa backend
              style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "4px 8px",
              cursor: "pointer",
            }}
            >
            X
            </button>
            )}

            <h3>{ev.name}</h3>
            <p><strong>Thời gian:</strong> {new Date(ev.date).toLocaleString()}</p>
            <p><strong>Địa điểm:</strong> {ev.location}</p>
            <p><strong>Còn lại:</strong> {ev.available_tickets} vé</p>
            <p><strong>Giá vé:</strong> {ev.ticket_price.toLocaleString()} VNĐ</p>
            <p>{ev.description}</p>
            {ev.image_url && (
              <img src={ev.image_url} alt={ev.name} width={200} style={{ borderRadius: 8 }} />
            )}
            <br />
            <button
              onClick={() => handleOrder(ev.id)}
              disabled={ev.available_tickets === 0}
              style={{ marginTop: 10 }}
            >
              Đặt vé
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Events;
