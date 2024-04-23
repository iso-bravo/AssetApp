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
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
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
  const [IDAsset, setIDAsset] = useState<GridRowSelectionModel>([-1]);
  const [autosize, setAutosize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(autosize);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/asset_all/")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del servidor:", error);
      });
  }, []);

  function getAssets() {
    axios
      .get("http://127.0.0.1:8000/api/asset_all/")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos del servidor:", error);
      });
  }

  const exportCSV = () => {
    API.get("/api/export_csv/", { responseType: "blob" }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "assets.csv");
      document.body.appendChild(link);
      link.click();
    });
  };

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
              <AddAssetDialogButton
                ClickHandler={() => {
                  getAssets();
                }}
                Autosize={setAutosize}
                Loading={setLoading}
              />
              <EditAssetDialogButton />
              <DeleteAssetButton
                ids={IDAsset}
                Loading={setLoading}
                ClickHandler={() => {
                  getAssets();
                }}
                Autosize={setAutosize}
              />
              <Button
                endIcon={<ExportIcon />}
                variant="outlined"
                onClick={exportCSV}
              >
                Exportar
              </Button>
            </ButtonGroup>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            loading={loading}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            disableMultipleRowSelection
            onRowSelectionModelChange={(id) => {
              const selected: GridRowSelectionModel = id;
              setIDAsset(selected);
            }}
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

interface resetInterface {
  ClickHandler: Function; //(event: React.MouseEvent<HTMLButtonElement>) => void;
  Autosize: Function;
  Loading: Function;
}

interface IDProps extends resetInterface {
  ids: GridRowSelectionModel;
}

function AddAssetDialogButton(props: resetInterface) {
  const [categories, setCategories] = useState<Options[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [users, setUsers] = useState<Options[]>([]);
  const [areas, setAreas] = useState<Options[]>([]);
  const [file, setFile] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [imageURL, setImageURL] = useState<string>("");

  function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    }
    const file = target.files[0];
    setImageURL(URL.createObjectURL(file));
    setImage(file);
  }

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/categories/")
      .then((response) => {
        const mappedCategories = response.data.map((item: ServerCategory) => ({
          value: item.id.toString(),
          label: item.categoria,
        }));
        setCategories(mappedCategories);
      })
      .catch((error) => {
        console.error("Error al obtener categorías del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/states/")
      .then((response) => {
        const mappedStates = response.data.map((item: ServerStatus) => ({
          value: item.id.toString(),
          label: item.estatus,
        }));
        setStatus(mappedStates);
      })
      .catch((error) => {
        console.error("Error al obtener estados del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then((response) => {
        const mappedUsers = response.data.map((item: ServerUser) => ({
          value: item.id.toString(),
          label: item.nombre,
        }));
        setUsers(mappedUsers);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios del servidor:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/areas/")
      .then((response) => {
        const mappedAreas = response.data.map((item: ServerArea) => ({
          value: item.id.toString(),
          label: item.area,
        }));
        setAreas(mappedAreas);
      })
      .catch((error) => {
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
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            console.log(formJson);

            const data = {
              descripcion: formJson.descripcion,
              factura_pedimientoPDF: formJson.factura_pedimientoPDF,
              id_area: formJson.id_area,
              id_categoria: formJson.id_categoria,
              id_estatus: formJson.id_estatus,
              id_usuario: formJson.id_usuario,
              imagen: file,
              marca: formJson.marca,
              modelo: formJson.modelo,
              noFactura_pedimiento: formJson.noFactura_pedimento,
              numero_serie: formJson.numero_serie,
              tipo_compra: formJson.tipo_compra,
            };

            props.Loading(true);

            try {
              if (!image) return;
              const imageData = new FormData();
              imageData.append("image", image);
              
              // falta endpoint para subir imagenes a directorio local

              //const { data } = await axios.post("/api/image", formData);
              //console.log(data);
            } catch (error: any) {
              console.log(error.response?.data);
            }

            API.post("/api/create_asset/", data).then((response) => {
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
          Añadir Asset
        </DialogTitle>
        <DialogContent draggable>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <TextField
              label="Número de serie"
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
              defaultValue={""}
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
              defaultValue={""}
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
              defaultValue={""}
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
              defaultValue={""}
            >
              {areas.map((area) => (
                <MenuItem key={area.value} value={area.value}>
                  {area.label}
                </MenuItem>
              ))}
            </TextField>
            <InputLabel>Imagen: </InputLabel>
            {/*<TextField
              type="file"
              fullWidth
              required
              helperText="Adjunta una imagen."
              margin="normal"
              aria-labelledby="Modelo"
              name="imagen"
              onChange={(e) => {
                setFile(e.target.name);
              }}
            />*/}
            <Box>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  const pathImage = e.target.value;
                  var titleImage = pathImage.slice(pathImage.indexOf("h") + 2);

                  var fileName = titleImage;
                  var idxDot = fileName.lastIndexOf(".") + 1;
                  var extFile = fileName.slice(idxDot).toLowerCase();
                  if (
                    extFile == "jpg" ||
                    extFile == "jpeg" ||
                    extFile == "png"
                  ) {
                    setFile(titleImage);
                    console.log(titleImage);
                    handleImage(e);
                    console.log(image);

                  } else {
                    alert("Solo jpg/jpeg y png son permitidos.");
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
          <Button color="error" variant="contained" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
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

function DeleteAssetButton(props: IDProps) {
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
                    id: id,
                  };

                  const contentJson = content as any;
                  props.Loading(true);
                  API.post("/api/delete_asset/", contentJson).then(
                    (response) => {
                      console.log(response);
                      props.ClickHandler();
                      props.Autosize(true);
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
