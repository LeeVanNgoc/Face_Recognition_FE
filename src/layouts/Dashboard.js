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

const Dashboard = () => {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
