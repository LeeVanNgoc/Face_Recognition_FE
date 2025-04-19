// config.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

export async function createUser(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Kiểm tra nếu response có mã trạng thái 2xx
    if (!response.ok) {
      throw new Error(`Lỗi từ server: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    return { error: true, message: error.message }; // Đảm bảo trả lại cấu trúc consistent
  }
}
