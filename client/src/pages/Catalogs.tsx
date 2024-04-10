import { Box, Container, Typography } from "@mui/material";
import NavegatorDrawer from "../components/NavegatorDrawer";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";

//Componente de la vista de Catálogos
export default function CatalogsPage() {
  const [categorias, setCategorias] = useState<GridRowsProp>([]);
  const [estados, setEstados] = useState<GridRowsProp>([]);
  const [areas, setAreas] = useState<GridRowsProp>([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/states/')
      .then(response => {
        setEstados(response.data);
      })
      .catch(error => {
        console.error('Error fetching states:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/areas/')
      .then(response => {
        setAreas(response.data);
      })
      .catch(error => {
        console.error('Error fetching areas:', error);
      });
  }, []);

  const categoria: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "categoria", headerName: "Categoría", width: 150 },
  ];

  const estadosCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "estados", headerName: "Estados", width: 150 },
  ];

  const areasCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "areas", headerName: "Areas", width: 150 },
  ];

  return (
    <>
      <NavegatorDrawer />
      <Container>
        <Box
          marginTop={3}
          marginBottom={10}
          marginLeft={30}
          minWidth={100}
        >
          <Typography variant="h4" className=" py-4">
            Categorias
          </Typography>
          <DataGrid rows={categorias} columns={categoria} />

          <Typography variant="h4" className=" py-4">
            Estados
          </Typography>
          <DataGrid rows={estados} columns={estadosCols} />

          <Typography variant="h4" className=" py-4">
            Areas
          </Typography>
          <DataGrid rows={areas} columns={areasCols} />
        </Box>
      </Container>
    </>
  );
}
