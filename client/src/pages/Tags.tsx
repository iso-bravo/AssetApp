import { Box, Container, Typography } from "@mui/material";
import NavegatorDrawer from "../components/Drawer";

export default function TagsPage() {
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
            Etiquetas
          </Typography>
        </Box>
      </Container>
    </>
  );
}
