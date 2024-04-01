import { Box, Container, Typography, ButtonGroup, FormControl, TextField, Stack } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import DialogForm from "../components/DialogForm";
import { NumberInput } from "../components/NumberInput";

// Datos de prueba
const rows: GridRowsProp = [
  {
    id: 1,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 2,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 3,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 4,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 5,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 6,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 7,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
  {
    id: 8,
    Number_Serie: 3125435,
    Modelo: "S24 ULTRA",
    Descripcion: "Algo muy nuevo y caro.",
    Marca: "Samsung",
    ID_Categoria: 3,
    Imagen: "Imagen",
    Fecha_Registro: "12/1/24",
    ID_Estatus: 4,
    Tipo_Compra: "Equipo electrónico",
    No_Factura_Pedimento: 4536546,
    Factura_Pedimento: "Factura aquí",
    boton1: null,
    boton2: null,
    boton3: null,
    boton4: null,
  },
];

// Definir columnas
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "Number_Serie", headerName: "Número de serie", width: 150 },
  { field: "Modelo", headerName: "Modelo", width: 150 },
  { field: "Descripcion", headerName: "Descripción", width: 150 },
  { field: "Marca", headerName: "Marca", width: 150 },
  { field: "ID_Categoria", headerName: "Categoría", width: 150 },
  { field: "Imagen", headerName: "Imagen", width: 150 },
  { field: "Fecha_Registro", headerName: "Fecha de registro", width: 150 },
  { field: "ID_Estatus", headerName: "Estatus", width: 150 },
  { field: "Tipo_Compra", headerName: "Tipo de compra", width: 150 },
  {
    field: "No_Factura_Pedimento",
    headerName: "No. de factura/pedimento",
    width: 150,
  },
  { field: "Factura_Pedimento", headerName: "Factura/Pedimento", width: 150 },
  { field: "boton1", headerName: "Acción 1", width: 150 },
  { field: "boton2", headerName: "Acción 2", width: 150 },
  { field: "boton3", headerName: "Acción 3", width: 150 },
  { field: "boton4", headerName: "Acción 4", width: 150 },
];

// Vista Assets
export default function Assets() {
  return (
    <>
      <NavegatorDrawer /> {/* Drawer para navegar entre vistas */}
      <Container> {/* Contenido de la Vista va dentro del Box */}
        <Box
          maxHeight={2000}
          minHeight={0}
          marginTop={4}
          marginBottom={10}
          marginLeft={25}
          minWidth={50}
          maxWidth={2000}
        >
          <Typography variant="h4" margin={2}> {/* Título de la Vista */}
            Assets
          </Typography>
          <ButtonGroup> {/* Grupo de Acciones */}
            <DialogForm butttonTitle="Agregar" title="Agregar un Asset">
              <FormControl>
                <Stack spacing={4}>
                  <NumberInput placeholder="Número de serie..."></NumberInput>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                  <TextField label="" fullWidth></TextField>
                </Stack>
              </FormControl>
            </DialogForm>
          </ButtonGroup>
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Container>
    </>
  );
}
