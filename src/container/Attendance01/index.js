import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// import '@fullcalendar/common/main.css';
// import '@fullcalendar/daygrid/main.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getAttendanceEvents } from "./config";  // Import hàm lấy sự kiện

// Định nghĩa hàm style ngoài
const useStyles = () => ({
  fullCalendarBody: {
    maxHeight: "calc(100vh - 100px)", // Điều chỉnh chiều cao để chỉ hiển thị tối đa 5 hàng
  },
  dayGridDay: {
    height: "calc(100vh / 5)", // Giới hạn chiều cao mỗi ô ngày, tương đương với 5 hàng
  },
});

const drawerWidth = 240;

const Calendar = () => {
  const [events, setEvents] = useState([]); // Lưu trữ sự kiện lấy từ API
  const navigate = useNavigate();
  const styles = useStyles(); // Sử dụng hàm style

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await getAttendanceEvents("user1"); // Thay userId là 'user1'
      console.log('boss', result);
      if (!result.error) {
        setEvents(result); // Cập nhật state với các sự kiện từ API
      } else {
        console.error(result.message);
      }
    };

    fetchEvents();
  }, []);

  console.log(events)
  return (
    <Box sx={{ display: "flex", height: "100vh", marginTop: 10 }}>
      {/* AppBar header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Quản lý Lịch
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer menu bên trái */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button style={{color: 'red'}} onClick={() => navigate("/attendance")}>
            <ListItemText primary="Lịch làm việc" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/collect")}>
            <ListItemText primary="Chấm công" />
          </ListItem>
          <ListItem button onClick={() => navigate("/user_collect")}>
            <ListItemText primary="Đơn từ" />
          </ListItem>
        </List>
      </Drawer>

      {/* Nội dung chính */}
      <Box sx={{ padding: 3, flexGrow: 1 }}>
        <Card>
          <CardHeader title="Lịch làm việc toàn công ty" />
          <CardContent>
            <FullCalendar
              initialView="dayGridMonth"
              plugins={[dayGridPlugin]}
              events={events} // Hiển thị các sự kiện từ API
              height="auto"
              sx={{
                ".fc-daygrid-day": styles.dayGridDay, // Áp dụng style cho các ô ngày
                ".fc-daygrid-body": styles.fullCalendarBody, // Áp dụng style cho body của lịch
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Calendar;
