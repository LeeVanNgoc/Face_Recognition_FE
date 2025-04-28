// config.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Hàm lấy danh sách các sự kiện (các ngày) từ API
export async function getAttendanceEvents(userId) {
  try {
    // Thêm userId vào URL để lọc sự kiện theo người dùng
    const response = await fetch(`${API_BASE_URL}/api/attendance/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Lỗi từ server: ${response.status}`);
    }

    const result = await response.json();
    
    // Chuyển timeCheck về format YYYY-MM-DD cho FullCalendar
    return result.map(event => ({
      title: 'Ngày chấm công',
      date: new Date(event.timeCheck).toISOString().split('T')[0], // 👈 CHỖ NÀY
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sự kiện:", error);
    return { error: true, message: error.message };
  }
}
