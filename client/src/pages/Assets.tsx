import { Box, Container } from "@mui/material";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const rows: GridRowsProp = [
  {
    id: 1,
    image: "Imagen",
    assetID: "CWE3R9FJ",
    name: "MOUSE",
    employee: "Manuel Martinez",
    supplier: "LOGITEC",
    mexico: true,
    deparment: "Recursos Humanos",
    category: "Equipo de Cómputo",
    date: "12/10/23",
    action1: "",
    action2: "",
    edit: "",
    cancel: "",
  },
  {
    id: 2,
    image: "algo",
    assetID: "VREKNG6D",
    name: "MONITOR",
    employee: "María Magdalena",
    supplier: "CELL",
    mexico: false,
    deparment: "Informática",
    category: "Equipo de Cómputo",
    date: "20/02/24",
    action1: "",
    action2: "",
    edit: "",
    cancel: "",
  },
  {
    id: 3,
    image: "algo3",
    assetID: "FRK4O3DE",
    name: "BATERIA",
    employee: "George R.R. Martin",
    supplier: "PLAZA JÁNES",
    mexico: true,
    deparment: "Recursos Humanos",
    category: "Equipo de Cómputo",
    date: "10/01/24",
    action1: "",
    action2: "",
    edit: "",
    cancel: "",
  },
  {
    id: 4,
    image: "dog",
    assetID: "23LFLROD",
    name: "DOG",
    employee: "Waffle Encinas",
    supplier: "DOG PILE ORG",
    mexico: false,
    deparment: "Marketing",
    category: "MARKETING",
    date: "28/02/24",
    action1: "",
    action2: "",
    edit: "",
    cancel: "",
  },
];

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "image", headerName: "Imagen", width: 150 },
  { field: "assetID", headerName: "Asset ID", width: 150 },
  { field: "name", headerName: "Nombre", width: 150 },
  { field: "employee", headerName: "Empleado Asignado", width: 150 },
  { field: "supplier", headerName: "Proveedor", width: 150 },
  { field: "mexico", headerName: "Asset ID", width: 150 },
  { field: "department", headerName: "Departamento", width: 150 },
  { field: "category", headerName: "Categoría", width: 150 },
  { field: "date", headerName: "Fecha", width: 150 },
  { field: "action1", headerName: "", width: 150 },
  { field: "action2", headerName: "", width: 150 },
  { field: "edit", headerName: "", width: 150 },
  { field: "cancel", headerName: "", width: 150 },
];

export default function Assets() {
  return (
    <Box marginTop={10}>
      <Container>
        <DataGrid rows={rows} columns={columns} />
      </Container>
    </Box>
  );
}
