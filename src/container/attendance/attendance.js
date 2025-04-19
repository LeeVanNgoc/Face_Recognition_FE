import React from "react";
import { Typography, Paper, Button } from "@mui/material";

const Attendance = () => {
  const handleCheckIn = () => {
    alert("Bạn đã chấm công!");
  };

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5">Chấm công</Typography>
      <Typography>Ngày hôm nay: {new Date().toLocaleDateString()}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleCheckIn}>
        Chấm công
      </Button>
    </Paper>
  );
};

export default Attendance;
