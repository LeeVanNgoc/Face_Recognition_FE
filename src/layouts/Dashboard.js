import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { Person, AccessTime } from "@mui/icons-material";
import logo from './logo_transparent.png';


const Dashboard = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: '#93e1fe'  }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Grid item>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: 240, // điều chỉnh kích thước logo
              mb: 2,
            }}
          />
        </Grid>
        <Grid container marginBottom={10} justifyContent="center" direction="column">
          <Grid item>
            <Typography style={{ textAlign: 'center', fontSize: '32px', textTransform: "uppercase", fontWeight: "bold"}}>
              Hệ thống quản lý y khoa
            </Typography>
          </Grid>
          <Grid item>
            <Typography style={{ textAlign: 'center', fontSize: '16px'}}>
              Vui lòng chọn module tương ứng
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Card sx={{ width: 250 }}>
              <CardActionArea component={Link} to="/user">
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Person sx={{ fontSize: 50, mb: 1 }} />
                  <Typography variant="h6" align="center">
                    Quản lý nhân viên
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ width: 250 }}>
              <CardActionArea component={Link} to="/attendance">
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <AccessTime sx={{ fontSize: 50, mb: 1 }} />
                  <Typography variant="h6" align="center">
                    Quản lý chấm công
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
