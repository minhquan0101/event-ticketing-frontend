import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

interface Event {
  id: string;
  name: string;
  available_tickets: number;
  ticket_price: number;
}

const OrderForm: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get(`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setQuantity(1);
        setInputValue("1");
      })
      .catch(() => setError("Không tìm thấy sự kiện"));
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setError("");

    if (quantity <= 0) {
      setError("Số lượng vé phải lớn hơn 0");
      return;
    }

    try {
      await axiosClient.post("/tickets/order", {
        event_id: eventId,
        quantity,
      });
      alert("Đặt vé thành công!");
      navigate("/orders");
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Đặt vé thất bại";
      setError(msg);
    }
  };

  if (!event) return <p>Đang tải...</p>;

  if (event.available_tickets === 0) {
    return (
      <div style={{ maxWidth: 500, margin: "30px auto" }}>
        <h2>Đặt vé: {event.name}</h2>
        <p style={{ color: "red" }}>Sự kiện này đã hết vé.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "30px auto" }}>
      <h2>Đặt vé: {event.name}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Số lượng vé:</label>
          <input
            type="number"
            value={inputValue}
            min={1}
            max={event.available_tickets}
            required
            onChange={(e) => {
              let raw = e.target.value;
              raw = raw.replace(/\D/g, "");
              if (raw.length > 1) raw = raw.replace(/^0+/, "");

              const num = Math.min(Number(raw), event.available_tickets);
              setInputValue(raw);
              setQuantity(num || 0);
            }}
          />
        </div>

        {quantity > 0 ? (
          <p>
            Tổng tiền:{" "}
            <strong>{(quantity * event.ticket_price).toLocaleString()} VNĐ</strong>
          </p>
        ) : (
          <p style={{ color: "gray" }}>Vui lòng chọn số lượng vé</p>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={quantity <= 0}>
          Xác nhận đặt vé
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
