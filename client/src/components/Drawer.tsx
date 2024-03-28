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
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";

const Pages: {title: string, href: string}[] = [
  { title: "Inicio", href: "/" },
  { title: "Assets", href: "/assets" },
  { title: "Usuarios", href: "/users" },
  { title: "Catálogos", href: "/catalog"},
  { title: "Etiquetas", href: "/tags"}
];

export default function NavegatorDrawer() {
  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
          },
        }}
        
      >
        <Toolbar />
        <List>
          {Pages.map((page, index) => (
            <ListItem key={page.title} disablePadding>
              <ListItemButton component="a" href={page.href}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={page.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="1" disablePadding>
            <ListItemButton component="a" href="/login">
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
