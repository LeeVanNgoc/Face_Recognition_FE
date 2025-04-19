import React, { useState, useEffect } from "react";
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
  Alert,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUsers } from "./config"; // Đảm bảo đường dẫn đúng
import AddIcon from "@mui/icons-material/Add"; // Biểu tượng thêm người dùng

const drawerWidth = 240;

const UserManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      console.log('Boss', res);

      if (res.error) {
        setError(res.message || "Lỗi khi tải danh sách người dùng");
      } else {
        setUsers(res || []);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      <Box sx={{ padding: 3, flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          Danh sách người dùng
        </Typography>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Card chứa bảng người dùng */}
        <Card sx={{ width: "100%" }}>
          <CardHeader
            title="Danh sách người dùng"
            action={
              <IconButton
                onClick={() => navigate("/user_add")}
                color="primary"
                sx={{ marginTop: -1 }}
              >
                <AddIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UserManager;
