import { Box, Container, Typography } from "@mui/material";
import NavegatorDrawer from "../components/NavegatorDrawer";
import axios from "axios";

export const API = axios.create({baseURL:'http://localhost:8000'})

export default function UsersPage() {
  return (
    <>
      <NavegatorDrawer />
      <Container>
        <Box
          maxHeight={800}
          minHeight={300}
          marginTop={10}
          marginBottom={10}
          marginLeft={30}
          minWidth={100}
        >
          <Typography variant="h4" margin={4}>
            Página principal
          </Typography>
        </Box>
      </Container>
    </>
  );
}
