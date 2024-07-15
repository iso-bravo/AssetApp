import React, { useState, useEffect, useContext } from "react";
import {
  Box,
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import { degrees, PDFDocument } from "pdf-lib";
import AuthContext from "../auth/Auth";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

// Definir columnas para la tabla de datos
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "noPedimento", headerName: "Pedimento", width: 200 },
  { field: "marca", headerName: "Marca", width: 200 },
  { field: "modelo", headerName: "Modelo", width: 200 },
  { field: "numero_serie", headerName: "Número de serie", width: 200 },
  { field: "pais_origen", headerName: "País", width: 200 },
  { field: "descripcion", headerName: "Descripción", width: 200 },
  { field: "id_categoria", headerName: "Categoría", width: 200 },
  { field: "id_estatus", headerName: "Estatus", width: 200 },
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
  const [heightWidth, setHeightWidth] = useState<Array<number>>([1, 1]);

  // Función para descargar solo las etiquetas de los Assets seleccionados en un PDF
  const downloadSelectedPages = async (pages: Array<number>) => {
    const existingPdfBytes = await fetch(PDF).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdfDoc = await PDFDocument.create();

    const scaleFactorHeight = heightWidth[0];
    const scaleFactorWidth = heightWidth[1];

    for (const pageIndex of pages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
      const { width, height } = copiedPage.getSize();

      // Definir las nuevas dimensiones
      const newWidth = width * scaleFactorWidth;
      const newHeight = height * scaleFactorHeight;

      // Cambiar el tamaño de la página
      copiedPage.scaleContent(scaleFactorWidth, scaleFactorHeight);
      if (newHeight !== 72 || newWidth !== 144) {
        copiedPage.setRotation(degrees(90)); // Rotar 90 grados
      }
      copiedPage.setSize(newWidth, newHeight);

      newPdfDoc.addPage(copiedPage);
    }

    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "Etiquetas_seleccionadas.pdf");
  };

  // Descargar PDF con tamaño específico
  const modifyAndDownloadPDF = async () => {
    // Obtener el contenido del PDF importado
    const existingPdfBytes = await fetch(PDF).then((res) => res.arrayBuffer());

    // Cargar el PDF en pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Definir el factor de escala
    const scaleFactorHeight = heightWidth[0];
    const scaleFactorWidth = heightWidth[1];

    // Iterar sobre todas las páginas del PDF
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const newWidth = width * scaleFactorWidth;
      const newHeight = height * scaleFactorHeight;

      // Cambiar el tamaño de la página
      page.setSize(newWidth, newHeight);

      // Redimensionar el contenido de la página
      page.scaleContent(scaleFactorWidth, scaleFactorHeight);

      if (newHeight !== 72 || newWidth !== 144) {
        page.setRotation(degrees(90)); // Rotar 90 grados
      }
    });

    // Serializar el documento modificado a bytes
    const pdfBytes = await pdfDoc.save();

    // Crear un enlace blob para descargar el PDF
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Etiquetas.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    ID_Estado_Pedimento: "0",
    ID_Unidad_Medida: "0",
    Imagen: "",
    Marca: "",
    Modelo: "",
    No_Factura: "",
    Number_Serie: "",
    Tipo_Compra: "",
    noPedimento: "",
    pais_origen: "",
    comentarios: "",
    fecha_factura: "",
    descripcion_ingles: "",
  });

  // Lista de opciones para formularios de agregar y editar assets
  const [categoriesOptions, setCategoriesOptions] = useState<Options[]>([]);
  const [statusOptions, setStatusOptions] = useState<Options[]>([]);
  const [areasOptions, setAreasOptions] = useState<Options[]>([]);
  const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<Options[]>([]);
  const [estadoPedimentoOptions, setEstadoPedimentoOptions] = useState<
    Options[]
  >([]);
  const [usersOptions, setUsersOptions] = useState<Options[]>([]);

  function updateAssets() {
    API.get("/api/asset_all/")
      .then(async (response) => {
        let composeData: GridRowsProp = response.data;

        // Get categories
        const categories: GridRowsProp = await API.get("/api/categories/")
          .then((response) => {
            const options = response.data.map((item: ServerCategory) => ({
              value: item.id.toString(),
              label: item.categoria,
            }));
            setCategoriesOptions(options);
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
          });

        // Get states
        const states: GridRowsProp = await API.get("/api/states/")
          .then((response) => {
            const options = response.data.map((item: ServerStatus) => ({
              value: item.id.toString(),
              label: item.estatus,
            }));
            setStatusOptions(options);
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching states:", error);
          });

        // Get areas
        const areas: GridRowsProp = await API.get("/api/areas/")
          .then((response) => {
            const options = response.data.map((item: ServerArea) => ({
              value: item.id.toString(),
              label: item.area,
            }));
            setAreasOptions(options);
            return response.data;
          })
          .catch((error) => {
            console.error("Error fetching areas:", error);
          });

        // Get usuarios
        const usuarios: GridRowsProp = await API.get("/api/users/")
          .then((response) => {
            const options = response.data.map((item: ServerUser) => ({
              value: item.id.toString(),
              label: item.nombre,
            }));
            setUsersOptions(options);
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
    API.get("/api/unidad_medida/")
      .then((response) => {
        const options = response.data.map((item: ServerUnidadMedida) => ({
          value: item.id.toString(),
          label: item.unidad_medida,
        }));
        setUnidadMedidaOptions(options);
      })
      .catch((error) => {
        console.error(
          "Error al obtener unidades de medida del servidor:",
          error
        );
      });
    API.get("/api/estado_pedimento/")
      .then((response) => {
        const options = response.data.map((item: ServerEstadosPedimento) => ({
          value: item.id.toString(),
          label: item.estado_pedimento,
        }));
        setEstadoPedimentoOptions(options);
      })
      .catch((error) => {
        console.error(
          "Error al obtener estados de pedimento del servidor:",
          error
        );
      });
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
      <Grid2 container spacing={2} marginLeft={30} marginRight={5}>
        <Grid2 xs={12}>
          <Typography variant="h4" margin={2} align="left">
            Assets
          </Typography>
        </Grid2>
        <Grid2 xs={9}>
          <Stack spacing={2}>
            <ButtonGroup>
              {/* Grupo de botones para manipular y visualizar los datos */}
              {permiso === "admin" || permiso === "register" ? (
                <AddAssetDialogButton
                  ClickHandler={() => {
                    updateAssets();
                  }}
                  //Autosize={setAutosize}
                  Loading={setLoading}
                  categoriesOptions={categoriesOptions}
                  statusOptions={statusOptions}
                  areasOptions={areasOptions}
                  unidadMedidaOptions={unidadMedidaOptions}
                  estadoPedimentoOptions={estadoPedimentoOptions}
                  usersOptions={usersOptions}
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
                Loading={setLoading}
                categoriesOptions={categoriesOptions}
                statusOptions={statusOptions}
                areasOptions={areasOptions}
                unidadMedidaOptions={unidadMedidaOptions}
                estadoPedimentoOptions={estadoPedimentoOptions}
                usersOptions={usersOptions}
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
              </ButtonGroup>
            ) : (
              <></>
            )}
          </Stack>
        </Grid2>
        {permiso === "admin" ? (
          <Grid2 xs={3}>
            <button
              onClick={async () => {
                try {
                  await API.get("/api/create_pdf/");
                  if (IDAsset[0] === -1 || IDAsset.length === 0) {
                    modifyAndDownloadPDF();
                  } else {
                    downloadSelectedPages(pages);
                  }
                } catch (error) {
                  console.error("Error al hacer la solicitud:", error);
                }
              }}
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
            <FormControl style={{ margin: 12 }}>
              <FormLabel>Medidas de etiquetas</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="1"
                name="radio-buttons-group"
                row
              >
                <FormControlLabel
                  value="1"
                  control={<Radio onChange={() => setHeightWidth([1, 1])} />}
                  label="1x2"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio onChange={() => setHeightWidth([4, 3])} />}
                  label="4x6"
                />
              </RadioGroup>
            </FormControl>
          </Grid2>
        ) : (
          <></>
        )}
        <Grid2 xs={12}>
          <DataGrid
            autoHeight
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
                      ID_Estado_Pedimento: row.estado_pedimento,
                      ID_Unidad_Medida: row.unidad_medida,
                      comentarios: row.comentarios,
                      fecha_factura: row.fecha_factura,
                      descripcion_ingles: row.descripcion_ingles,
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
                  ID_Estado_Pedimento: "0",
                  ID_Unidad_Medida: "0",
                  Imagen: "",
                  Marca: "",
                  Modelo: "",
                  No_Factura: "",
                  Number_Serie: "",
                  Tipo_Compra: "",
                  noPedimento: "",
                  pais_origen: "",
                  comentarios: "",
                  fecha_factura: "",
                  descripcion_ingles: "",
                });
              }
            }}
          />
        </Grid2>
      </Grid2>
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

type ServerUnidadMedida = {
  id: number;
  unidad_medida: string;
};

type ServerEstadosPedimento = {
  id: number;
  estado_pedimento: string;
};

interface AllProps {
  ClickHandler: Function;
  Loading: Function;
}

interface AddProps extends AllProps {
  categoriesOptions: Options[];
  statusOptions: Options[];
  areasOptions: Options[];
  unidadMedidaOptions: Options[];
  estadoPedimentoOptions: Options[];
  usersOptions: Options[];
}

interface DeleteProps extends AllProps {
  ids: GridRowSelectionModel;
  data?: GridRowsProp;
}

interface editProps extends AllProps {
  categoriesOptions: Options[];
  statusOptions: Options[];
  areasOptions: Options[];
  unidadMedidaOptions: Options[];
  estadoPedimentoOptions: Options[];
  usersOptions: Options[];
  ids: GridRowSelectionModel;
  data: Details;
}

function AddAssetDialogButton(props: AddProps) {
  // Hooks para campos de opciones
  const categories: Options[] = props.categoriesOptions;
  const status: Options[] = props.statusOptions;
  const users: Options[] = props.usersOptions;
  const areas: Options[] = props.areasOptions;
  const unidadMedida: Options[] = props.unidadMedidaOptions;
  const estadosPedimento: Options[] = props.estadoPedimentoOptions;

  // Hooks para manejar archivos de imagen y pdf
  const [pdf, setPDF] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [filePDF, setFilePDF] = useState<File | undefined>();
  const [ext, setExt] = useState<string>("");

  // Funciones para manejar archivos
  function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setImage(file);
  }
  function handlePDF(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setFilePDF(file);
  }

  // Manejar estado de dialog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setPDF("");
    setImage(undefined);
    setFilePDF(undefined);
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

            console.log(formJson.fecha_factura);
            let data: {
              descripcion: string;
              descripcion_ingles: string;
              factura_pedimentoPDF?: string;
              id_area: string;
              id_categoria: string;
              id_estatus: string;
              id_usuario: string;
              imagen?: string;
              marca: string;
              modelo: string;
              noFactura: string;
              numero_serie: string;
              tipo_compra: string;
              noPedimento: string;
              pais_origen: string;
              comentarios: string;
              estado_pedimento: string;
              fecha_factura?: string;
              unidad_medida: string;
            } = {
              descripcion: formJson.descripcion,
              descripcion_ingles: formJson.descripcion_ingles,
              id_area: formJson.id_area,
              id_categoria: formJson.id_categoria,
              id_estatus: formJson.id_estatus,
              id_usuario: formJson.id_usuario,
              marca: formJson.marca,
              modelo: formJson.modelo,
              noFactura: formJson.noFactura,
              numero_serie: formJson.numero_serie,
              tipo_compra: formJson.tipo_compra,
              noPedimento: formJson.noPedimento,
              pais_origen: formJson.pais_origen,
              comentarios: formJson.comentarios,
              estado_pedimento: formJson.estado_pedimento,
              fecha_factura:
                formJson.fecha_factura === "" ? null : formJson.fecha_factura,
              unidad_medida: formJson.unidad_medida,
            };
            let imageName = formJson.numero_serie + "." + ext;
            if (image !== undefined) data = { ...data, imagen: imageName };
            let pdfName = formJson.numero_serie + ".pdf";
            if (filePDF !== undefined)
              data = { ...data, factura_pedimentoPDF: pdfName };

            console.log(data);

            props.Loading(true);

            try {
              if (!image) {
                console.log("No image");
              } else {
                const imageData = new FormData();
                imageData.append("image", image);
                imageData.append("filename", imageName);

                const { data } = await API.post("/api/upload_file/", imageData);
                console.log(data);
              }
            } catch (error: any) {
              console.log(error.response?.data);
            }
            try {
              if (!filePDF) {
                console.log("No PDF");
              } else {
                const pdfData = new FormData();
                pdfData.append("pdf", filePDF);
                pdfData.append("filename", pdfName);

                const { data } = await API.post("/api/upload_file/", pdfData);
                console.log(data);
              }
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
              required
              helperText="Escribe el número de pedimento."
              margin="normal"
              name="noPedimento"
            />
            <TextField
              select
              label="Estado del pedimento"
              fullWidth
              required
              helperText="Indica el estado del pedimento."
              multiline
              margin="normal"
              name="estado_pedimento"
              defaultValue={""}
            >
              {estadosPedimento.map((stat) => (
                <MenuItem key={stat.value} value={stat.value}>
                  {stat.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Unidad de medida"
              fullWidth
              required
              helperText="Indica la unidad de medida."
              multiline
              margin="normal"
              name="unidad_medida"
              defaultValue={""}
            >
              {unidadMedida.map((stat) => (
                <MenuItem key={stat.value} value={stat.value}>
                  {stat.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="País de origen"
              fullWidth
              helperText="Escribe el país de origen."
              multiline
              margin="normal"
              name="pais_origen"
            />
            <TextField
              label="Modelo"
              fullWidth
              helperText="Escribe el modelo del producto."
              multiline
              margin="normal"
              name="modelo"
            />
            <TextField
              label="Descripción"
              fullWidth
              helperText="Agrega una descripción."
              multiline
              margin="normal"
              name="descripcion"
            />
            <TextField
              label="Descripción en inglés"
              fullWidth
              helperText="Agrega una descripción en inglés."
              multiline
              margin="normal"
              name="descripcion_ingles"
            />
            <TextField
              label="Marca"
              fullWidth
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
            <InputLabel>Fecha de factura: </InputLabel>
            <TextField
              fullWidth
              helperText="Indica la fecha de factura."
              type="date"
              margin="normal"
              aria-labelledby="Fecha de factura"
              name="fecha_factura"
            />
            <InputLabel>Factura PDF: </InputLabel>
            <Box>
              <input
                type="file"
                name="factura_pedimentoPDF"
                onChange={(e) => {
                  const pathPDF = e.target.value;
                  var titlePDF = pathPDF.slice(pathPDF.indexOf("h") + 2);

                  var fileName = titlePDF;
                  var idxDot = fileName.lastIndexOf(".") + 1;
                  var extFile = fileName.slice(idxDot).toLowerCase();
                  if (extFile == "pdf") {
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
              helperText="Indica el usuario."
              multiline
              required
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
              helperText="Indica el area."
              multiline
              required
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
            <TextField
              label="Comentarios"
              fullWidth
              helperText="Escribe tus comentarios adicionales."
              multiline
              margin="normal"
              name="comentarios"
            />
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
                  setExt(extFile);
                  if (
                    extFile == "jpg" ||
                    extFile == "jpeg" ||
                    extFile == "png"
                  ) {
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
  const [pdf, setPDF] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [filePDF, setFilePDF] = useState<File | undefined>();
  const [ext, setExt] = useState<string>("");

  function handleImage(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setImage(file);
  }
  function handlePDF(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };
    const file = target.files[0];
    setFilePDF(file);
  }
  const asset = props.data;

  // Asignar valores por defecto a optiones de campos de catalogos en el formulario

  // Valor de categoria
  let categoryValue: string = "";
  props.categoriesOptions.map((cat) => {
    if (asset.ID_Categoria === cat.label) {
      categoryValue = cat.value;
    }
  });

  // Valor de status
  let stateValue: string = "";
  props.statusOptions.map((state) => {
    if (asset.ID_Estatus === state.label) {
      stateValue = state.value;
    }
  });

  // Valor de area
  let areasValue: string = "";
  props.areasOptions.map((area) => {
    if (asset.ID_Area === area.label) {
      areasValue = area.value;
    }
  });

  // Valor de user
  let userValue: string = "";
  props.usersOptions.map((user) => {
    if (asset.ID_Usuario === user.label) {
      userValue = user.value;
    }
  });

  // Valor de estado pedimento
  let estadoPedimentoValue: string = "";
  props.estadoPedimentoOptions.map((estPed) => {
    if (asset.ID_Estado_Pedimento === estPed.value) {
      estadoPedimentoValue = estPed.value;
    }
  });

  // Valor de unidad medida
  let unidadMedidaValue: string = "";
  props.unidadMedidaOptions.map((uniMed) => {
    if (asset.ID_Unidad_Medida === uniMed.value) {
      unidadMedidaValue = uniMed.value;
    }
  });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setPDF("");
    setImage(undefined);
    setFilePDF(undefined);
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

            let data: {
              id: string;
              descripcion: string;
              descripcion_ingles: string;
              factura_pedimentoPDF?: string;
              id_area: string;
              id_categoria: string;
              id_estatus: string;
              id_usuario: string;
              imagen?: string;
              marca: string;
              modelo: string;
              noFactura: string;
              numero_serie: string;
              tipo_compra: string;
              noPedimento: string;
              pais_origen: string;
              comentarios: string;
              estado_pedimento: string;
              fecha_factura?: string;
              unidad_medida: string;
            } = {
              id: formJson.id,
              descripcion: formJson.descripcion,
              descripcion_ingles: formJson.descripcion_ingles,
              id_area: formJson.id_area,
              id_categoria: formJson.id_categoria,
              id_estatus: formJson.id_estatus,
              id_usuario: formJson.id_usuario,
              marca: formJson.marca,
              modelo: formJson.modelo,
              noFactura: formJson.noFactura,
              numero_serie: formJson.numero_serie,
              tipo_compra: formJson.tipo_compra,
              noPedimento: formJson.noPedimento,
              pais_origen: formJson.pais_origen,
              comentarios: formJson.comentarios,
              estado_pedimento: formJson.estado_pedimento,
              fecha_factura:
                formJson.fecha_factura === "" ? null : formJson.fecha_factura,
              unidad_medida: formJson.unidad_medida,
            };
            let imageName = formJson.numero_serie + "." + ext;
            if (image !== undefined) data = { ...data, imagen: imageName };
            let pdfName = formJson.numero_serie + ".pdf";
            if (filePDF !== undefined)
              data = { ...data, factura_pedimentoPDF: pdfName };

            console.log(data);

            props.Loading(true);

            try {
              if (!image) {
                console.log("No image");
              } else {
                const imageData = new FormData();
                imageData.append("image", image);
                imageData.append("filename", imageName);

                const { data } = await API.post("/api/upload_file/", imageData);
                console.log(data);
              }
            } catch (error: any) {
              console.log(error.response?.data);
            }
            try {
              if (!filePDF) {
                console.log("No PDF");
              } else {
                const pdfData = new FormData();
                pdfData.append("pdf", filePDF);
                pdfData.append("filename", pdfName);

                const { data } = await API.post("/api/upload_file/", pdfData);
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
                  select
                  label="Estado del pedimento"
                  fullWidth
                  required
                  helperText="Indica el estado del pedimento."
                  multiline
                  margin="normal"
                  name="estado_pedimento"
                  defaultValue={estadoPedimentoValue}
                >
                  {props.estadoPedimentoOptions.map((stat) => (
                    <MenuItem key={stat.value} value={stat.value}>
                      {stat.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Unidad de Medida"
                  fullWidth
                  required
                  helperText="Selecciona la unidad de medida."
                  multiline
                  margin="normal"
                  name="unidad_medida"
                  defaultValue={unidadMedidaValue}
                >
                  {props.unidadMedidaOptions.map((stat) => (
                    <MenuItem key={stat.value} value={stat.value}>
                      {stat.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="País de origen"
                  fullWidth
                  helperText="Escribe el país de origen."
                  multiline
                  margin="normal"
                  name="pais_origen"
                  defaultValue={asset.pais_origen}
                />
                <TextField
                  label="Modelo"
                  fullWidth
                  helperText="Escribe el modelo del producto."
                  multiline
                  margin="normal"
                  name="modelo"
                  defaultValue={asset.Modelo}
                />
                <TextField
                  label="Descripción"
                  fullWidth
                  helperText="Agrega una descripción."
                  multiline
                  margin="normal"
                  name="descripcion"
                  defaultValue={asset.Description}
                />
                <TextField
                  label="Descripción en inglés"
                  fullWidth
                  helperText="Agrega una descripción en inglés."
                  multiline
                  margin="normal"
                  name="descripcion_ingles"
                  defaultValue={asset.descripcion_ingles}
                />
                <TextField
                  label="Marca"
                  fullWidth
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
                  defaultValue={stateValue}
                >
                  {props.statusOptions.map((stat) => (
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
                  defaultValue={categoryValue}
                >
                  {props.categoriesOptions.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Tipo de compra"
                  fullWidth
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
                <InputLabel>Fecha de factura: </InputLabel>
                <TextField
                  fullWidth
                  helperText="Indica la fecha de factura."
                  type="date"
                  margin="normal"
                  aria-labelledby="Fecha de factura"
                  name="fecha_factura"
                  defaultValue={asset.fecha_factura}
                />
                <InputLabel>Factura PDF: </InputLabel>
                <Box>
                  <input
                    type="file"
                    name="factura_pedimentoPDF"
                    onChange={(e) => {
                      const pathPDF = e.target.value;
                      var titlePDF = pathPDF.slice(pathPDF.indexOf("h") + 2);

                      var fileName = titlePDF;
                      var idxDot = fileName.lastIndexOf(".") + 1;
                      var extFile = fileName.slice(idxDot).toLowerCase();
                      if (extFile == "pdf") {
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
                  defaultValue={userValue}
                >
                  {props.usersOptions.map((user) => (
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
                  defaultValue={areasValue}
                >
                  {props.areasOptions.map((area) => (
                    <MenuItem key={area.value} value={area.value}>
                      {area.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Comentarios"
                  fullWidth
                  helperText="Escribe tus comentarios adicionales."
                  multiline
                  margin="normal"
                  name="comentarios"
                  defaultValue={asset.comentarios}
                />
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
                      setExt(extFile);
                      if (
                        extFile == "jpg" ||
                        extFile == "jpeg" ||
                        extFile == "png"
                      ) {
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

function DeleteAssetButton(props: DeleteProps) {
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

function ImportAssetButton(props: AllProps) {
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
