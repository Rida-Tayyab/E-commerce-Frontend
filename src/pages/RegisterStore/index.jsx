import { useState } from "react";
import {
    Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert,
    useMediaQuery, useTheme
} from "@mui/material";
import back from "../../assets/back.jpg";

const StoreSignup = () => {
    const [formData, setFormData] = useState({
        businessName: "", ownerName: "", ownerEmail: "", businessType: "", NTN: "",
        contactEmail: "", phone: "", website: "", logoUrl: "", description: "",
        street: "", city: "", state: "", postalCode: "", country: ""
    });

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

        const storePayload = {
            businessName: formData.businessName,
            ownerName: formData.ownerName,
            ownerEmail: formData.ownerEmail,
            businessType: formData.businessType,
            NTN: formData.NTN,
            contactEmail: formData.contactEmail,
            phone: formData.phone,
            website: formData.website,
            logoUrl: formData.logoUrl,
            description: formData.description,
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            }
        };

        try {
            const response = await fetch("http://localhost:5000/store/register-store", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(storePayload),
            });

            if (response.ok) {
                setMessage("Store registered successfully!");
                setFormData({
                    businessName: "", ownerName: "", ownerEmail: "", businessType: "", NTN: "",
                    contactEmail: "", phone: "", website: "", logoUrl: "", description: "",
                    street: "", city: "", state: "", postalCode: "", country: ""
                });
            } else {
                const data = await response.json();
                setMessage(data.message || "Store registration failed.");
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            px={2}
            sx={{
                backgroundImage: `url(${back})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Card
                sx={{
                    width: isSmallScreen ? "100%" : 500,
                    maxHeight: "90vh",
                    p: 2,
                    boxShadow: 4,
                    borderRadius: 3,
                    bgcolor: "#1e1e1e",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardContent sx={{ overflowY: "auto", maxHeight: "75vh", pr: 1,scrollbarColor: "#003C43 #1e1e1e" ,scrollbarWidth:"thin"}}>
                    <Typography variant="h5" textAlign="center" color="#e0e0e0" fontWeight={600} mb={3}>
                        Register Your Store
                    </Typography>

                    {message && (
                        <Alert severity={message.includes("successfully") ? "success" : "error"} sx={{ mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        {[
                            { name: "businessName", label: "Business Name" },
                            { name: "ownerName", label: "Owner Name" },
                            { name: "ownerEmail", label: "Owner Email", type: "email" },
                            { name: "businessType", label: "Business Type" },
                            { name: "NTN", label: "NTN" },
                            { name: "contactEmail", label: "Contact Email", type: "email" },
                            { name: "phone", label: "Phone Number" },
                            { name: "website", label: "Website (Optional)" },
                            { name: "logoUrl", label: "Logo URL (Optional)" },
                            { name: "description", label: "Business Description" },
                            { name: "street", label: "Street Address" },
                            { name: "city", label: "City" },
                            { name: "state", label: "State" },
                            { name: "postalCode", label: "Postal Code" },
                            { name: "country", label: "Country" },
                        ].map(({ name, label, type = "text" }) => (
                            <Box mb={2} key={name}>
                                <TextField
                                    fullWidth
                                    label={label}
                                    name={name}
                                    type={type}
                                    variant="outlined"
                                    value={formData[name]}
                                    onChange={handleChange}
                                    required={["NTN", "website", "logoUrl"].indexOf(name) === -1}
                                    InputLabelProps={{
                                        shrink: formData[name] !== "" || undefined,
                                        style: { color: "#e0e0e0" }
                                    }}
                                    InputProps={{
                                        style: {
                                            color: "#e0e0e0",
                                            backgroundColor: "#2a2a2a",
                                            borderRadius: 6
                                        },
                                    }}
                                />
                            </Box>
                        ))}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                mt: 2,
                                borderRadius: 6,
                                backgroundColor: "#00796b",
                                "&:hover": { backgroundColor: "#008080" },
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Register Store"}
                        </Button>
                        <Button
                        type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                mt: 2,
                                borderRadius: 6,
                                backgroundColor: "#00796b",
                                "&:hover": { backgroundColor: "#008080" },
                            }}
                            href="/seller-dashboard"
                        >
                            Already Register Continue to Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StoreSignup;
