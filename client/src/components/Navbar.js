import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                Home
              </Link>
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/ejercicios/new")}
            >
              Login
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}
