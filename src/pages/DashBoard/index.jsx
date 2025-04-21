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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Avatar,
  Rating,
  Divider,
  TextareaAutosize,
  Chip,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import OrderIcon from "@mui/icons-material/ShoppingBasket";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";


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
  const [orderOpen, setorderOpen] = useState(false);
  const [userorderOpen, setuserorderOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState("cod");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [productDetailsOpen, setProductDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
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
    console.log("User:", user);
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
        console.log("Response:", response);
        if (!response.ok) throw new Error("Failed to fetch products.");
        const data = await response.json();
        console.log("Products:", data);
        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    fetchOrders();
  }, [category, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/customer/categories");
        console.log("Categories Response:", response);
        if (!response.ok) throw new Error("Failed to fetch categories.");
        const data = await response.json();
        setCategories(["All Categories", ...data.map(cat => cat.name)]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);


  const fetchOrders = async () => {
    if (!user._id) return;
    try {
      const response = await fetch(`http://localhost:5000/order/user/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch order history.");
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
  const placeOrder = async () => {
    try {
      const response = await fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, shippingAddress, paymentOption }),
      });

      if (!response.ok) throw new Error("Can't place Order");
      else {
        alert("Order placed");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error", error.message);
      alert("Failed to place order");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'An error occurred while deleting the order.');
      } else {
        alert(data.message || 'Order deleted successfully.');
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("There was an error processing your request. Please try again.");
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
  const fetchProductDetails = async (productId) => {
    try {
      setLoading(true);
      const [productResponse, reviewsResponse] = await Promise.all([
        fetch(`http://localhost:5000/product/${productId}`),
        fetch(`http://localhost:5000/reviews?product=${productId}`)
      ]);

      if (!productResponse.ok) throw new Error("Failed to fetch product details.");
      if (!reviewsResponse.ok) throw new Error("Failed to fetch reviews.");

      const productData = await productResponse.json();
      const reviewsData = await reviewsResponse.json();

      setSelectedProduct(productData);
      setReviews(reviewsData);
      setProductDetailsOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleReviewSubmit = async (productId) => {
  //   try {
  //     if (!reviewRating || !reviewText) {
  //       throw new Error("Please provide both a rating and review text");
  //     }
  //     const authToken = localStorage.getItem('token');
  //     if (!authToken) {
  //       throw new Error("User not authenticated. Please log in.");
  //     }
  
  //     const response = await fetch('http://localhost:5000/customer/review', {
  //       method: "POST",
  //       // credentials: 'include', // This is crucial for cookies
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${authToken}` // Add the auth token to headers
  //       },
  //       body: JSON.stringify({
  //         product: productId,
  //         rating: reviewRating,
  //         review: reviewText
  //       })
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to submit review.");
  //     }
  
  //     const data = await response.json();
  //     alert("Review submitted successfully!");
  //     setReviewText("");
  //     setReviewRating(0);
  //     fetchProductDetails(productId);
      
  //     return data;
  //   } catch (error) {
  //     console.error("Error submitting review:", error);
  //     alert(error.message);
  //     throw error;
  //   }
  // };

  const handleReviewSubmit = async (productId) => {
    try {
      if (!reviewRating || !reviewText) {
        throw new Error("Please provide both a rating and review text");
      }
      const response = await fetch('http://localhost:5000/customer/review', {
        method: "POST",
        credentials: 'include', // Keep this for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productId,
          rating: reviewRating,
          review: reviewText
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review.");
      }
  
      const data = await response.json();
      alert("Review submitted successfully!");
      setReviewText("");
      setReviewRating(0);
      fetchProductDetails(productId);
      
      return data;
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.message);
      throw error;
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
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {user?.name ? `Welcome, ${user.name}` : "Customer Dashboard"}
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
            <Button variant="contained" sx={{ bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }} onClick={() => setuserorderOpen(true)}>
              <OrderIcon />
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
                  <Card
                    sx=
                    {{ bgcolor: "#1e1e1e", color: "white", borderRadius: 2, minHeight: "250px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                    onClick={() => fetchProductDetails(product._id)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "contain" }} />
                      <div>
                      <Typography variant="h6" mt={1}>{product.name}</Typography>
                      <Typography variant="body2" color="gray">Rs. {product.price}</Typography>
                      <Typography variant="body2" mt={1} color="lightgray">{product.description}</Typography>
                      <IconButton color="primary" onClick={() => addToCart(product._id)} sx={{ mt: 2 }}>
                        <AddShoppingCartIcon />
                      </IconButton>
                      </div>
                      <div>
                      <Button variant="contained" sx={{ width:"100%", bgcolor: "primary", "&:hover": { bgcolor: "#135D66" }, mt: 1 }} onClick={() => setProductDetailsOpen(true)}>
                        Details
                      </Button>
                      </div> */}

                      <Typography variant="h6" gutterBottom sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {product.name}
                      </Typography>

                      <Typography variant="body2" color="gray" sx={{ paddingBottom: "10px" }}>Rs. {product.price}</Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating
                          value={product.rating || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                          color="gray"
                          emptyIcon={
                            <StarBorderIcon fontSize="inherit" sx={{ color: 'gray' }} />
                          }
                        />
                        <Typography variant="caption" ml={1} color="white">
                          ({product.reviewCount || 0})
                        </Typography>
                      </Box>

                      {product.category && (
                        <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            bgcolor: "#135D66",
                            color: "white",
                            mb: 1
                          }}
                        />
                      )}

                      <Typography
                        variant="body2"
                        color="gray"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mb: 2
                        }}
                      >
                        {product.description}
                      </Typography>
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
              onClick={() => setorderOpen(true)}
            >
              Proceed to place order
            </Button>
          )}
        </Paper>
      </Modal>

      <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, p: 3, overflowY: "auto", maxHeight: "80vh" }}>
          <Typography variant="h6">Profile</Typography>
          <Typography><strong>Name:</strong> {user.name}</Typography>
          <Typography><strong>Email:</strong> {user.email}</Typography>
          <Button variant="contained" onClick={() => setProfileOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Paper>
      </Modal>

      <Modal open={productDetailsOpen} onClose={() => setProductDetailsOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : "60%",
            maxHeight: "90vh",
            overflowY: "auto",
            p: 3,
            bgcolor: "#1e1e1e",
            color: "#b0b0b0",
          }}
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setProductDetailsOpen(false)}>
              <CloseIcon sx={{ color: "#b0b0b0" }} />
            </IconButton>
          </Box>

          {selectedProduct && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "300px",
                      bgcolor: "#2d2d2d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    {selectedProduct.image ? (
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }}
                      />
                    ) : (
                      <Typography>No Image Available</Typography>
                    )}
                  </Box>

                  {/* Store Info */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      bgcolor: "#2d2d2d",
                      borderRadius: 2
                    }}
                  >
                    <Avatar
                      src={selectedProduct.store?.logoUrl}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        Sold by: {selectedProduct.store?.businessName || "Unknown Store"}
                      </Typography>
                      <Rating
                        value={selectedProduct.store?.rating || 0}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h4" gutterBottom>{selectedProduct.name}</Typography>
                  <Typography variant="h5" color="#77B0AA" gutterBottom>
                    Rs. {selectedProduct.price}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating
                      value={selectedProduct.rating || 0}
                      precision={0.5}
                      readOnly
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Typography variant="body2" ml={1}>
                      {selectedProduct.rating?.toFixed(1) || "0.0"} ({selectedProduct.reviewCount || 0} reviews)
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {selectedProduct.description}
                  </Typography>

                  <Box mt={3}>
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => {
                        addToCart(selectedProduct._id);
                        setProductDetailsOpen(false);
                      }}
                      sx={{ bgcolor: "#77B0AA", "&:hover": { bgcolor: "#135D66" } }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Reviews Section */}
              <Box mt={4}>
                <Typography variant="h5" gutterBottom color="#b0b0b0">
                  Customer Reviews
                </Typography>
                <Divider sx={{ bgcolor: "#444", mb: 3 }} />

                {/* Review Form */}
                {user && (
                  <Box mb={4} p={2} sx={{ bgcolor: "#2d2d2d", borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="#b0b0b0">
                      Write a Review
                    </Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(event, newValue) => setReviewRating(newValue)}
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Share your thoughts about this product..."
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "12px",
                        backgroundColor: "#1e1e1e",
                        color: "#b0b0b0",
                        border: "1px solid #444",
                        borderRadius: "4px"
                      }}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleReviewSubmit(selectedProduct._id)}
                      disabled={!reviewRating || !reviewText}
                      sx={{
                        mt: 2,
                        bgcolor: "#77B0AA",
                        "&:hover": { bgcolor: "#135D66" },
                        color: "white"
                      }}
                    >
                      Submit Review
                    </Button>
                  </Box>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <List>
                    {reviews.map((review, index) => (
                      <ListItem key={index} sx={{ mb: 2, bgcolor: "#2d2d2d", borderRadius: 2 }}>
                        <Box width="100%">
                          <Box display="flex" alignItems="center" mb={1}>
                            <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
                            <Box>
                              <Typography variant="subtitle1">{review.user?.name || "Anonymous"}</Typography>
                              <Rating
                                value={review.rating}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body1" mt={1}>
                            {review.review}
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No reviews yet. Be the first to review!
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Modal>

      <Modal open={userorderOpen} onClose={() => setuserorderOpen(false)}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            p: 3,
            overflowY: "auto",
            maxHeight: "80vh",
          }}
        >
          <Typography variant="h6" gutterBottom>Orders</Typography>
          {orders.length > 0 ? (
            <List>
              {orders.map((order, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderBottom: "1px solid #ccc",
                    mb: 1,
                    pb: 1,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <div>
                      <Typography fontWeight="bold">Order ID: {order.orderDetails.orderId}</Typography>
                      <Typography>Status: {order.orderDetails.status}</Typography>
                      <Typography>Shipping Address: {order.orderDetails.shippingAddress}</Typography>
                      <Typography>Placed On: {new Date(order.orderDetails.createdAt).toLocaleString()}</Typography>
                      <Typography>Last Updated: {new Date(order.orderDetails.updatedAt).toLocaleString()}</Typography>
                      <Typography>Payment Method: {order.orderDetails.paymentMethod}</Typography>

                      {/* Check if cart exists and display product details */}
                      {order.cart && order.cart.products && order.cart.products.length > 0 && (
                        <div style={{ marginTop: "10px" }}>
                          <Typography variant="subtitle2">Products in Cart:</Typography>
                          {order.cart.products.map((product, productIndex) => (
                            <Typography key={productIndex}>
                              Product Name: {product.name} - Quantity: {product.quantity} - Total: {product.total}
                            </Typography>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <IconButton color="error" onClick={() => deleteOrder(order.orderDetails.orderId)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </Box>
                </ListItem>
              ))}

            </List>
          ) : (
            <Typography>No orders found.</Typography>
          )}

          <Button
            variant="contained"
            onClick={() => setuserorderOpen(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Paper>
      </Modal>

      <Modal open={orderOpen} onClose={() => setorderOpen(false)}>
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
          <Typography variant="h6">Order Details</Typography>

          <TextField
            label="Shipping Address"
            fullWidth
            margin="normal"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Payment Option</FormLabel>
            <RadioGroup
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
            >
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
              <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            onClick={placeOrder}
            fullWidth
            sx={{ mt: 3 }}
          >
            Place Order
          </Button>

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