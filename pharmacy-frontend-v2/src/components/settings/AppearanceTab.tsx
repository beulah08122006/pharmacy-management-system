import { Box, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from "@mui/material";
import { useThemeMode } from "../../context/ThemeModeContext";

const AppearanceTab = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Appearance</Typography>

      <Typography sx={{ fontWeight: 600, mb: 1 }}>Theme</Typography>
      <RadioGroup row value={mode} onChange={toggleMode} sx={{ mb: 3 }}>
        <FormControlLabel value="light" control={<Radio />} label="Light" />
        <FormControlLabel value="dark" control={<Radio />} label="Dark" />
      </RadioGroup>

      <Typography sx={{ fontWeight: 600, mb: 1 }}>Primary Color</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#1565C0" }} />
        <Typography sx={{ fontSize: 13, color: "#666" }}>Blue (fixed — custom color picker not implemented)</Typography>
      </Box>

      <Typography sx={{ fontWeight: 600, mb: 1 }}>Language</Typography>
      <Select value="en" disabled sx={{ minWidth: 200 }}>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </Box>
  );
};

export default AppearanceTab;