import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface Order {
  order_id: string;
  event_name: string;
  quantity: number;
  ticket_price: number;
  total_price: number;
  status: string;
  event_date: string;
  purchase_time: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch((err) =>
        setError(err?.response?.data?.error || "Không thể tải đơn hàng")
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "30px auto" }}>
      <h2>Đơn hàng đã đặt</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orders.map((order) => (
        <div
          key={order.order_id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{order.event_name}</h3>
          <p><strong>Số vé:</strong> {order.quantity}</p>
          <p><strong>Giá vé:</strong> {order.ticket_price.toLocaleString()} VNĐ</p>
          <p><strong>Tổng tiền:</strong> {order.total_price.toLocaleString()} VNĐ</p>
          <p><strong>Ngày tổ chức:</strong> {order.event_date}</p>
          <p><strong>Thời gian mua:</strong> {order.purchase_time}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
