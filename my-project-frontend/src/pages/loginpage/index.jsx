import { useState } from "react";
import { 
  Card, CardContent, Typography, TextField, Button, 
  Box, CircularProgress, Alert, useMediaQuery 
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import back from "../../assets/back.jpg";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging log

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        if (data.user.isAdmin) {
          console.log("Redirecting to Admin Dashboard...");
          navigate("/admin-dashboard");
        } else {
          console.log("Redirecting to Customer Dashboard...");
          navigate("/Dashboard");
        }
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
      sx={{
        backgroundImage: `url(${back})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        sx={{
          width: isSmallScreen ? "100%" : 380,
          p: isSmallScreen ? 3 : 4,
          boxShadow: 4,
          borderRadius: 3,
          bgcolor: "#1e1e1e",
        }}
      >
        <CardContent>
          <Typography variant="h5" textAlign="center" color="#e0e0e0" fontWeight={600} mb={3}>
            Sign In
          </Typography>

          {message && (
            <Alert severity={message.includes("successful") ? "success" : "error"} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#e0e0e0" } }}
                InputProps={{
                  style: { color: "#e0e0e0", backgroundColor: "#2a2a2a", borderRadius: 6 },
                }}
              />
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#e0e0e0" } }}
                InputProps={{
                  style: { color: "#e0e0e0", backgroundColor: "#2a2a2a", borderRadius: 6 },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                borderRadius: 6,
                backgroundColor: "#00796b",
                "&:hover": { backgroundColor: "#008080" },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>

            <Typography className="text-base mt-5 mb-5 text-center text-white">
              Don't have an account? 
              <Button component="a" href="/signup" sx={{ textTransform: "none", color: "#00796b" }}>
                Sign Up
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
