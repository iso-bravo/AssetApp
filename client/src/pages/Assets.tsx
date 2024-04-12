import {
  Box,
  Container,
  Typography,
  ButtonGroup,
  TextField,
  InputLabel,
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import DialogForm from "../components/DialogForm";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import AssetDetails from "../components/AssetDetails";
import ExportIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import { NumberInput } from "../components/NumberInput";

// Datos de prueba
const rows: GridRowsProp = [
  {
    id: 1,
    Number_Serie: 3465437,
    Modelo: "Chocolate",
    Marca: "Waffles roll",
    ID_Categoria: "Categoria",
    ID_Estatus: "Activo",
  },
  {
    id: 2,
    Number_Serie: 3454672,
    Modelo: "Dog Pile",
    Marca: "Puzzle Car",
    ID_Categoria: "Juego",
    ID_Estatus: "Activo",
  },
  {
    id: 3,
    Number_Serie: 1484839,
    Modelo: "Pulpo",
    Marca: "Cubo de Magma",
    ID_Categoria: "Cubik",
    ID_Estatus: "Activo",
  },
];

// Select de prueba
const categoria = [
  {
    label: "categoria 1",
    value: "1",
  },
  {
    label: "categoria 2",
    value: "2",
  },
];

// Definir columnas
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "Number_Serie", headerName: "Número de serie", width: 150 },
  { field: "Modelo", headerName: "Modelo", width: 150 },
  { field: "Marca", headerName: "Marca", width: 150 },
  { field: "ID_Categoria", headerName: "Categoría", width: 150 },
  { field: "ID_Estatus", headerName: "Estatus", width: 150 },
];

// Datos de prueba
const AssetTest = {
  id: 1,
  Number_Serie: 3464566,
  Modelo: "S24 ULTRA",
  Description: "Una descripción de esto",
  Marca: "PATITO",
  ID_Categoria: 2,
  Fecha_Registro: "12/02/24",
  Tipo_Compra: "Tipo de compra",
  No_Factura: 545343,
  Factura: "PDF",
  ID_Usuario: 1,
  ID_Area: 2,
  ID_Estatus: 1,
  Imagen: "Imagen",
};

// Vista Assets
export default function Assets() {
  return (
    <>
      <NavegatorDrawer /> {/* Drawer para navegar entre vistas */}
      <Container>
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
            {/* Título de la Vista */}
            Assets
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones */}
              <AddAssetDialogButton />
              <EditAssetDialogButton />
              <AssetDetails asset={AssetTest} />
              <Button endIcon={<DeleteIcon/>} color="error" variant="contained">
                Eliminar
              </Button>
              <Button endIcon={<ExportIcon />} variant="outlined">
                Exportar
              </Button>
            </ButtonGroup>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[6]}
          />
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
          select
          label="Categoría"
          fullWidth
          required
          helperText="Indica la categoría."
          multiline
          margin="normal"
          name="categoria"
        >
          {categoria.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
        <TextField
          label="Usuario"
          fullWidth
          required
          helperText="Indica el usuario relacionado."
          multiline
          margin="normal"
          aria-labelledby="Usuario"
          name="usuario"
        />
        <TextField
          label="Área"
          fullWidth
          required
          helperText="Indica el área relacionada."
          multiline
          margin="normal"
          aria-labelledby="Áerea"
          name="area"
        />
        <InputLabel>Imagen: </InputLabel>
        <TextField
          type="file"
          fullWidth
          required
          helperText="Adjunta una imagen."
          margin="normal"
          aria-labelledby="Modelo"
          name="imagen"
        />
      </Box>
    </DialogForm>
  );
}

function EditAssetDialogButton() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="primary"
        endIcon={<EditIcon/>}
      >
        Editar
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const test = formJson;
            console.log(test);
            handleClose();
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle style={{ backgroundColor: "steelblue" }} color="white">
          Editar Asset
        </DialogTitle>
        <DialogContent draggable></DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          <Button type="submit" title="Editar" variant="contained">
            Editar
          </Button>
          <Button
            title="Cancelar"
            onClick={handleClose}
            variant="contained"
            color="error"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
