import React, { useState, useEffect, useContext } from "react";
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
  Paper,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowSelectionModel,
  GridToolbar,
} from "@mui/x-data-grid";
import NavegatorDrawer from "../components/NavegatorDrawer";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExportIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImportIcon from "@mui/icons-material/Download";
import { API } from "./Home";
import AssetDetails from "../components/AssetDetails";
import { Details } from "../components/AssetDetails";
import PDFIcon from "@mui/icons-material/PictureAsPdf";
import DetailsIcon from "@mui/icons-material/Info";

// Solución si Etiquetas.pdf existe
import PDF from "../../../server/api/labels_pdf/Etiquetas.pdf";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import AuthContext from "../auth/Auth";

// Función para descargar solo las etiquetas de los Assets seleccionados en un PDF
const downloadSelectedPages = async (pages: Array<number>) => {
  const existingPdfBytes = await fetch(PDF).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const newPdfDoc = await PDFDocument.create();
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, pages);

  copiedPages.forEach((page) => newPdfDoc.addPage(page));

  const pdfBytes = await newPdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, "Etiquetas_seleccionadas.pdf");
};

// Definir columnas para la tabla de datos
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "numero_serie", headerName: "Número de serie", width: 150 },
  { field: "modelo", headerName: "Modelo", width: 150 },
  { field: "marca", headerName: "Marca", width: 150 },
  { field: "id_categoria", headerName: "Categoría", width: 150 },
  { field: "id_estatus", headerName: "Estatus", width: 150 },
];

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

// Vista Assets
export default function Assets() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [IDAsset, setIDAsset] = useState<GridRowSelectionModel>([-1]);

  // Ocupo los IDs en una lista de este tipo para descargar las etiquetas
  const IDS: Array<Number> = [];
  IDAsset.map((id) => {
    const element: Number = +id;
    IDS.push(element);
  });

  // Se le tiene que pasar una lista de páginas a la función de descargar etiquetas por Asset

  // Aquí se obtiene una lista con los números de página que corresponde a las
  // etiquetas de los Assets seleccionados, esta es la que se le pasa a la
  // función downloadSelectedPages

  const pages: Array<number> = [];
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i];
    for (let j = 0; j < IDS.length; j++) {
      if (IDS[j] === element["id"]) {
        pages.push(i);
      }
    }
  }

  // TEST
  //console.log(pages);

  //const [autosize, setAutosize] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<Details>({
    Description: "",
    Factura: "",
    id: 0,
    Fecha_Registro: "",
    ID_Area: "0",
    ID_Categoria: "0",
    ID_Estatus: "0",
    ID_Usuario: "0",
    Imagen: "",
    Marca: "",
    Modelo: "",
    No_Factura: "",
    Number_Serie: "",
    Tipo_Compra: "",
    noPedimento: "",
    pais_origen: "",
  });

  function updateAssets() {
    axios
      .get("http://127.0.0.1:8000/api/asset_all/")
      .then(async (response) => {
        let composeData: GridRowsProp = response.data;

        // Get categories
        const categories: GridRowsProp = await API.get("/api/categories/")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });

        // Get states
        const states: GridRowsProp = await API.get("/api/states/")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching states:", error);
          });

        // Get areas
        const areas: GridRowsProp = await API.get("/api/areas/")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching areas:", error);
          });

        // Get usuarios
        const usuarios: GridRowsProp = await API.get("/api/users/")
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });

        // TEST
        //console.log(categories);
        //console.log(states);
        //console.log(areas);

        // Asignación por ID en función map
        composeData.map((asset) => {
          // Asignación categoría por ID
          categories.map((category) => {
            if (category.id === asset.id_categoria) {
              asset.id_categoria = category.categoria;
            }
          });

          // Asignación estado por ID
          states.map((state) => {
            if (state.id === asset.id_estatus) {
              asset.id_estatus = state.estatus;
            }
          });

          // Asignación areas por ID
          areas.map((area) => {
            if (area.id === asset.id_area) {
              asset.id_area = area.area;
            }
          });

          // Asignación usuario por ID
          usuarios.map((usuario) => {
            if (usuario.id === asset.id_usuario) {
              asset.id_usuario = usuario.nombre;
            }
          });
        });

        // Set rows
        setRows(composeData);
      })
      .catch((error) => {
        console.error("Error al obtener datos del servidor:", error);
      });
  }
  // Asignación de la información que se despliega en la tabla
  useEffect(() => {
    updateAssets();
  }, []);

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

  const [permiso, setPermiso] = useState<String>("viewer");

  // Obtener sesión actual
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.user) {
    throw new Error("useContext must be used within an AuthProvider");
  }

  // Usuario autenticado
  const username: String = authContext.user.username;

  // Permisos del usuario autenticado
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
  }, []);

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
              {/* Grupo de botones para manipular y visualizar los datos */}
              {permiso === "admin" || permiso === "register" ? (
                <AddAssetDialogButton
                  ClickHandler={() => {
                    updateAssets();
                  }}
                  //Autosize={setAutosize}
                  Loading={setLoading}
                />
              ) : (
                <></>
              )}
              <EditAssetDialogButton
                data={details}
                ids={IDAsset}
                ClickHandler={() => {
                  updateAssets();
                }}
                //Autosize={setAutosize}
                Loading={setLoading}
              />
              {permiso === "admin" ? (
                <DeleteAssetButton
                  ids={IDAsset}
                  Loading={setLoading}
                  ClickHandler={() => {
                    updateAssets();
                  }}
                  //Autosize={setAutosize}
                />
              ) : (
                <></>
              )}
              {!(IDAsset.length > 1) ? (
                <AssetDetails asset={details} />
              ) : (
                <Button
                  variant="contained"
                  onClick={() =>
                    alert("No se pueden seleccionar multiples assets.")
                  }
                  color="info"
                  endIcon={<DetailsIcon />}
                >
                  Detalles
                </Button>
              )}
            </ButtonGroup>

            {permiso === "admin" ? (
              <ButtonGroup>
                <Button
                  endIcon={<ExportIcon />}
                  variant="outlined"
                  onClick={exportCSV}
                >
                  Exportar
                </Button>
                <ImportAssetButton
                  ClickHandler={() => {
                    updateAssets();
                  }}
                  //Autosize={setAutosize}
                  Loading={setLoading}
                />
                {
                  // Aquí se cambia de un botón de ETIQUETAS a otro dependiendo de los Assets seleccionados
                  // Si no se selecciona nada entonces se descargan todas las etiquetas
                  // Si se seleccionan entonces se ejecuta la función downloadSelectedPages y se
                  // descargan solo las etiquetas seleccionadas en un mismo PDF
                  IDAsset[0] === -1 || IDAsset.length === 0 ? (
                    <a href={PDF} download>
                      <Paper
                        style={{
                          width: 202,
                          height: 40,
                          alignItems: "center",
                          alignContent: "center",
                          textAlign: "center",
                          backgroundColor: "tomato",
                          color: "white",
                          paddingLeft: "10%",
                          paddingRight: "10%",
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <ImportIcon />
                          <div>ETIQUETAS</div>
                          <PDFIcon />
                        </Stack>
                      </Paper>
                    </a>
                  ) : (
                    <button
                      onClick={() => downloadSelectedPages(pages)}
                      style={{ width: 202 }}
                    >
                      <Paper
                        style={{
                          height: 40,
                          alignItems: "center",
                          alignContent: "center",
                          textAlign: "center",
                          backgroundColor: "orangered",
                          color: "white",
                          paddingLeft: "10%",
                          paddingRight: "10%",
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <ImportIcon />
                          <div>ETIQUETAS</div>
                          <PDFIcon />
                        </Stack>
                      </Paper>
                    </button>
                  )
                }
              </ButtonGroup>
            ) : (
              <></>
            )}
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            onRowSelectionModelChange={(id) => {
              const selected: GridRowSelectionModel = id;
              setIDAsset(selected);
              if (selected[0] !== undefined) {
                rows.map((row) => {
                  if (row.id === selected[0]) {
                    setDetails({
                      id: row.id,
                      Description: row.descripcion,
                      Factura: row.factura_pedimentoPDF,
                      Fecha_Registro: row.fecha_registro,
                      ID_Area: row.id_area,
                      ID_Categoria: row.id_categoria,
                      ID_Estatus: row.id_estatus,
                      ID_Usuario: row.id_usuario,
                      Imagen: row.imagen,
                      Marca: row.marca,
                      Modelo: row.modelo,
                      No_Factura: row.noFactura,
                      Number_Serie: row.numero_serie,
                      Tipo_Compra: row.tipo_compra,
                      noPedimento: row.noPedimento,
                      pais_origen: row.pais_origen,
                    });
                  }
                });
              } else {
                setDetails({
                  Description: "",
                  Factura: "",
                  id: 0,
                  Fecha_Registro: "",
                  ID_Area: "0",
                  ID_Categoria: "0",
                  ID_Estatus: "0",
                  ID_Usuario: "0",
                  Imagen: "",
                  Marca: "",
                  Modelo: "",
                  No_Factura: "",
                  Number_Serie: "",
                  Tipo_Compra: "",
                  noPedimento: "",
                  pais_origen: "",
                });
              }
            }}
          />
        </Box>
      </Container>
    </>
  );
}

// Tipos e interfaces
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
  ClickHandler: Function;
  //Autosize: Function;
  Loading: Function;
}

interface IDProps extends resetInterface {
  ids: GridRowSelectionModel;
  data?: GridRowsProp;
}

interface editProps extends resetInterface {
  ids: GridRowSelectionModel;
  data: Details;
}

function AddAssetDialogButton(props: resetInterface) {
  const [categories, setCategories] = useState<Options[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [users, setUsers] = useState<Options[]>([]);
  const [areas, setAreas] = useState<Options[]>([]);
  const [file, setFile] = useState<string>("");
  const [pdf, setPDF] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [filePDF, setFilePDF] = useState<File | undefined>();
  // const [imageURL, setImageURL] = useState<string>("");

  function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    // const blop = URL.createObjectURL(file);
    // setImageURL(blop);
    // console.log(blop);
    setImage(file);
  }
  function handlePDF(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    // const blop = URL.createObjectURL(file);
    // setImageURL(blop);
    // console.log(blop);
    setFilePDF(file);
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
            //console.log(formJson);

            const data = {
              descripcion: formJson.descripcion,
              factura_pedimientoPDF: pdf,
              id_area: formJson.id_area,
              id_categoria: formJson.id_categoria,
              id_estatus: formJson.id_estatus,
              id_usuario: formJson.id_usuario,
              imagen: file,
              marca: formJson.marca,
              modelo: formJson.modelo,
              noFactura: formJson.noFactura,
              numero_serie: formJson.numero_serie,
              tipo_compra: formJson.tipo_compra,
              noPedimento: formJson.noPedimento,
              pais_origen: formJson.pais_origen,
            };

            props.Loading(true);

            try {
              if (!image) return;
              const imageData = new FormData();
              imageData.append("image", image);

              const { data } = await API.post("/api/upload_file/", imageData);
              console.log(data);
            } catch (error: any) {
              console.log(error.response?.data);
            }
            try {
              if (!filePDF) return;
              const pdfData = new FormData();
              pdfData.append("pdf", filePDF);

              const { data } = await API.post("/api/upload_file/", pdfData);
              console.log(data);
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
              label="Número de pedimento"
              fullWidth
              helperText="Escribe el número de pedimento."
              margin="normal"
              name="noPedimento"
            />
            <TextField
              label="País de origen"
              fullWidth
              required
              helperText="Escribe el país de origen."
              multiline
              margin="normal"
              name="pais_origen"
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
              helperText="Indica la categoria."
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
              label="No. de factura"
              fullWidth
              required
              helperText="Escribe el número de factura."
              multiline
              margin="normal"
              aria-labelledby="Modelo"
              name="noFactura"
            />
            <InputLabel>Factura PDF: </InputLabel>
            <Box>
              <input
                type="file"
                name="factura_pedimientoPDF"
                onChange={(e) => {
                  const pathPDF = e.target.value;
                  var titlePDF = pathPDF.slice(pathPDF.indexOf("h") + 2);

                  var fileName = titlePDF;
                  var idxDot = fileName.lastIndexOf(".") + 1;
                  var extFile = fileName.slice(idxDot).toLowerCase();
                  if (
                    extFile == "pdf"
                  ) {
                    setPDF(titlePDF);
                    console.log(titlePDF);
                    handlePDF(e);
                    console.log(pdf);
                  } else {
                    alert("Solo pdf es permitido.");
                  }
                }}
              />
            </Box>
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

function EditAssetDialogButton(props: editProps) {
  const [categories, setCategories] = useState<Options[]>([]);
  const [status, setStatus] = useState<Options[]>([]);
  const [users, setUsers] = useState<Options[]>([]);
  const [areas, setAreas] = useState<Options[]>([]);
  const [file, setFile] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [categorySelectedValue, setCategorySelectedValue] = useState("");
  const [userSelectedValue, setUserSelectedValue] = useState("");
  const [stateSelectedValue, setStateSelectedValue] = useState("");
  const [areaSelectedValue, setAreaSelectedValue] = useState("");

  function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setImage(file);
  }

  const asset = props.data;

  useEffect(() => {
    API.get("/api/categories/")
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

  API.get("/api/categories/")
    .then((response) => {
      var categorySelected = "";
      response.data.map((category: ServerCategory) => {
        if (asset.ID_Categoria === category.categoria) {
          categorySelected = category.id.toString();
        }
      });
      setCategorySelectedValue(categorySelected);
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
    });

  useEffect(() => {
    API.get("/api/states/")
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

  API.get("/api/states/")
    .then((response) => {
      var stateSelected = "";
      response.data.map((state: ServerStatus) => {
        if (asset.ID_Estatus === state.estatus) {
          stateSelected = state.id.toString();
        }
      });
      setStateSelectedValue(stateSelected);
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
    });

  useEffect(() => {
    API.get("/api/users/")
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

  API.get("/api/users/")
    .then((response) => {
      var userSelected = "";
      response.data.map((user: ServerUser) => {
        if (asset.ID_Usuario === user.nombre) {
          userSelected = user.id.toString();
        }
      });
      setUserSelectedValue(userSelected);
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
    });

  useEffect(() => {
    API.get("/api/areas/")
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

  API.get("/api/areas/")
    .then((response) => {
      var areaSelected = "";
      response.data.map((area: ServerArea) => {
        if (asset.ID_Area === area.area) {
          areaSelected = area.id.toString();
        }
      });
      setAreaSelectedValue(areaSelected);
    })
    .catch((error) => {
      console.error("Error fetching departments:", error);
    });

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
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());

            const data = {
              id: formJson.id,
              descripcion: formJson.descripcion,
              factura_pedimientoPDF: formJson.factura_pedimientoPDF,
              id_area: formJson.id_area,
              id_categoria: formJson.id_categoria,
              id_estatus: formJson.id_estatus,
              id_usuario: formJson.id_usuario,
              imagen: file,
              marca: formJson.marca,
              modelo: formJson.modelo,
              noFactura: formJson.noFactura,
              numero_serie: formJson.numero_serie,
              tipo_compra: formJson.tipo_compra,
              noPedimento: formJson.noPedimento,
              pais_origen: formJson.pais_origen,
            };

            console.log(data);

            props.Loading(true);

            try {
              if (!image) {
                console.log("No image");
              } else {
                const imageData = new FormData();
                imageData.append("image", image);

                const { data } = await API.post("/api/upload_file/", imageData);
                console.log(data);
              }
            } catch (error: any) {
              console.log(error.response?.data);
            }

            API.post("/api/edit_asset/", data).then((response) => {
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
          Editar Asset
        </DialogTitle>
        <DialogContent draggable>
          <Box padding={4}>
            {id === -1 || Number.isNaN(id) || props.ids.length > 1 ? (
              <>
                {id === -1 || Number.isNaN(id) ? (
                  <Typography variant="h6">
                    No se ha seleccionado ningún ID.
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    No se pueden editar más de un asset a la vez.
                  </Typography>
                )}
              </>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <TextField
                  label="ID"
                  required
                  margin="normal"
                  name="id"
                  value={id}
                  type="number"
                  helperText="No se puede cambiar el ID."
                />
                <TextField
                  label="Número de serie"
                  fullWidth
                  required
                  helperText="Escribe el número de serie."
                  margin="normal"
                  name="numero_serie"
                  defaultValue={asset.Number_Serie}
                />
                <TextField
                  label="Número de pedimento"
                  fullWidth
                  required
                  helperText="Escribe el número de pedimento."
                  margin="normal"
                  name="noPedimento"
                  defaultValue={asset.noPedimento}
                />
                <TextField
                  label="País de origen"
                  fullWidth
                  required
                  helperText="Escribe el país de origen."
                  multiline
                  margin="normal"
                  name="pais_origen"
                  defaultValue={asset.pais_origen}
                />
                <TextField
                  label="Modelo"
                  fullWidth
                  required
                  helperText="Escribe el modelo del producto."
                  multiline
                  margin="normal"
                  name="modelo"
                  defaultValue={asset.Modelo}
                />
                <TextField
                  label="Descripción"
                  fullWidth
                  required
                  helperText="Agrega una descripción."
                  multiline
                  margin="normal"
                  name="descripcion"
                  defaultValue={asset.Description}
                />
                <TextField
                  label="Marca"
                  fullWidth
                  required
                  helperText="Indica la marca."
                  multiline
                  margin="normal"
                  name="marca"
                  defaultValue={asset.Marca}
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
                  defaultValue={stateSelectedValue}
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
                  helperText="Indica la categoria."
                  multiline
                  margin="normal"
                  name="id_categoria"
                  defaultValue={categorySelectedValue}
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
                  defaultValue={asset.Tipo_Compra}
                />
                <TextField
                  label="No. de factura"
                  fullWidth
                  helperText="Escribe el número de factura."
                  multiline
                  margin="normal"
                  aria-labelledby="Modelo"
                  name="noFactura"
                  defaultValue={asset.No_Factura}
                />
                <TextField
                  label="Factura PDF"
                  fullWidth
                  helperText="Adjunta la factura."
                  multiline
                  margin="normal"
                  aria-labelledby="Modelo"
                  name="factura_pedimientoPDF"
                  defaultValue={asset.Factura}
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
                  defaultValue={userSelectedValue}
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
                  defaultValue={areaSelectedValue}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.value} value={area.value}>
                      {area.label}
                    </MenuItem>
                  ))}
                </TextField>
                <InputLabel>Imagen: </InputLabel>
                <Box>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const pathImage = e.target.value;
                      var titleImage = pathImage.slice(
                        pathImage.indexOf("h") + 2
                      );

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
            )}
          </Box>
        </DialogContent>
        <DialogActions style={{ padding: 20 }}>
          {!(id === -1 || Number.isNaN(id) || props.ids.length > 1) ? (
            <>
              <Button type="submit" variant="contained" color="primary">
                Enviar
              </Button>
              <Button color="error" variant="contained" onClick={handleClose}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button color="error" variant="contained" onClick={handleClose}>
              Cancelar
            </Button>
          )}
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
            {id === -1 || Number.isNaN(id) || props.ids.length > 1 ? (
              <>
                {id === -1 || Number.isNaN(id) ? (
                  <Typography variant="h6">
                    No se ha seleccionado ningún ID.
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    No se puede eliminar multiples assets.
                  </Typography>
                )}
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
          {id === -1 || Number.isNaN(id) || props.ids.length > 1 ? (
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
                      //props.Autosize(true);
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

function ImportAssetButton(props: resetInterface) {
  const [open, setOpen] = React.useState(false);
  const [fileCSV, setFileCSV] = useState<File | undefined>();
  // const [fileName, setFileName] = useState<string>("");

  function handleFile(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    // const blop = URL.createObjectURL(file);
    // setImageURL(blop);
    // console.log(blop);
    setFileCSV(file);
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
        variant="outlined"
        onClick={handleClickOpen}
        color="success"
        endIcon={<ImportIcon />}
      >
        Importar
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
            props.Loading(true);
            // const blop = URL.createObjectURL(file);
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
            if (!fileCSV) {
              alert(
                "No se seleccionó ningún archivo o el tipo de archivo no es csv."
              );
              return;
            }
            const csvJson = new FormData();
            csvJson.append("csv", fileCSV);
            API.post("/api/import_file/", csvJson).then((response) => {
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
          Importar Assets
        </DialogTitle>
        <DialogContent draggable>
          <Box padding={4}>
            <InputLabel>CSV: </InputLabel>
            <Box>
              <input
                type="file"
                name="csv"
                // .xlsx, .xls, & .csv
                accept=".csv"
                onChange={(e) => {
                  const pathFile = e.target.value;
                  var titleFile = pathFile.slice(pathFile.indexOf("h") + 2);
                  var idxDot = titleFile.lastIndexOf(".") + 1;
                  var extFile = titleFile.slice(idxDot).toLowerCase();
                  console.log(titleFile);
                  if (extFile == "csv") {
                    // setFileName(titleFile);
                    handleFile(e);
                  } else {
                    alert("Solo .xlsx, .xls, & .csv es permitido.");
                    // setFileName("Archivo no válido");
                    setFileCSV(undefined);
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions style={{ marginBottom: 3, marginRight: 5 }}>
          <Button title="Enviar" variant="contained" type="submit">
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
        </DialogActions>
      </Dialog>
    </>
  );
}
