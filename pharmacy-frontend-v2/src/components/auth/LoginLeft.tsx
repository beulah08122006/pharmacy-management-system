import { Box, Typography } from "@mui/material";
import LocalPharmacyRoundedIcon from "@mui/icons-material/LocalPharmacyRounded";

const LoginLeft = () => {
  return (
    <Box
      sx={{
        width: { xs: "0%", md: "50%" },
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)",
        color: "#fff",
        p: 6,
      }}
    >
      <Box
        sx={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 5,
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <LocalPharmacyRoundedIcon
          sx={{
            fontSize: 72,
            color: "#fff",
          }}
        />
      </Box>

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 1,
          letterSpacing: 1,
        }}
      >
        Pharmacy
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 300,
          mb: 4,
        }}
      >
        Management System
      </Typography>

      <Typography
        variant="body1"
        sx={{
          maxWidth: 420,
          lineHeight: 1.9,
          opacity: 0.9,
          fontSize: "1.05rem",
        }}
      >
        Manage medicines, inventory, suppliers, customers and sales
        efficiently through one secure and modern platform.
      </Typography>

      <Box
        sx={{
          mt: 6,
          display: "flex",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "#ffffff",
          }}
        />

        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.45)",
          }}
        />

        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.45)",
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginLeft;