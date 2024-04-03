import {
  Box,
  Container,
  Typography,
  ButtonGroup,
  TextField,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import DialogForm from "../components/DialogForm";
// import { NumberInput } from "../components/NumberInput";

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
      <Container>
        {" "}
        {/* Contenido de la Vista va dentro del Box */}
        <Box
          maxHeight={2000}
          minHeight={0}
          marginTop={4}
          marginBottom={10}
          marginLeft={20}
          minWidth={500}
          maxWidth={2000}
        >
          <Typography variant="h4" margin={2} align="center">
            {" "}
            {/* Título de la Vista */}
            Assets
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones */}
              <AddAssetDialogButton />
            </ButtonGroup>
          </Box>
          <DataGrid rows={rows} columns={columns} />
        </Box>
      </Container>
    </>
  );
}

function AddAssetDialogButton() {
  return (
    <DialogForm
      butttonTitle="Agregar"
      title="Agregar un Asset"
      endButtonText="Enviar"
    >
      {" "}
      {/* Botón Agregar */}
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {/*<NumberInput placeholder="Número de serie..." required />*/}
        <TextField
          label="Número de serie"
          type="number"
          fullWidth
          required
          helperText="Escribe el número de serie."
          margin="normal"
          name="modelo"
        />
        <TextField
          label="Modelo"
          fullWidth
          required
          helperText="Escribe el modelo del producto."
          multiline
          margin="normal"
          name="modelo"
        />
        <TextField
          label="Descripción"
          fullWidth
          required
          helperText="Agrega una descripción."
          multiline
          margin="normal"
          name="descripcion"
        />
        <TextField
          label="Marca"
          fullWidth
          required
          helperText="Indica la marca."
          multiline
          margin="normal"
          name="marca"
        />
        <TextField
          label="Categoría"
          fullWidth
          required
          helperText="Indica la categoría."
          multiline
          margin="normal"
          name="categoria"
        />
        <TextField
          label="Imagen"
          type="file"
          fullWidth
          required
          helperText="Adjunta una imagen."
          margin="normal"
          aria-labelledby="Modelo"
          name="imagen"
        />
        <TextField
          label="Estatus"
          fullWidth
          required
          helperText="Indica el estatus."
          multiline
          margin="normal"
          aria-labelledby="Modelo"
          name="estatus"
        />
        <TextField
          label="Tipo de compra"
          fullWidth
          required
          helperText="Selecciona el tipo de compra."
          multiline
          margin="normal"
          aria-labelledby="Modelo"
          name="tipo"
        />
        <TextField
          label="No. de factura/pedimento"
          fullWidth
          required
          helperText="Escribe el número de factura."
          multiline
          margin="normal"
          aria-labelledby="Modelo"
          name="nofactura"
        />
        <TextField
          label="Factura/Pedimento"
          fullWidth
          required
          helperText="Indica la factura."
          multiline
          margin="normal"
          aria-labelledby="Modelo"
          name="factura"
        />
      </Box>
    </DialogForm>
  );
}
