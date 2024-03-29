import { Box, Container, Typography } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/Drawer";

const rows: GridRowsProp = [
  {
    id: 1,
    Nombre: "Miguel A.",
    Departamento: "Recursos Humanos",
    Permisos: "Abrir permisos",
  },
  {
    id: 2,
    Nombre: "Ramiro N.",
    Departamento: "Informática",
    Permisos: "Abrir permisos",
  },
  {
    id: 3,
    Nombre: "Oscar E.",
    Departamento: "Mantenimiento",
    Permisos: "Abrir permisos",
  },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "Nombre", headerName: "Nombre", width: 150 },
  { field: "Departamento", headerName: "Departamento", width: 150 },
  { field: "Permisos", headerName: "Permisos", width: 150 },
];

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
            Usuarios
          </Typography>
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Container>
    </>
  );
}
