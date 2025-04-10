import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Drawer,
  Modal,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";



export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("Order");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "", stock: "", image: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [store, setStore] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("store");
    console.log("Store:", stored);
    if (stored) {
      try {
        setStore(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid store data:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (store?._id) {
      fetchData();
    }
    fetchCategories();
  }, [activeTab, store]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/store/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    if (!store?._id) return; // Wait until store is loaded

    setLoading(true);
    setError(null);
    console.log(store._id)

    const urlMap = {
      "Order": `http://localhost:5000/order/store/${store._id}`,
      "Products": `http://localhost:5000/store/products/store/${store._id}`,
      "Categories": "http://localhost:5000/store/categories"
    };

    try {
      const response = await fetch(urlMap[activeTab], {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error(`Failed to fetch ${activeTab}`);
      const data = await response.json();

      console.log("Data:", data);
      if (activeTab === "Order") setOrders(data.orders);
      else if (activeTab === "Products") setProducts(data);
      else setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id,storeId, newStatus) => {
    try {
      console.log("Updating order status:", id, newStatus);
      const response = await fetch(`http://localhost:5000/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus,storeId}),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSave = async () => {
    const urlMap = {
      "Products": "http://localhost:5000/store/products",
      "Categories": "http://localhost:5000/store/categories"
    };

    const url = urlMap[activeTab];
    if (!url) return;

    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode ? `${url}/${selectedId}` : url;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      console.log(response.cookies);

      if (!response.ok) throw new Error(`Failed to ${editMode ? "update" : "add"} ${activeTab}`);

      fetchData();
      setOpenDialog(false);
      setEditMode(false);
      setFormData({ name: "", description: "", price: "", category: "", stock: "", image: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditMode(true);
    setSelectedId(item._id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    const urlMap = {
      "Products": `http://localhost:5000/store/products/${id}`,
      "Categories": `http://localhost:5000/store/categories/${id}`
    };

    if (!urlMap[activeTab]) return;

    try {
      const response = await fetch(urlMap[activeTab], { method: "DELETE" });

      if (!response.ok) throw new Error(`Failed to delete ${activeTab}`);

      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#121212" color="white">
      {/* AppBar */}
      <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {activeTab !== "Order" && (
            <Button startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ color: "#77B0AA" }}>
              Add {activeTab}
            </Button>
          )}
          {store?.logoUrl && (
            <IconButton onClick={() => setProfileOpen(true)} sx={{ p: 0 }}>
              <Box
                component="img"
                src={store.logoUrl}
                alt="Profile"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #77B0AA",
                }}
              />
            </IconButton>
          )}

        </Toolbar>
      </AppBar>

      {/* Sidebar and Main Content */}
      <Box display="flex" flexGrow={1}>
        {/* Sidebar */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            width: 250,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 250,
              boxSizing: "border-box",
              bgcolor: "#1e1e1e",
              color: "white",
            },
          }}
        >
          <Toolbar />
          <Box p={2}>
            <Typography variant="h6" mb={2}>Admin Panel</Typography>
            <List>
              {["Order", "Products", "Categories"].map((tab) => (
                <ListItem key={tab} disablePadding>
                  <ListItemButton onClick={() => { setActiveTab(tab); if (isMobile) setSidebarOpen(false); }}>
                    <ListItemText primary={tab} sx={{ color: activeTab === tab ? "#77B0AA" : "white" }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box flex={1} p={3}>
          <Typography variant="h5" mb={3} textAlign="center">
            {activeTab}
          </Typography>

          {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
            <Grid container spacing={3} flexGrow={1}>
              {activeTab === "Order" && orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order.orderId + order.storeId}>
                  <Card sx={{ bgcolor: "#1e1e1e", color: "white", p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">Order #{order.orderId}</Typography>
                      <Typography variant="body2">Store ID: {order.storeId}</Typography>
                      <Typography variant="body2">Status: {order.storeStatus}</Typography>
                      <Typography variant="body2">Payment: Rs. {order.paymentAmount}</Typography>
                      <Typography variant="body2">Updated At: {new Date(order.updatedAt).toLocaleString()}</Typography>

                      <Select
                        value={order.storeStatus}
                        onChange={(e) => updateOrderStatus(order.orderId, order.storeId, e.target.value)}
                        fullWidth
                        sx={{ mt: 2, color: "white", border: "1px solid white" }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                      </Select>
                    </CardContent>
                  </Card>
                </Grid>
              ))}


              {activeTab === "Products" && products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ bgcolor: "#1e1e1e", color: "white", p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2">{product.description}</Typography>
                      <Typography variant="body2">Rs. {product.price}</Typography>
                      <Typography variant="body2">Category: {product.category}</Typography>
                      <Button startIcon={<EditIcon />} sx={{ color: "#77B0AA" }} onClick={() => handleEdit(product)}>Edit</Button>
                      <Button startIcon={<DeleteIcon />} sx={{ color: "red" }} onClick={() => handleDelete(product._id)}>Delete</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {activeTab === "Categories" && categories.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category._id}>
                  <Card sx={{ bgcolor: "#1e1e1e", color: "white", p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{category.name}</Typography>
                      <Button startIcon={<DeleteIcon />} sx={{ color: "red" }} onClick={() => handleDelete(category._id)}>Delete</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editMode ? `Edit ${activeTab}` : `Add ${activeTab}`}</DialogTitle>
        <DialogContent>
          {activeTab === "Categories" ? (
            <TextField label="Category Name" fullWidth margin="dense" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          ) : (
            <>
              <TextField label="Name" fullWidth margin="dense" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <TextField label="Price" fullWidth margin="dense" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              <TextField label="Stock" fullWidth margin="dense" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              <Select fullWidth value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} displayEmpty >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {categories.map((category) => <MenuItem key={category._id} value={category.name}>{category.name}</MenuItem>)}
              </Select>
              <TextField label="Description" fullWidth margin="dense" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <TextField label="Image URL" fullWidth margin="dense" value={formData.imageURL} onChange={(e) => setFormData({ ...formData, imageURL: e.target.value })} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} sx={{ color: "#77B0AA" }}>Save</Button>
        </DialogActions>
      </Dialog>
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, p: 3 }}>
          <Typography variant="h6">Profile</Typography>
          {!store || !store._id ? (
            <Typography>Unauthorized. Please log in as a store.</Typography>
          ) : (
            <>
              {store && (
                <>
                  <Typography><strong>Store Name:</strong> {store.ownerName}</Typography>
                  <Typography><strong>Owner Email:</strong> {store.ownerEmail}</Typography>
                </>
              )}

            </>
          )}

          <Button variant="contained" onClick={() => setProfileOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Paper>
      </Modal>
    </Box>
  );
}