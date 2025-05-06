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
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Hệ thống nhận diện khuôn mặt
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
          <ListItem button onClick={() => navigate("/attendance")}>
            <ListItemText primary="Lịch làm việc" />
          </ListItem>
          <ListItem button sx={{ color: 'red' }} onClick={() => navigate("/attendance/collect")}>
            <ListItemText primary="Chấm công" />
          </ListItem>
          <ListItem button onClick={() => navigate("/attendance/added")}>
            <ListItemText primary="Đơn từ" />
          </ListItem>
        </List>
      </Drawer>

      {/* Nội dung chính */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Grid container spacing={4}>
          {/* Webcam */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Webcam (Nhận diện)
              </Typography>
              <Box
                component="video"
                ref={videoRef}
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 2,
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

          {/* Thông tin người dùng */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, minHeight: 400 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin người dùng
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {userData ? (
                <List>
                  <ListItem>
                    <ListItemText primary="Tên" secondary={userData.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Chỉ số tương đồng"
                      secondary={userData.similarity?.toFixed(3) || "Không rõ"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Thời gian"
                      secondary={new Date().toLocaleString()}
                    />
                  </ListItem>
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Không có thông tin người dùng nào được nhận diện.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
