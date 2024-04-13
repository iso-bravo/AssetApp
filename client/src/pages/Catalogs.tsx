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
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ExportIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ReloadIcon from "@mui/icons-material/Refresh";
import React from "react";
import { API } from "./Home";

//Componente de la vista de Catálogos
export default function CatalogsPage() {
  const [categorias, setCategorias] = useState<GridRowsProp>([]);
  const [estados, setEstados] = useState<GridRowsProp>([]);
  const [areas, setAreas] = useState<GridRowsProp>([]);

  function getCategoria() {
    useEffect(() => {
      API.get("/api/categories/")
        .then((response) => {
          setCategorias(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }, []);
  }

  function getEstados() {
    useEffect(() => {
      API.get("/api/states/")
        .then((response) => {
          setEstados(response.data);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }, []);
  }

  function getAreas() {
    useEffect(() => {
      API.get("/api/areas/")
        .then((response) => {
          setAreas(response.data);
        })
        .catch((error) => {
          console.error("Error fetching areas:", error);
        });
    }, []);
  }

  getCategoria();
  getEstados();
  getAreas();

  const [IDCategoria, setIDCategoria] = useState<number>(0);
  const [IDEstado, setIDEstado] = useState<number>(0);
  const [IDArea, setIDArea] = useState<number>(0);


  console.log(IDCategoria);

  const categoria: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "categoria", headerName: "Categoría", width: 150 },
  ];

  const estadosCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "estatus", headerName: "Estados", width: 150 },
  ];

  const areasCols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "area", headerName: "Áreas", width: 150 },
  ];

  return (
    <>
      <NavegatorDrawer />
      <Container>
        <Box marginTop={3} marginBottom={10} marginLeft={30} minWidth={100}>
          <Typography variant="h4" className=" py-4">
            Categorias
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones Categoria*/}
              <AddCategoryButton />
              <EditCategoryButton />
              <Button
                endIcon={<DeleteIcon />}
                color="error"
                variant="contained"
              >
                Eliminar
              </Button>
            </ButtonGroup>
          </Box>
          <IconButton onClick={() => getCategoria()}>
            <ReloadIcon />
          </IconButton>
          <DataGrid
            rows={categorias}
            columns={categoria}
            checkboxSelection
            disableMultipleRowSelection
            onRowSelectionModelChange={(id) => {
              // console.log(id);
              setCategorias(id);
            }}
          />

          <Typography variant="h4" className=" py-4">
            Estados
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones Estados*/}
              <AddStateButton />
              <EditStateButton />
              <Button
                endIcon={<DeleteIcon />}
                color="error"
                variant="contained"
              >
                Eliminar
              </Button>
            </ButtonGroup>
          </Box>
          <IconButton onClick={() => getEstados()}>
            <ReloadIcon />
          </IconButton>
          <DataGrid
            rows={estados}
            columns={estadosCols}
            checkboxSelection
            disableMultipleRowSelection
          />

          <Typography variant="h4" className=" py-4">
            Áreas
          </Typography>
          <Box marginBottom={2}>
            <ButtonGroup>
              {/* Grupo de Acciones Areas*/}
              <AddAreaButton />
              <EditAreaButton />
              <Button
                endIcon={<DeleteIcon />}
                color="error"
                variant="contained"
              >
                Eliminar
              </Button>
            </ButtonGroup>
          </Box>
          <IconButton onClick={() => getAreas()}>
            <ReloadIcon />
          </IconButton>
          <DataGrid
            rows={areas}
            columns={areasCols}
            checkboxSelection
            disableMultipleRowSelection
          />
        </Box>
      </Container>
    </>
  );
}
/*
interface resetInterface {
  ClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
*/
function AddCategoryButton(/*reset: resetInterface*/) {
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

            // TEST
            console.log(formJson);

            API.post("/api/create_category/", formJson).then((response) => {
              console.log(response);
              //reset.ClickHandler; // Nop
            });
            //reset.ClickHandler; // Aún no se actualizan las categorías automáticamente => Investigar
            // Probablemente es porq el reset se hace antes de que la petición POST se termine
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
          Añadir Categoría
        </DialogTitle>
        <DialogContent draggable>
          {/* Contenido */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              label="Nombre"
              fullWidth
              required
              helperText="Escribe el nombre de la categoría."
              margin="normal"
              name="categoria"
            />
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

function EditCategoryButton() {
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
          Editar Categoría
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

function AddStateButton(/*reset: resetInterface*/) {
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

            // TEST
            console.log(formJson);

            API.post("/api/create_status/", formJson).then((response) => {
              console.log(response);
              //reset.ClickHandler; // Nop
            });
            //reset.ClickHandler; // Aún no se actualizan las categorías automáticamente => Investigar
            // Probablemente es porq el reset se hace antes de que la petición POST se termine
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
          Añadir Estado
        </DialogTitle>
        <DialogContent draggable>
          {/* Contenido */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              label="Nombre"
              fullWidth
              required
              helperText="Escribe el nombre del estado."
              margin="normal"
              name="estatus"
            />
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

function EditStateButton() {
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
          Editar Estado
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

function AddAreaButton(/*reset: resetInterface*/) {
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

            // TEST
            console.log(formJson);

            API.post("/api/create_area/", formJson).then((response) => {
              console.log(response);
              //reset.ClickHandler; // Nop
            });
            //reset.ClickHandler; // Aún no se actualizan las categorías automáticamente => Investigar
            // Probablemente es porq el reset se hace antes de que la petición POST se termine
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
          Añadir Área
        </DialogTitle>
        <DialogContent draggable>
          {/* Contenido */}
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              label="Nombre"
              fullWidth
              required
              helperText="Escribe el nombre del área."
              margin="normal"
              name="area"
            />
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

function EditAreaButton() {
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
          Editar Área
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
