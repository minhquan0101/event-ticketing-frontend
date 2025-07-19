import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(searchKeyword);

    const socket = io("https://event-ticketing-backend-pi71.onrender.com", {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("event_created", (data) => {
      console.log("📢 Event created:", data);
      setEvents((prev) => [data.event, ...prev]);
    });

    socket.on("event_updated", (data) => {
      console.log("✏️ Event updated:", data);
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === data.event_id ? { ...ev, ...data.event } : ev
        )
      );
    });

    socket.on("event_deleted", (data) => {
      console.log("🗑️ Event deleted:", data);
      setEvents((prev) => prev.filter((ev) => ev.id !== data.event_id));
    });

    return () => {
      socket.disconnect();
    };
  }, [searchKeyword]);

  const fetchEvents = (keyword: string = "") => {
    setLoading(true);
    axiosClient
      .get("/events", {
        params: { keyword },
      })
      .then((res) => {
        console.log("🔥 API /events response:", res.data);
        setEvents(res.data ?? []);
      })
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
    console.log("🟠 ID truyền vào handleDelete:", eventId);
    if (!eventId || eventId === "undefined") {
      alert("Không tìm thấy ID sự kiện");
      return;
    }

    try {
      const confirmed = window.confirm("Bạn có chắc muốn xoá sự kiện?");
      if (!confirmed) return;

      await axiosClient.delete(`/events/${eventId}`);
      setEvents((events) => events.filter((e) => e.id !== eventId));
    } catch (err: any) {
      console.error("Lỗi khi xoá:", err.response?.data || err.message);
      alert("Xoá sự kiện thất bại");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Danh sách sự kiện</h2>

      <input
        type="text"
        placeholder="Tìm kiếm theo tên sự kiện..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          marginBottom: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      {loading ? (
        <p>Đang tải...</p>
      ) : events.length === 0 ? (
        <p>Không tìm thấy sự kiện nào.</p>
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
            {isAdmin() && (
              <button
                onClick={() => handleDelete(ev.id)}
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
            <p>
              <strong>Thời gian:</strong>{" "}
              {new Date(ev.date).toLocaleString()}
            </p>
            <p>
              <strong>Địa điểm:</strong> {ev.location}
            </p>
            <p>
              <strong>Còn lại:</strong> {ev.available_tickets} vé
            </p>
            <p>
              <strong>Giá vé:</strong> {ev.ticket_price.toLocaleString()} VNĐ
            </p>
            <p>{ev.description}</p>
            {ev.image_url && (
              <img
                src={`https://event-ticketing-backend-pi71.onrender.com${ev.image_url}`}
                alt={ev.name}
                width={200}
                style={{ borderRadius: 8 }}
              />
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
