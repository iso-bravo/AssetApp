import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import { useEffect, useState } from "react";
import ExportIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { API } from "./Home";

// Datos de prueba
/* const user: GridRowsProp = [
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
];*/

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "nombre", headerName: "Nombre", width: 150 },
  { field: "id_departamento", headerName: "Departamento", width: 150 },
  { field: "id_permiso", headerName: "Permisos", width: 150 },
];

export default function UsersPage() {
  const [department, setDepartment] = useState<GridRowsProp>([]);
  const [permissions, setPermissions] = useState<GridRowsProp>([]);
  const [user, setUser] = useState<GridRowsProp>([]);

  function getDepartamentos() {
    useEffect(() => {
      API.get("/api/departments/")
        .then((response) => {
          setDepartment(response.data);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    }, []);
  }

  function getPermisos() {
    useEffect(() => {
      API.get("/api/permissions/")
        .then((response) => {
          setPermissions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching permissions:", error);
        });
    }, []);
  }

  function getUsuarios() {
    useEffect(() => {
      API.get("/api/users/")
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }, []);
  }

  getDepartamentos();
  console.log(department);
  getPermisos();
  getUsuarios();

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
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones */}
              <AddUserButton />
              <EditUserButton />
              <Button
                endIcon={<DeleteIcon />}
                color="error"
                variant="contained"
              >
                Eliminar
              </Button>
              <Button endIcon={<ExportIcon />} variant="outlined">
                Exportar
              </Button>
            </ButtonGroup>
          </Box>
          <DataGrid rows={user} columns={columns} />
        </Box>
      </Container>
    </>
  );
}

function AddUserButton() {
  const [open, setOpen] = React.useState(false);
  const [department, setDepartment] = useState<GridRowsProp>([]);
  const [permissions, setPermissions] = useState<GridRowsProp>([]);
  
  function getDepartamentos() {
    useEffect(() => {
      API.get("/api/departments/")
        .then((response) => {
          setDepartment(response.data);
        })
        .catch((error) => {
          console.error("Error fetching departments:", error);
        });
    }, []);
  }

  function getPermisos() {
    useEffect(() => {
      API.get("/api/permissions/")
        .then((response) => {
          setPermissions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching permissions:", error);
        });
    }, []);
  }

  getDepartamentos();
  getPermisos();

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
            const idDepa: number = +formJson.id_departamento;
            const idPer: number = +formJson.id_permiso;

            const dataPost = {
              nombre: formJson.nombre,
              contraseña: formJson.contraseña,
              id_departamento: idDepa,
              id_permiso: idPer,
            };
            console.log(dataPost);

            API.post("/api/create_user/", formJson).then((response) => {
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
          Añadir Usuario
        </DialogTitle>
        <DialogContent draggable>
          {/* Contenido */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              label="Nombre"
              fullWidth
              required
              helperText="Escribe el nombre."
              margin="normal"
              name="nombre"
            />
            <TextField
              label="Constraseña"
              fullWidth
              required
              type="password"
              helperText="Escribe el nombre."
              margin="normal"
              name="contraseña"
            />
            <TextField
              select
              label="Departamento"
              fullWidth
              required
              helperText="Indica el departamento al que pertenece."
              margin="normal"
              name="id_departamento"
              defaultValue={""}
            >
              {department.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.departamento}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Permisos"
              fullWidth
              required
              helperText="Indica los permisos."
              margin="normal"
              name="id_permiso"
              defaultValue={""}
            >
              {permissions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.permiso}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          <Button type="submit" title="Enviar" variant="contained">
            Enviar
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

function EditUserButton() {
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
        endIcon={<EditIcon />}
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
            event.preventDefault(); // Ultima opcion quitar prevent default para recargar info de tabla
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
          Editar Usuario
        </DialogTitle>
        <DialogContent draggable>{/* Contenido */}</DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          <Button type="submit" title="Enviar" variant="contained">
            Enviar
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
