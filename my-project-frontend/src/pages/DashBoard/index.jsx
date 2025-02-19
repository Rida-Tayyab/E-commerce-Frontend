import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Modal,
  Paper,
  Drawer,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";

export default function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [paymentDetails, setPaymentDetails] = useState({
    name: user.name,
    email: user.email,
    amount: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:5000/customer/products?`;

        if (search) {
          url += `search=${encodeURIComponent(search)}&`;
        }
        if (category && category !== "All Categories") {
          url += `category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products.");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/customer/categories");
        if (!response.ok) throw new Error("Failed to fetch categories.");
        const data = await response.json();
        setCategories(["All Categories", ...data.map(cat => cat.name)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user._id) return;
      try {
        const response = await fetch(`http://localhost:5000/order?userid=${user._id}`);
        if (!response.ok) throw new Error("Failed to fetch order history.");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (profileOpen) {
      fetchOrders();
    }
  }, [profileOpen]);

  const addToCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("Failed to add product to cart.");

      setCartItems((prevCart) => {
        const existingItem = prevCart.find((item) => item.product._id === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.product._id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { product: { _id: productId }, quantity: 1 }];
        }
      });

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${user._id}`);
      if (!response.ok) {
        throw new Error("Cart is empty");
      }
      const data = await response.json();
      setCartItems(data.products);
      setCartOpen(true);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Your cart is empty.");
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const response = await fetch("http://localhost:5000/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to update cart.");

      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.product._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
        }),
      });

      if (!response.ok) throw new Error("Failed to remove item from cart.");

      setCartItems(cartItems.filter((item) => item.product._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/payment/alfalah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          amount: paymentDetails.amount,
          cardNumber: paymentDetails.cardNumber,
          expiry: paymentDetails.expiry,
          cvv: paymentDetails.cvv,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Payment successful!");
        setCheckoutOpen(false);
        setCartOpen(false);
        navigate("/order-confirmation");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing error. Try again.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" className="min-w-screen" bgcolor="#121212" color="white">
      <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1}}>
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <Button variant="contained" sx={{ bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }}>
              <SearchIcon />
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }} onClick={fetchCart}>
              <ShoppingCartIcon />
            </Button>
            <Button variant="contained" sx={{ bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }} onClick={() => setProfileOpen(true)}>
              <AccountCircleIcon />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box display="flex" flexGrow={1}>
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
            <Typography variant="h6" mb={2}>Categories</Typography>
            <List>
              {categories.map((cat, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => setCategory(cat)} selected={category === cat}>
                    <ListItemText primary={cat} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box flex={1} p={3}>
          <Typography variant="h5" color="white" mb={3} textAlign="left">
            Browse Products
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Grid container spacing={3} justifyContent="flex-start">
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card sx={{ bgcolor: "#1e1e1e", color: "white", borderRadius: 2, minHeight: "250px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <CardContent>
                      {/* <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "contain" }} /> */}
                      <Typography variant="h6" mt={1}>{product.name}</Typography>
                      <Typography variant="body2" color="gray">Rs. {product.price}</Typography>
                      <Typography variant="body2" mt={1} color="lightgray">{product.description}</Typography>
                      <IconButton color="primary" onClick={() => addToCart(product._id)} sx={{ mt: 2 }}>
                        <AddShoppingCartIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <Modal open={cartOpen} onClose={() => setCartOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>Shopping Cart</Typography>

          {cartItems.length > 0 ? (
            <List>
              {cartItems.map((item, index) => (
                <ListItem key={index} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <ListItemText primary={item.product.name} secondary={`Rs. ${item.product.price} x ${item.quantity}`} />

                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      onClick={() => updateCartItemQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography>{item.quantity}</Typography>

                    <IconButton onClick={() => updateCartItemQuantity(item.product._id, item.quantity + 1)}>
                      <AddIcon />
                    </IconButton>

                    <IconButton color="error" onClick={() => removeFromCart(item.product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No items in cart.</Typography>
          )}

          {cartItems.length > 0 && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }}
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout
            </Button>
          )}
        </Paper>
      </Modal>

      <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, p: 3 }}>
          <Typography variant="h6">Profile</Typography>
          <Typography><strong>Name:</strong> {user.name}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>

          <Typography variant="h6" mt={2}>Order History</Typography>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : orders.length > 0 ? (
            <List>
              {orders.map((order, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Order #${order._id}`}
                    secondary={
                      <>
                        <div>Status: {order.status}</div>
                        <div>Product: {order.products.map((product) => product.name).join(", ")}</div>
                        <div>Total: Rs. {order.totalAmount} - {new Date(order.createdAt).toLocaleDateString()}</div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No orders found.</Typography>
          )}

          <Button variant="contained" onClick={() => setProfileOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Paper>
      </Modal>

      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)}>
        <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, p: 3 }}>
          <Typography variant="h6">Checkout</Typography>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={paymentDetails.name}
            disabled
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={paymentDetails.email}
            disabled
          />

          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            value={`Rs. ${paymentDetails.amount}`}
            disabled
          />

          <TextField
            label="Card Number"
            fullWidth
            margin="normal"
            type="text"
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
          />

          <TextField
            label="Expiry (MM/YY)"
            fullWidth
            margin="normal"
            type="text"
            value={paymentDetails.expiry}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
          />

          <TextField
            label="CVV"
            fullWidth
            margin="normal"
            type="password"
            value={paymentDetails.cvv}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }}
            onClick={handlePayment}
          >
            Confirm Payment
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
}