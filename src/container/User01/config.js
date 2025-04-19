// config.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Hàm lấy danh sách người dùng
export async function getUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Kiểm tra nếu response có mã trạng thái 2xx
    if (!response.ok) {
      throw new Error(`Lỗi từ server: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return { error: true, message: error.message }; // Đảm bảo trả lại cấu trúc consistent
  }
}
