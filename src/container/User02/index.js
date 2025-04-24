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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { createUser } from './config'; // Giả sử đây là API tạo user

const drawerWidth = 240;
const videoConstraints = {
  width: 400,
  facingMode: "user",
};

const UserInfo = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: "",
    id: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    image: ""
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const captureImage = () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (screenshot) {
      setImagePreview(screenshot);
      setFormData((prev) => ({ ...prev, image: screenshot }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);
    const res = await createUser(formData);
    if (res.error || res.message === "Error creating user") {
      setError(res.message || "❌ Lỗi tạo người dùng");
    } else {
      setMessage("✅ Tạo người dùng thành công!");
      setFormData({
        fullName: "",
        id: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        image: ""
      });
      setImagePreview(null);
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
          <ListItem sx={{ color: 'red' }} button onClick={() => navigate("/user_collect")}>
            <ListItemText primary="Đăng ký" />
          </ListItem>
        </List>
      </Drawer>

      {/* Nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3, mt: 8 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" gutterBottom>
            Thông tin người dùng
          </Typography>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={4}>
            {/* Cột trái: form */}
            <Grid item xs={12} md={6} width={'800px'}>
              <TextField
                label="Mã nhân viên"
                fullWidth
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                label="Họ tên"
                fullWidth
                name="fullName"
                value={formData.fullName}
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Giới tính</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Giới tính"
                >
                  <MenuItem value="0">Nam</MenuItem>
                  <MenuItem value="1">Nữ</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>

            {/* Cột phải: ảnh & webcam */}
            <Grid item xs={12} md={6} width={'500px'} border={'2px'} alignItems={'center'}>
              <Stack spacing={2} alignItems="center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
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

                {imagePreview && (
                  <Button variant="text" color="secondary" onClick={() => {
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}>
                    Chụp lại
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              <Typography>Lưu</Typography>
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UserInfo;
