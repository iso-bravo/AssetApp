import {
  Box,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  IconButton,
  DialogActions,
  Typography,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

interface Details {
  id: number;
  Number_Serie: number;
  Modelo: string;
  Description: string;
  Marca: string;
  ID_Categoria: number;
  Fecha_Registro: string;
  Tipo_Compra: string;
  No_Factura: number;
  Factura: string;
  ID_Usuario: number;
  ID_Area: number;
  ID_Estatus: number;
  Imagen: string;
}

interface PropsDetail {
  asset: Details;
}

export default function AssetDetails(props: PropsDetail) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} color="secondary">
        Detalles
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullScreen>
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
        <DialogTitle
          style={{ backgroundColor: "steelblue", textAlign: "center" }}
          color="white"
        >
          <Typography variant="h4">Detalles</Typography>
        </DialogTitle>
        <DialogContent draggable>
          <Box marginLeft={30} marginRight={30} marginTop={4} marginBottom={4}>
            <Paper elevation={12}>
              <Box paddingLeft={12} paddingTop={4} paddingBottom={4}>
                <List>
                  <ListItem><b>ID:&nbsp;</b> {props.asset.id}</ListItem>
                  <ListItem>
                  <b>Número de serie:&nbsp;</b> {props.asset.Number_Serie}
                  </ListItem>
                  <ListItem><b>Modelo:&nbsp;</b>{props.asset.Modelo}</ListItem>
                  <ListItem><b>Descripción:&nbsp;</b> {props.asset.Description}</ListItem>
                  <ListItem><b>Marca:&nbsp;</b> {props.asset.Marca}</ListItem>
                  <ListItem><b>Categoría:&nbsp;</b> {props.asset.ID_Categoria}</ListItem>
                  <ListItem>
                  <b>Fecha de registro:&nbsp;</b> {props.asset.Fecha_Registro}
                  </ListItem>
                  <ListItem><b>Tipo de compra:&nbsp;</b> {props.asset.Tipo_Compra}</ListItem>
                  <ListItem><b>No. de factura:&nbsp;</b> {props.asset.No_Factura}</ListItem>
                  <ListItem><b>Factura:&nbsp;</b> {props.asset.Factura}</ListItem>
                  <ListItem><b>Usuario:&nbsp;</b> {props.asset.ID_Usuario}</ListItem>
                  <ListItem><b>Área:&nbsp;</b> {props.asset.ID_Area}</ListItem>
                  <ListItem><b>Estatus:&nbsp;</b> {props.asset.ID_Estatus}</ListItem>
                  <ListItem><b>Imagen:&nbsp;</b> {props.asset.Imagen}</ListItem>
                </List>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions
          style={{ justifyContent: "center", backgroundColor: "ButtonFace" }}
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