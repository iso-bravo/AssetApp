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
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import { API } from "./Home";
import ReloadIcon from "@mui/icons-material/Refresh";

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
  { field: "contraseña", headerName: "Contraseña", width: 150 },
  { field: "id_departamento", headerName: "Departamento", width: 150 },
  { field: "id_permiso", headerName: "Permisos", width: 150 },
];

export default function UsersPage() {
  const [department, setDepartment] = useState<GridRowsProp>([]);
  const [permissions, setPermissions] = useState<GridRowsProp>([]);
  const [user, setUser] = useState<GridRowsProp>([]);
  const [IDUsuario, setIDUsuario] = useState<GridRowSelectionModel>([-1]);

  useEffect(() => {
    API.get("/api/departments/")
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    API.get("/api/permissions/")
      .then((response) => {
        setPermissions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });
  }, []);

  useEffect(() => {
    API.get("/api/users/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  function getDepartamentos() {
    API.get("/api/departments/")
      .then((response) => {
        setDepartment(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }

  function getPermisos() {
    API.get("/api/permissions/")
      .then((response) => {
        setPermissions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
      });
  }

  function getUsuarios() {
    API.get("/api/users/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

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
              <AddUserButton
                departament={department}
                permission={permissions}
                ClickHandler={() => getUsuarios()}
              />
              <EditUserButton
                ids={IDUsuario}
                data={user}
                departament={department}
                permission={permissions}
                ClickHandler={() => getUsuarios()}
              />
              <DeleteUserButton
                ids={IDUsuario}
                ClickHandler={() => getUsuarios()}
              />
            </ButtonGroup>
          </Box>
          <IconButton onClick={() => getUsuarios()}>
            <ReloadIcon />
          </IconButton>
          <DataGrid
            rows={user}
            columns={columns}
            checkboxSelection
            disableMultipleRowSelection
            onRowSelectionModelChange={(id) => {
              const selected: GridRowSelectionModel = id;
              setIDUsuario(selected);
            }}
          />
        </Box>
      </Container>
    </>
  );
}

interface resetInterface {
  ClickHandler: Function; //(event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface AddUserProps extends resetInterface {
  departament: GridRowsProp;
  permission: GridRowsProp;
}

interface IDProps extends AddUserProps {
  ids: GridRowSelectionModel;
  data?: GridRowsProp;
}

function AddUserButton(props: AddUserProps) {
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

            API.post("/api/create_user/", formJson).then((response) => {
              console.log(response);
              props.ClickHandler();
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
              type="password"
              helperText="Escriba la contraseña."
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
              {props.departament.map((option) => (
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
              {props.permission.map((option) => (
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

function EditUserButton(props: IDProps) {
  const [open, setOpen] = React.useState(false);
  const id: number = +props.ids[0];
  var nameUsuario: string = "";
  var idDepartamento: number = -1;
  var idPermisos: number = -1;
  var pass: string = "";

  if (!(id === -1 || Number.isNaN(id))) {
    props.data?.map((data) => {
      if (data.id === id) {
        nameUsuario = data.nombre;
        pass = data.contraseña;
        idDepartamento = data.id_departamento;
        idPermisos = data.id_permiso;
      }
    });
  }

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
        onClick={() => {
          handleClickOpen();
        }}
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
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);

            API.post("/api/edit_user/", formJson).then((response) => {
              console.log(response);
              props.ClickHandler();
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
          Editar Usuario
        </DialogTitle>
        <DialogContent draggable>
          <Box padding={4}>
            {id === -1 || Number.isNaN(id) ? (
              <>
                <Typography variant="h6">
                  No se ha seleccionado ningún ID.
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                  <TextField
                    label="ID"
                    required
                    margin="normal"
                    name="id_user"
                    value={id}
                    type="number"
                    helperText="No se puede cambiar el ID."
                  />
                  <TextField
                    label="Nombre"
                    fullWidth
                    required
                    helperText="Modifica el nombre."
                    margin="normal"
                    name="nombre"
                    defaultValue={nameUsuario}
                  />
                  <TextField
                    label="Constraseña"
                    fullWidth
                    required
                    type="password"
                    helperText="Cambia la contraseña."
                    margin="normal"
                    name="contraseña"
                    defaultValue={pass}
                  />
                  <TextField
                    select
                    label="Departamento"
                    fullWidth
                    required
                    helperText="Indica el departamento al que pertenece."
                    margin="normal"
                    name="id_departamento"
                    defaultValue={idDepartamento}
                  >
                    {props.departament.map((option) => (
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
                    defaultValue={idPermisos}
                  >
                    {props.permission.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.permiso}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          {id === -1 || Number.isNaN(id) ? (
            <>
              <Button
                title="Cancelar"
                onClick={handleClose}
                variant="contained"
                color="error"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

interface IDPropsDelete extends resetInterface {
  ids: GridRowSelectionModel;
}

function DeleteUserButton(props: IDPropsDelete) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const id: number = +props.ids[0];

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="error"
        endIcon={<DeleteIcon />}
      >
        Eliminar
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth>
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
          Eliminar Usuario
        </DialogTitle>
        <DialogContent draggable>
          <Box padding={4}>
            {id === -1 || Number.isNaN(id) ? (
              <>
                <Typography variant="h6">
                  No se ha seleccionado ningún ID.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6">
                  Se eliminará el usuario con el siguiente ID: <b>{id}</b>
                </Typography>
                <Typography variant="h6">
                  ¿Desea eliminar dicho elemento?
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          {id === -1 || Number.isNaN(id) ? (
            <>
              <Button
                title="Cancelar"
                onClick={handleClose}
                variant="contained"
                color="error"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                title="Enviar"
                variant="contained"
                onClick={() => {
                  const content = {
                    id_user: id,
                  };

                  const contentJson = content as any;

                  API.post("/api/delete_user/", contentJson).then(
                    (response) => {
                      console.log(response);
                      props.ClickHandler();
                    }
                  );
                  handleClose();
                }}
              >
                Confirmar
              </Button>
              <Button
                title="Cancelar"
                onClick={handleClose}
                variant="contained"
                color="error"
              >
                Cancelar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
