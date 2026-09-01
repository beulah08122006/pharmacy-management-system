import { Chip } from "@mui/material";

const MedicineStatusChip = ({ quantity }: { quantity: number }) => {
  if (quantity === 0) {
    return <Chip label="Out of Stock" size="small" sx={{ bgcolor: "#FDECEA", color: "#C62828", fontWeight: 600 }} />;
  }
  if (quantity < 20) {
    return <Chip label="Low Stock" size="small" sx={{ bgcolor: "#FFF8E1", color: "#B26A00", fontWeight: 600 }} />;
  }
  return <Chip label="In Stock" size="small" sx={{ bgcolor: "#E8F5E9", color: "#2E7D32", fontWeight: 600 }} />;
};

export default MedicineStatusChip;