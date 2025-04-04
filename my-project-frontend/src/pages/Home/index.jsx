import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import back from "../../assets/back.jpg";


const Home = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
            Sign In as
          </Typography>


            <Box mb={2}>
            <Button component="a" href="/signup" sx={{ textTransform: "none", color: "#00796b" }}>
                Sign up as Customer
            </Button>
            </Box>

            <Box mb={3}>
            <Button component="a" href="/regstore" sx={{ textTransform: "none", color: "#00796b" }}>
                Register your store
              </Button>
            </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
