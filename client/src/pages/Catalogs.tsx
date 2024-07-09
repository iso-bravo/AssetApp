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
  TextField,
  Typography,
} from "@mui/material";
import NavegatorDrawer from "../components/NavegatorDrawer";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { ReactNode, useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ReloadIcon from "@mui/icons-material/Refresh";
import React from "react";
import { API } from "./Home";
import AuthContext from "../auth/Auth";

interface Usuario {
  id: String;
  nombre: String;
  contraseña: String;
  id_departamento: String;
  id_permiso: String;
}

interface Permiso {
  id: String;
  permiso: String;
}

//Componente de la vista de Catálogos
export default function CatalogsPage() {
  // hooks para datos de los catálogos
  const [categorias, setCategorias] = useState<GridRowsProp>([]);
  const [estados, setEstados] = useState<GridRowsProp>([]);
  const [areas, setAreas] = useState<GridRowsProp>([]);
  const [unidadMedida, setUnidadMedida] = useState<GridRowsProp>([]);
  const [estadosPedimento, setEstadosPedimento] = useState<GridRowsProp>([]);

  // hooks para asignar estado de cargando a los catálogos
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [loadingAreas, setLoadingAreas] = useState<boolean>(false);
  const [loadingUnidadMedida, setLoadingUnidadMedida] =
    useState<boolean>(false);
  const [loadingEstadosPedimento, setLoadingEstadosPedimento] =
    useState<boolean>(false);

  const [permiso, setPermiso] = useState<String>("viewer");

  // Obtener sesión actual
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.user) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  // Usuario autenticado
  const username: String = authContext.user.username;

  // Obtener permisos de usuario y datos de las tablas
  useEffect(() => {
    API.get("/api/users/").then(async (response) => {
      const usuarios: Usuario[] = response.data;

      // get permisos
      const permisos: Permiso[] = await API.get("/api/permissions/")
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error("Error fetching permissions:", error);
        });

      usuarios.map((usuario) => {
        if (usuario.nombre.toLowerCase() === username) {
          permisos.map((permiso) => {
            if (permiso.id === usuario.id_permiso) {
              setPermiso(permiso.permiso);
            }
          });
        }
      });
    });
    getCategoria();
    getEstados();
    getAreas();
    getUnidadMedida();
    getEstadosPedimento();
  }, []);

  // Obtener data de la base de datos
  function getCategoria() {
    API.get("/api/categories/")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  function getEstados() {
    API.get("/api/states/")
      .then((response) => {
        setEstados(response.data);
      })
      .catch((error) => {
        console.error("Error fetching states:", error);
      });
  }

  function getAreas() {
    API.get("/api/areas/")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }

  function getUnidadMedida() {
    API.get("/api/unidad_medida/")
      .then((response) => {
        setUnidadMedida(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  function getEstadosPedimento() {
    API.get("/api/estado_pedimento/")
      .then((response) => {
        setEstadosPedimento(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  // hooks para tener el ID de los catálogos
  const [IDCategoria, setIDCategoria] = useState<GridRowSelectionModel>([-1]);
  const [IDEstado, setIDEstado] = useState<GridRowSelectionModel>([-1]);
  const [IDArea, setIDArea] = useState<GridRowSelectionModel>([-1]);
  const [IDUnidadMedida, setIDUnidadMedida] = useState<GridRowSelectionModel>([
    -1,
  ]);
  const [IDEstadosPedimento, setIDEstadosPedimento] =
    useState<GridRowSelectionModel>([-1]);

  // Columnas de los catálogos
  const categoriaCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "categoria", headerName: "Categoría", width: 400 },
  ];

  const estadosCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "estatus", headerName: "Estados", width: 400 },
  ];

  const areasCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "area", headerName: "Áreas", width: 400 },
  ];

  const unidadMedidaCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "unidad_medida", headerName: "Unidad de Medida", width: 400 },
  ];

  const estadosPedimentoCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "estado_pedimento",
      headerName: "Estado del Pedimento",
      width: 400,
    },
  ];

  return (
    <>
      <NavegatorDrawer />
      <Container>
        <Box marginTop={3} marginBottom={10} marginLeft={30} minWidth={100}>
          {!(permiso === "admin") ? (
            <Typography variant="h4" className=" py-4">
              Catálogos
            </Typography>
          ) : (
            <></>
          )}
          {permiso === "admin" ? (
            <>
              <Typography variant="h4" className=" py-4">
                Categorias
              </Typography>
              <Box marginBottom={2}>
                <ButtonGroup>
                  {/* Grupo de Acciones Categoria*/}
                  <AddButton
                    ClickHandler={() => getCategoria()}
                    Loading={setLoadingCategories}
                    title={"Añadir Categoría"}
                    endPoint={"/api/create_category/"}
                  >
                    <TextField
                      label="Nombre"
                      fullWidth
                      required
                      helperText="Escribe el nombre de la categoría."
                      margin="normal"
                      name="categoria"
                    />
                  </AddButton>
                  <EditCategoryButton
                    ids={IDCategoria}
                    data={categorias}
                    ClickHandler={() => getCategoria()}
                    Loading={setLoadingCategories}
                  />
                  <DeleteCategoryButton
                    ids={IDCategoria}
                    ClickHandler={() => getCategoria()}
                    Loading={setLoadingCategories}
                  />
                </ButtonGroup>
              </Box>
              <DataGrid
                autoHeight
                rows={categorias}
                columns={categoriaCols}
                checkboxSelection
                loading={loadingCategories}
                disableMultipleRowSelection
                onRowSelectionModelChange={(id) => {
                  const selected: GridRowSelectionModel = id;
                  setIDCategoria(selected);
                }}
              />

              <Typography variant="h4" className=" py-4">
                Estados
              </Typography>
              <Box marginBottom={2}>
                <ButtonGroup>
                  {/* Grupo de Acciones Estados*/}
                  <AddButton
                    ClickHandler={() => getEstados()}
                    Loading={setLoadingStates}
                    title="Añadir Estado"
                    endPoint="/api/create_status/"
                  >
                    <TextField
                      label="Nombre"
                      fullWidth
                      required
                      helperText="Escribe el nombre del estado."
                      margin="normal"
                      name="estatus"
                    />
                  </AddButton>
                  <EditStateButton
                    ids={IDEstado}
                    data={estados}
                    ClickHandler={() => getEstados()}
                    Loading={setLoadingStates}
                  />
                  <DeleteStateButton
                    ids={IDEstado}
                    ClickHandler={() => getEstados()}
                    Loading={setLoadingStates}
                  />
                </ButtonGroup>
              </Box>

              <DataGrid
                autoHeight
                rows={estados}
                columns={estadosCols}
                checkboxSelection
                loading={loadingStates}
                disableMultipleRowSelection
                onRowSelectionModelChange={(id) => {
                  const selected: GridRowSelectionModel = id;
                  setIDEstado(selected);
                }}
              />

              <Typography variant="h4" className=" py-4">
                Áreas
              </Typography>
              <Box marginBottom={2}>
                <ButtonGroup>
                  {/* Grupo de Acciones Areas*/}
                  <AddButton
                    ClickHandler={() => getAreas()}
                    Loading={setLoadingAreas}
                    title="Añadir Área"
                    endPoint="/api/create_area/"
                  >
                    <TextField
                      label="Nombre"
                      fullWidth
                      required
                      helperText="Escribe el nombre del área."
                      margin="normal"
                      name="area"
                    />
                  </AddButton>
                  <EditAreaButton
                    ids={IDArea}
                    data={areas}
                    ClickHandler={() => getAreas()}
                    Loading={setLoadingAreas}
                  />
                  <DeleteAreaButton
                    ids={IDArea}
                    ClickHandler={() => getAreas()}
                    Loading={setLoadingAreas}
                  />
                </ButtonGroup>
              </Box>

              <DataGrid
                autoHeight
                rows={areas}
                columns={areasCols}
                checkboxSelection
                loading={loadingAreas}
                disableMultipleRowSelection
                onRowSelectionModelChange={(id) => {
                  const selected: GridRowSelectionModel = id;
                  setIDArea(selected);
                }}
              />
              <Typography variant="h4" className=" py-4">
                Unidades de Medida
              </Typography>
              <Box marginBottom={2}>
                <ButtonGroup>
                  {/* Grupo de Acciones Unidad Medida*/}
                  <AddButton
                    ClickHandler={() => getUnidadMedida()}
                    Loading={setLoadingUnidadMedida}
                    title={"Añadir Unidad de Medida"}
                    endPoint={"/api/create_unidad_medida/"}
                  >
                    <TextField
                      label="Nombre"
                      fullWidth
                      required
                      helperText="Escribe la unidad de medida nueva."
                      margin="normal"
                      name="unidad_medida"
                    />
                  </AddButton>
                  <EditCategoryButton
                    ids={IDCategoria}
                    data={categorias}
                    ClickHandler={() => getCategoria()}
                    Loading={setLoadingCategories}
                  />
                  <DeleteCategoryButton
                    ids={IDCategoria}
                    ClickHandler={() => getCategoria()}
                    Loading={setLoadingCategories}
                  />
                </ButtonGroup>
              </Box>
              <DataGrid
                autoHeight
                rows={unidadMedida}
                columns={unidadMedidaCols}
                checkboxSelection
                loading={loadingUnidadMedida}
                disableMultipleRowSelection
                onRowSelectionModelChange={(id) => {
                  const selected: GridRowSelectionModel = id;
                  setIDUnidadMedida(selected);
                }}
              />
            </>
          ) : (
            <Typography>
              Solo el administrador puede ver los catálogos.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}

interface resetInterface {
  ClickHandler: Function;
  Loading: Function;
  children?: ReactNode;
  title?: string;
  endPoint?: string;
}

interface IDProps extends resetInterface {
  ids: GridRowSelectionModel;
  data?: GridRowsProp;
}

function AddButton(reset: resetInterface) {
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

            reset.Loading(true);
            API.post(reset.endPoint ?? "", formJson).then((response) => {
              console.log(response);
              reset.ClickHandler();
              reset.Loading(false);
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
          {reset.title}
        </DialogTitle>
        <DialogContent draggable>
          {/* Contenido */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>{reset.children}</Box>
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

function EditCategoryButton(props: IDProps) {
  const [open, setOpen] = React.useState(false);
  const id: number = +props.ids[0];
  var nameCategoria: string = "";

  if (!(id === -1 || Number.isNaN(id))) {
    props.data?.map((data) => {
      if (data.id === id) {
        nameCategoria = data.categoria;
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
            //const test = formJson;
            //console.log(test);
            props.Loading(true);
            API.post("/api/edit_category/", formJson).then((response) => {
              console.log(response);
              props.ClickHandler();
              props.Loading(false);
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
          Editar Categoría
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
                    name="id_category"
                    value={id}
                    type="number"
                    helperText="No se puede cambiar el ID."
                  />
                  <TextField
                    label="Nombre"
                    fullWidth
                    required
                    helperText="Modifica el nombre de la categoría."
                    margin="normal"
                    name="categoria"
                    defaultValue={nameCategoria}
                  />
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

function DeleteCategoryButton(props: IDProps) {
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
          Eliminar Categoría
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
                  Se eliminará la categoría con el siguiente ID: <b>{id}</b>
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
                    id_category: id,
                  };

                  const contentJson = content as any;

                  props.Loading(true);
                  API.post("/api/delete_category/", contentJson).then(
                    (response) => {
                      console.log(response);
                      props.ClickHandler();
                      props.Loading(false);
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

function EditStateButton(props: IDProps) {
  const [open, setOpen] = React.useState(false);
  const id: number = +props.ids[0];
  var nameEstado: string = "";

  if (!(id === -1 || Number.isNaN(id))) {
    props.data?.map((data) => {
      if (data.id === id) {
        nameEstado = data.estatus;
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
            const test = formJson;
            console.log(test);

            props.Loading(true);
            API.post("/api/edit_status/", formJson).then((response) => {
              console.log(response);
              props.ClickHandler();
              props.Loading(false);
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
          Editar Estado
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
                    name="id_status"
                    value={id}
                    type="number"
                    helperText="No se puede cambiar el ID."
                  />
                  <TextField
                    label="Nombre"
                    fullWidth
                    required
                    helperText="Modifica el nombre del estado."
                    margin="normal"
                    name="estatus"
                    defaultValue={nameEstado}
                  />
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

function DeleteStateButton(props: IDProps) {
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
          Eliminar Estado
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
                  Se eliminará el estado con el siguiente ID: <b>{id}</b>
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
                    id_status: id,
                  };

                  const contentJson = content as any;

                  props.Loading(true);
                  API.post("/api/delete_status/", contentJson).then(
                    (response) => {
                      console.log(response);
                      props.ClickHandler();
                      props.Loading(false);
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

function EditAreaButton(props: IDProps) {
  const [open, setOpen] = React.useState(false);
  const id: number = +props.ids[0];
  var nameArea: string = "";

  if (!(id === -1 || Number.isNaN(id))) {
    props.data?.map((data) => {
      if (data.id === id) {
        nameArea = data.area;
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
            const test = formJson;
            console.log(test);

            props.Loading(true);
            API.post("/api/edit_area/", formJson).then((response) => {
              console.log(response);
              props.ClickHandler();
              props.Loading(false);
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
          Editar Área
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
                    name="id_area"
                    value={id}
                    type="number"
                    helperText="No se puede cambiar el ID."
                  />
                  <TextField
                    label="Nombre"
                    fullWidth
                    required
                    helperText="Modifica el nombre del área."
                    margin="normal"
                    name="area"
                    defaultValue={nameArea}
                  />
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

function DeleteAreaButton(props: IDProps) {
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
          Eliminar Área
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
                  Se eliminará el área con el siguiente ID: <b>{id}</b>
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
                    id_area: id,
                  };

                  const contentJson = content as any;

                  props.Loading(true);
                  API.post("/api/delete_area/", contentJson).then(
                    (response) => {
                      console.log(response);
                      props.ClickHandler();
                      props.Loading(false);
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
