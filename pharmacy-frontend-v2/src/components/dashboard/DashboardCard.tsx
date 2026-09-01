import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";

interface Props {
  title: string;
  value: string | number;
  icon: SvgIconComponent;
  color: string;
  loading?: boolean;
}

const DashboardCard = ({ title, value, icon: Icon, color, loading }: Props) => {
  return (
    <Card elevation={0} sx={{ height: "100%", borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ color: "#666", fontWeight: 600, fontSize: 14 }}>{title}</Typography>
            {loading ? (
              <Skeleton width={70} height={40} />
            ) : (
              <Typography sx={{ fontSize: 28, fontWeight: 700, mt: 0.5 }}>{value}</Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 52, height: 52, borderRadius: "14px", background: color,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}
          >
            <Icon />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;