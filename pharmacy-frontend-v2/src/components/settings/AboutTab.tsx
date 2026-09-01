import { Box, Typography, Divider } from "@mui/material";

const AboutTab = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>About</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Pharmacy Management System</Typography>
      <Typography sx={{ color: "#666", mb: 2 }}>Version 1.0.0</Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography sx={{ fontSize: 14, mb: 1 }}><b>Developer:</b> Beulah Ponseeli</Typography>
      <Typography sx={{ fontSize: 14, mb: 1 }}><b>Support:</b> support@pharmacy.com</Typography>
      <Typography sx={{ fontSize: 13, color: "#999", mt: 2 }}>© 2026 All Rights Reserved</Typography>
    </Box>
  );
};

export default AboutTab;