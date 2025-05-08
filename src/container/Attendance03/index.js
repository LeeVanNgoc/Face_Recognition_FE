import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Stack,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  AppBar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function WebcamCapture() {
  const navigate = useNavigate();
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => {
          setErrorMessage("Không thể truy cập webcam.");
          console.error("Webcam error:", err);
        });
    } else {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    }

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const captureAndEnroll = async () => {
    try {
      if (!id.trim()) {
        setErrorMessage("Bạn cần nhập mã nhân viên để đăng ký.");
        return;
      }

      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      const formData = new FormData();
      formData.append("image", blob, "face.jpg");
      formData.append("name", id);

      const res = await fetch("http://localhost:5001/api/enroll", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Lỗi server: ${res.statusText}`);
      }

      const data = await res.json();
      setErrorMessage("");
      alert("🟢 Đã đăng ký thành công!");
    } catch (error) {
      setErrorMessage("Lỗi khi gửi dữ liệu đến server.");
      console.error("Enroll error:", error);
    }
  };

  const handleStartStop = () => {
    if (!isRecording) {
      toggleRecording();
    } else {
      captureAndEnroll();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
        <Box
            component="img"
            src="/src/layouts/LogoNgocHuy.png" // 👉 thay bằng đường dẫn hoặc URL logo của bạn
            alt="Logo"
            sx={{ height: 32, width: 32, marginRight: 1 }}
          />
          <Typography variant="h6" noWrap onClick={() => navigate("/")} sx={{ cursor: 'pointer' }} >
          Hệ thống quản lý chấm công
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer menu */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button  onClick={() => navigate("/attendance")}>
            <ListItemText primary="Lịch chấm công" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/collect")}>
            <ListItemText primary="Chấm công" />
          </ListItem>
          <ListItem button style={{color: 'red'}} onClick={() => navigate("/attendance/added")}>
            <ListItemText primary="Đăng ký khuôn mặt" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 720, mx: "auto" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h5" align="center" fontWeight={600}>
              Đăng Ký Khuôn Mặt Mới
            </Typography>
            <Typography variant="body2" align="center">
              Nhập mã nhân viên và chụp ảnh từ webcam để thêm vào hệ thống nhận diện.
            </Typography>

            <Box
              component="video"
              ref={videoRef}
              sx={{
                width: "100%",
                maxWidth: 640,
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            <TextField
              fullWidth
              label="Mã nhân viên"
              value={id}
              onChange={(e) => setId(e.target.value)}
              sx={{ maxWidth: 300 }}
            />

            <Button
              variant="contained"
              color={isRecording ? "success" : "primary"}
              onClick={handleStartStop}
              sx={{ width: 220 }}
            >
              {isRecording ? "Chụp & Đăng Ký" : "Bật Webcam"}
            </Button>

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Alert>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
