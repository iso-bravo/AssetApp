import {
  Box,
  List,
  ListItem,
  Dialog,
  //DialogTitle,
  Button,
  DialogContent,
  //IconButton,
  DialogActions,
  Typography,
  Paper,
  //Stack,
  Grid,
} from "@mui/material";
//import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import DetailsIcon from "@mui/icons-material/Info";
import FileOpenIcon from "@mui/icons-material/FileOpen";

export interface Details {
  pais_origen: string;
  id: number;
  Number_Serie: string;
  Modelo: string;
  Description: string;
  descripcion_ingles: string;
  Marca: string;
  ID_Categoria: string;
  Fecha_Registro: string;
  Tipo_Compra: string;
  No_Factura: string;
  Factura: string;
  ID_Usuario: string;
  ID_Area: string;
  ID_Estatus: string;
  ID_Unidad_Medida: string;
  ID_Estado_Pedimento: string;
  Imagen: string;
  noPedimento: string;
  comentarios: string;
  fecha_factura: string;
}

export interface PropsDetail {
  asset: Details;
}

export default function AssetDetails(props: PropsDetail) {
  const [open, setOpen] = React.useState(false);
  const ImageSRC = "http://localhost:8080/api" + props.asset.Imagen;
  const FacturaSRC = "http://localhost:8080/api/files/" + props.asset.Factura;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openPDF = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        color="info"
        endIcon={<DetailsIcon />}
      >
        Detalles
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullScreen>
        {/*<IconButton
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
        <DialogTitle
          style={{
            backgroundColor: "steelblue",
            textAlign: "center",
            fontSize: 30,
          }}
          color="white"
        >
          Detalles
        </DialogTitle>*/}
        <DialogContent draggable>
          <Box marginLeft={10} marginRight={10} marginBottom={4}>
            <Paper elevation={12}>
              <Box paddingLeft={12} paddingTop={4} paddingBottom={4}>
                {props.asset.id === 0 ? (
                  <Typography>No se ha seleccionado ningún ID.</Typography>
                ) : (
                  <>
                    <Typography variant="h3" margin={2}>
                      Detalles
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <List>
                          <ListItem>
                            <b>ID:&nbsp;</b> {props.asset.id}
                          </ListItem>
                          <ListItem>
                            <b>Número de serie:&nbsp;</b>{" "}
                            {props.asset.Number_Serie}
                          </ListItem>
                          <ListItem>
                            <b>Número de pedimento:&nbsp;</b>{" "}
                            {props.asset.noPedimento}
                          </ListItem>
                          <ListItem>
                            <b>País de origen:&nbsp;</b>{" "}
                            {props.asset.pais_origen}
                          </ListItem>
                          <ListItem>
                            <b>Modelo:&nbsp;</b> {props.asset.Modelo}
                          </ListItem>
                          <ListItem>
                            <b>Descripción:&nbsp;</b> {props.asset.Description}
                          </ListItem>
                          <ListItem>
                            <b>Marca:&nbsp;</b> {props.asset.Marca}
                          </ListItem>
                          <ListItem>
                            <b>Categoría:&nbsp;</b> {props.asset.ID_Categoria}
                          </ListItem>
                          <ListItem>
                            <b>Fecha de registro:&nbsp;</b>{" "}
                            {props.asset.Fecha_Registro}
                          </ListItem>
                          <ListItem>
                            <b>Tipo de compra:&nbsp;</b>{" "}
                            {props.asset.Tipo_Compra}
                          </ListItem>
                          <ListItem>
                            <b>No. de factura:&nbsp;</b>{" "}
                            {props.asset.No_Factura}
                          </ListItem>
                          <ListItem>
                            <b>Usuario:&nbsp;</b> {props.asset.ID_Usuario}
                          </ListItem>
                          <ListItem>
                            <b>Área:&nbsp;</b> {props.asset.ID_Area}
                          </ListItem>
                          <ListItem>
                            <b>Estatus:&nbsp;</b> {props.asset.ID_Estatus}
                          </ListItem>
                        </List>
                      </Grid>
                      <Grid item xs={6}>
                        <Box height={400} width={400}>
                          <img
                            src={ImageSRC}
                            alt="Asset"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                          <Button
                            size="large"
                            sx={{ marginTop: 2 }}
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                              props.asset.Factura !== null
                                ? openPDF(FacturaSRC)
                                : alert(
                                    "No se ha subido la factura de este asset."
                                  );
                            }}
                          >
                            <b>VER FACTURA</b>
                            <FileOpenIcon sx={{ marginLeft: 1 }} />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", backgroundColor: "lightgray" }}
        >
          <Box paddingBottom={2} paddingTop={2} width={200}>
            <Button
              title="Volver"
              onClick={handleClose}
              variant="contained"
              color="error"
              fullWidth
            >
              Volver
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
