import { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert, useMediaQuery, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import back from "../../assets/back.jpg";

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setMessage("Registration successful!");
                setFormData({ name: "", email: "", password: "", role: "" });
            } else {
                const data = await response.json();
                setMessage(data.message || "Registration failed.");
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
                        Sign Up
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
                                label="Full Name"
                                name="name"
                                variant="outlined"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: formData.name !== "" || undefined, style: { color: "#e0e0e0" } }}
                                InputProps={{
                                    style: { color: "#e0e0e0", backgroundColor: "#2a2a2a", borderRadius: 6 },
                                }}
                            />
                        </Box>
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
                                InputLabelProps={{ shrink: formData.email !== "" || undefined, style: { color: "#e0e0e0" } }}
                                InputProps={{
                                    style: { color: "#e0e0e0", backgroundColor: "#2a2a2a", borderRadius: 6 },
                                }}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: formData.password !== "" || undefined, style: { color: "#e0e0e0" } }}
                                InputProps={{
                                    style: { color: "#e0e0e0", backgroundColor: "#2a2a2a", borderRadius: 6 },
                                }}
                            />
                        </Box>
                        <Box mb={3}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel sx={{ color: "#e0e0e0" }}>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    sx={{
                                        color: "#e0e0e0",
                                        backgroundColor: "#2a2a2a",
                                        borderRadius: 6,
                                    }}
                                >
                                    <MenuItem value="User">User</MenuItem>
                                    <MenuItem value="Seller">Seller</MenuItem>
                                </Select>
                            </FormControl>
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
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                        </Button>
                        <Typography textAlign="center" mt={3} color="#e0e0e0">
                            Already a Member?
                            <Button href="/login" sx={{ color: "#008080", ml: 1 }}>Login</Button>
                        </Typography>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Signup;
