import React, { useState, useEffect } from "react";
import axios from "axios";
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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExportIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { API } from "./Home";

// Definir columnas
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "numero_serie", headerName: "Número de serie", width: 150 },
  { field: "modelo", headerName: "Modelo", width: 150 },
  { field: "marca", headerName: "Marca", width: 150 },
  { field: "id_categoria", headerName: "Categoría", width: 150 },
  { field: "id_estatus", headerName: "Estatus", width: 150 },
];

// Vista Assets
export default function Assets() {
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/asset_all/")
      .then(response => {
        setRows(response.data);
      })
      .catch(error => {
        console.error("Error al obtener datos del servidor:", error);
      });
  }, []);

  const exportCSV = () => {
    API.get("/api/export_csv/", { responseType: 'blob' }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'assets.csv');
        document.body.appendChild(link);
        link.click();
    });
}

  return (
    <>
      <NavegatorDrawer />
      <Container>
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
            Assets
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones */}
              <AddAssetDialogButton />
              <EditAssetDialogButton />
              <Button endIcon={<DeleteIcon/>} color="error" variant="contained">
                Eliminar
              </Button>
              <Button endIcon={<ExportIcon />} variant="outlined" onClick={exportCSV}
              >
                Exportar
              </Button>
            </ButtonGroup>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            pageSizeOptions={[6]}
            disableMultipleRowSelection
          />
        </Box>
      </Container>
    </>
  );
}

type Options = {
  value: string;
  label: string;
};

type ServerCategory = {
  id: number;
  categoria: string;
};

type ServerStatus = {
  id: number;
  estatus: string;
};

type ServerUser = {
  id: number;
  nombre: string;
};

type ServerArea = {
  id: number;
  area: string;
};

function AddAssetDialogButton() {
  const [categories, setCategories] = useState<Options[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [users, setUsers] = useState<Options[]>([]);
  const [areas, setAreas] = useState<Options[]>([]);


  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/categories/")
      .then(response => {
        const mappedCategories = response.data.map((item: ServerCategory) => ({
          value: item.id.toString(),
          label: item.categoria,
        }));
        setCategories(mappedCategories);
      })
      .catch(error => {
        console.error("Error al obtener categorías del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/states/")
      .then(response => {
        const mappedStates = response.data.map((item: ServerStatus) => ({
          value: item.id.toString(),
          label: item.estatus,
        }));
        setStatus(mappedStates);
      })
      .catch(error => {
        console.error("Error al obtener estados del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/users/")
      .then(response => {
        const mappedUsers = response.data.map((item: ServerUser) => ({
          value: item.id.toString(),
          label: item.nombre,
        }));
        setUsers(mappedUsers);
      })
      .catch(error => {
        console.error("Error al obtener usuarios del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/areas/")
      .then(response => {
        const mappedAreas = response.data.map((item: ServerArea) => ({
          value: item.id.toString(),
          label: item.area,
        }));
        setAreas(mappedAreas);
      })
      .catch(error => {
        console.error("Error al obtener areas del servidor:", error);
      });
  }, []);

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
        color="success"
        endIcon={<AddIcon />}
      >
        Añadir
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

            API.post("/api/create_asset/", formJson).then((response) => {
              console.log(response);
            });
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
          Añadir Asset
        </DialogTitle>
        <DialogContent draggable>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <TextField
          label="Número de serie"
          type="number"
          fullWidth
          required
          helperText="Escribe el número de serie."
          margin="normal"
          name="numero_serie"
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
          label="Estatus"
          fullWidth
          required
          helperText="Indica el estatus."
          multiline
          margin="normal"
          name="id_estatus"
        >
          {status.map((stat) => (
            <MenuItem key={stat.value} value={stat.value}>
              {stat.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Categoría"
          fullWidth
          required
          helperText="Indica ;a categoria."
          multiline
          margin="normal"
          name="id_categoria"
        >
          {categories.map((category) => (
            <MenuItem key={category.value} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </TextField>
      <TextField
        label="Tipo de compra"
        fullWidth
        required
        helperText="Selecciona el tipo de compra."
        multiline
        margin="normal"
        aria-labelledby="Modelo"
        name="tipo_compra"
      />
      <TextField
        label="No. de factura/pedimento"
        fullWidth
        required
        helperText="Escribe el número de factura."
        multiline
        margin="normal"
        aria-labelledby="Modelo"
        name="noFactura_pedimiento"
      />
      <TextField
        label="Factura/Pedimento"
        fullWidth
        required
        helperText="Indica la factura."
        multiline
        margin="normal"
        aria-labelledby="Modelo"
        name="factura_pedimientoPDF"
      />
      <TextField
          select
          label="Usuario"
          fullWidth
          required
          helperText="Indica el usuario."
          multiline
          margin="normal"
          name="id_usuario"
        >
          {users.map((user) => (
            <MenuItem key={user.value} value={user.value}>
              {user.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Area"
          fullWidth
          required
          helperText="Indica el area."
          multiline
          margin="normal"
          name="id_area"
        >
          {areas.map((area) => (
            <MenuItem key={area.value} value={area.value}>
              {area.label}
            </MenuItem>
          ))}
        </TextField>
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
        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </Box>
      </DialogContent>
      </Dialog>
      </>
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
