import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Skeleton,
} from "@mui/material";

import {
  Inventory2Outlined,
  AccessTimeOutlined,
  LightbulbOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";

import type { Medicine } from "../../types/medicine.types";

const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);

type Props = {
  lowStock: Medicine[];
  expiring: Medicine[];
  loading: boolean;
};

const InfoCard = ({
  title,
  value,
  color,
  bg,
  icon,
}: {
  title: string;
  value: number | string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}) => (
  <Box
    sx={{
      bgcolor: bg,
      borderRadius: 3,
      p: 2,
      mb: 2,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 1,
      }}
    >
      {icon}
      <Typography
        sx={{
          color,
          fontWeight: 700,
          fontSize: 17,
        }}
      >
        {title}
      </Typography>
    </Box>

    <Typography
      sx={{
        fontSize: 22,
        fontWeight: 700,
        color: "#222",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const NeedsAttention = ({
  lowStock,
  expiring,
  loading,
}: Props) => {
  const expiringSoon = expiring.filter(
    (m) => daysUntil(m.expiryDate) <= 30
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Needs Attention
        </Typography>

        {loading ? (
          <Skeleton height={420} />
        ) : (
          <>
            <InfoCard
              title="Low Stock Medicines"
              value={lowStock.length}
              color="#B26A00"
              bg="#FFF8E1"
              icon={<Inventory2Outlined sx={{ color: "#B26A00" }} />}
            />

            <InfoCard
              title="Expiring Soon"
              value={expiringSoon.length}
              color="#C62828"
              bg="#FDECEA"
              icon={<AccessTimeOutlined sx={{ color: "#C62828" }} />}
            />

            <Box
              sx={{
                bgcolor: "#E8F5E9",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <LightbulbOutlined sx={{ color: "#2E7D32" }} />

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#1B5E20",
                  }}
                >
                  Smart Recommendation
                </Typography>
              </Box>

              <Typography color="text.secondary">
                {lowStock.length > 0
                  ? `Restock ${lowStock.length} medicines to avoid shortages.`
                  : "Inventory is healthy."}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Today's Activity
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#F5F7FA",
                  borderRadius: 3,
                  p: 2,
                }}
              ><Typography
              sx={{
                  color: "text.secondary",
                  fontSize: 13,
                 }}
>
                  Low Stock
                </Typography>

                <Typography
  sx={{
    fontWeight: 700,
    fontSize: 24,
  }}
>
                  {lowStock.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "#F5F7FA",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 13,
                  }}
                >
                  Expiring
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  {expiringSoon.length}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "#F5F7FA",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 13,
                  }}
                >
                  Safe Medicines
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  {Math.max(
                    lowStock.length + expiringSoon.length,
                    0
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "#F5F7FA",
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 13,
                  }}
                >
                  Status
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <TrendingUpOutlined
                    sx={{
                      color: "#2E7D32",
                      fontSize: 20,
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#2E7D32",
                      fontWeight: 700,
                    }}
                  >
                    Healthy
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NeedsAttention;