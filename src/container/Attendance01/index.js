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
  CardContent,
  TextField,
  Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { getAttendanceEvents, getUsers } from "./config";  // Import hàm lấy sự kiện

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
  const navigate = useNavigate();
  const styles = useStyles(); // Sử dụng hàm style
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const users = await getUsers();
      if (!users.error) {
        setUserList(users);
        // Mặc định chọn user đầu tiên
        const defaultUser = users[0];
        setSelectedUser(defaultUser);
        const result = await getAttendanceEvents(defaultUser.id);
        if (!result.error) setEvents(result);
      }
    };
  
    fetchInitialData();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", marginTop: 10 }}>
      {/* AppBar header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" onClick={() => navigate("/")} sx={{ cursor: 'pointer' }} >
          Hệ thống quản lý chấm công
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
            <ListItemText primary="Lịch chấm công" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/collect")}>
            <ListItemText primary="Chấm công" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/added")}>
            <ListItemText primary="Đăng ký khuôn mặt" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/automatic")}>
            <ListItemText primary="Chấm công tự động" />
          </ListItem>
        </List>
      </Drawer>

      {/* Nội dung chính */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2}>
        <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2}>
            <Typography variant="h6">Lịch chấm công</Typography>
            <Autocomplete
              options={userList}
              getOptionLabel={(option) => `${option.id} - ${option.fullName}`}
              value={selectedUser}
              onChange={async (e, newValue) => {
                setSelectedUser(newValue);
                if (newValue) {
                  const result = await getAttendanceEvents(newValue.id);
                  if (!result.error) setEvents(result);
                  else setEvents([]);
                }
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Chọn nhân viên" size="small" />}
            />
          </Box>
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
