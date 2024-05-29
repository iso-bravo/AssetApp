import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";

// Íconos
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import AssetsIcon from "@mui/icons-material/TableChart";
import UsersIcon from "@mui/icons-material/Person";
import CatalogIcon from "@mui/icons-material/List";
import TagIcon from "@mui/icons-material/Tag";
import { useNavigate } from "react-router-dom";

// Lista de enlaces del drawer
const Pages: { title: string; href: string }[] = [
  { title: "Inicio", href: "/home" },
  { title: "Assets", href: "/assets" },
  { title: "Usuarios", href: "/users" },
  { title: "Catálogos", href: "/catalogs" },
];

// Componente principal
export default function NavegatorDrawer() {
  const navigate = useNavigate();

  // Función para asignar los íconos según el index del elemento
  function iconAsigment(i: number) {
    switch (i) {
      case 0: // Inicio
        return <HomeIcon />;

      case 1: // Assets
        return <AssetsIcon />;

      case 2: // Usuarios
        return <UsersIcon />;

      case 3: // Catálogos
        return <CatalogIcon />;

      case 4: // Etiquetas
        return <TagIcon />;

      case 5:
        break;

      default:
        break;
    }
  }

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 230,
            boxSizing: "border-box",
            backgroundColor: "steelblue",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          {Pages.map((page, index) => (
            <ListItem key={page.title} disablePadding>
              <ListItemButton onClick={() => navigate(page.href)}>
                <ListItemIcon>{iconAsigment(index)}</ListItemIcon>
                <ListItemText primary={page.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="1" disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
