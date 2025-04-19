import React, { useState, useRef } from "react";
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
  Grid,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const videoConstraints = {
  width: 400,
  facingMode: "user",
};

const UserInfo = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
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

      {/* Menu bên trái */}
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

      {/* Nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          mt: 8,
        }}
      >
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Thông tin người dùng
          </Typography>

          <Grid container spacing={4}>
            {/* Cột trái: form */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Họ tên"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Chức vụ"
                fullWidth
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>

            {/* Cột phải: ảnh và webcam */}
            <Grid item xs={12} md={6} textAlign="center">
              <Stack spacing={2} alignItems="center">
                {image ? (
                  <img
                    src={image}
                    alt="Ảnh người dùng"
                    style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
                  />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: "100%", maxHeight: 300 }}
                  />
                )}
                <Button variant="outlined" onClick={captureImage}>
                  Chụp ảnh từ webcam
                </Button>
                <Button variant="contained" component="label">
                  Tải ảnh lên
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
                {image && (
                  <Button variant="text" onClick={() => setImage(null)}>
                    Chụp lại
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserInfo;
