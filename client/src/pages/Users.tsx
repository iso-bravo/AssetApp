import { Box, Container, Typography } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import { useEffect, useState } from "react";
import axios from "axios";

// Datos de prueba
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
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "id_departamento", headerName: "Departamento", width: 150 },
  { field: "id_permiso", headerName: "Permisos", width: 150 },
];

export default function UsersPage() {
  const [user, setUser] = useState<GridRowsProp>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

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
          <DataGrid rows={user} columns={columns} />
        </Box>
      </Container>
    </>
  );
}
