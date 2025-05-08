import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Stack,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Toolbar,
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }).catch(err => {
        setErrorMessage("Không thể truy cập webcam.");
        console.error("Webcam error:", err);
      });
    } else {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(prev => !prev);
  };

  const captureAndSend = async () => {
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL("image/jpeg");

      const res = await fetch("http://localhost:5001/api/recognize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) throw new Error(`Lỗi server: ${res.statusText}`);

      const data = await res.json();
      setErrorMessage("");
      setUserData(data.name !== "Unknown" ? data : null);
    } catch (error) {
      setUserData(null);
      setErrorMessage("Lỗi khi gửi ảnh tới server.");
      console.error("Error in captureAndSend:", error);
    }
  };

  const handleStartStop = () => {
    if (!isRecording) {
      toggleRecording();
    } else {
      captureAndSend();
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap onClick={() => navigate("/")} sx={{ cursor: 'pointer' }} >
            Hệ thống quản lý chấm công
          </Typography>
        </Toolbar>
      </AppBar>

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
          <ListItem button onClick={() => navigate("/attendance")}>
            <ListItemText primary="Lịch chấm công" />
          </ListItem>
          <ListItem button sx={{ color: 'red' }} onClick={() => navigate("/attendance/collect")}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} >
            <Paper sx={{ p: 3, borderRadius: 2, width: 600 }}>
              <Typography variant="h6" gutterBottom>
                Webcam (Nhận diện)
              </Typography>
              <Box
                component="video"
                ref={videoRef}
                sx={{
                  width: "100%",
                  height: 450,
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 2,
                  backgroundColor: "#eee"
                }}
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <Button
                variant="contained"
                color={isRecording ? "success" : "primary"}
                onClick={handleStartStop}
                fullWidth
              >
                {isRecording ? "Chụp & Nhận Diện" : "Bật Webcam"}
              </Button>
              {errorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, width: 600 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin người dùng
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2} alignItems="center">
                {userData?.user?.image ? (
                  <Box
                    component="img"
                    src={userData.user.image}
                    alt="Ảnh người dùng"
                    sx={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", boxShadow: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: "#666",
                      boxShadow: 2,
                    }}
                  >
                    No Image
                  </Box>
                )}

                <List sx={{ width: '100%' }}>
                  <ListItem>
                    <ListItemText primary="Tên" secondary={userData?.user?.fullName || "—"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Email" secondary={userData?.user?.email || "—"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Số điện thoại" secondary={userData?.user?.phone || "—"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Địa chỉ" secondary={userData?.user?.address || "—"} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Giới tính"
                      secondary={
                        userData?.user?.gender === "0"
                          ? "Nam"
                          : userData?.user?.gender === "1"
                          ? "Nữ"
                          : "Không rõ"
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Thời gian chấm công"
                      secondary={userData ? new Date().toLocaleString() : "—"}
                    />
                  </ListItem>
                </List>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
