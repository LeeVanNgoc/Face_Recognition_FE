// config.js

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Hàm lấy danh sách các sự kiện (các ngày) từ API
// export async function getAttendanceEvents(userId) {
//   try {
//     // Thêm userId vào URL để lọc sự kiện theo người dùng
//     const response = await fetch(`${API_BASE_URL}/api/attendance/${userId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Lỗi từ server: ${response.status}`);
//     }

//     const result = await response.json();
//     // Chuyển timeCheck về format YYYY-MM-DD cho FullCalendar
//     return result
//       .map(event => {
//         const parsed = new Date(event.timeAtten);
//         if (isNaN(parsed.getTime())) {
//           return null;
//         }
//         return {
//           title: "Đã chấm công",
//           date: parsed.toISOString().split("T")[0],
//         };
//       })
//       .filter(Boolean);
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách sự kiện:", error);
//     return { error: true, message: error.message };
//   }
// }

export async function getAttendanceEvents(userId) {
  try {
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

    // Gom các bản ghi theo ngày
    const dayMap = new Map();

    result.forEach(event => {
      const date = new Date(event.timeAtten);
      if (isNaN(date.getTime())) return;

      const dayKey = date.toISOString().split("T")[0];

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, { earliest: date, latest: date });
      } else {
        const current = dayMap.get(dayKey);
        if (date < current.earliest) current.earliest = date;
        if (date > current.latest) current.latest = date;
        dayMap.set(dayKey, current);
      }
    });

    // Chuyển sang mảng sự kiện
    return Array.from(dayMap.entries()).map(([date, { earliest, latest }]) => ({
      title: `In: ${earliest.toLocaleTimeString("vi-VN")} - Out: ${latest.toLocaleTimeString("vi-VN")}`,
      date,
    }));

  } catch (error) {
    console.error("Lỗi khi lấy danh sách sự kiện:", error);
    return { error: true, message: error.message };
  }
}

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
