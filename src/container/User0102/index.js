import React, { useState } from "react";
import {
  Typography,
  Paper,
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUser } from "./config"; // đảm bảo đường dẫn đúng

const drawerWidth = 240;

const UserManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const res = await createUser(formData);
    if (res.error || res.message === "Error creating user") {
      setError(res.message || "Lỗi tạo người dùng");
    } else {
      setMessage("✅ Tạo người dùng thành công!");
      setFormData({ name: "", email: "", phone: "" });
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Quản lý nhân viên
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left-side Menu */}
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
          <ListItem button onClick={() => navigate("/user")}>
            <ListItemText primary="Danh sách nhân viên" />
          </ListItem>
          <ListItem button onClick={() => navigate("/user_collect")}>
            <ListItemText primary="Đăng ký" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          mt: 8,
          ml: `${drawerWidth}px`,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 500 }}>
          <Typography variant="h5" gutterBottom>
            Đăng ký người dùng mới
          </Typography>

          {/* Alert messages */}
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
          <TextField
              fullWidth
              label="Mã nhân viên"
              name="id"
              value={formData.id}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Họ tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Gửi
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserManager;
