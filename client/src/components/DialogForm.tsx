import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  IconButton,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface DialogProps {
  butttonTitle: string;
  title: string;
  endButtonText: string;
  children: React.ReactNode;
}

export default function DialogForm(props: DialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} color="primary">
        {props.butttonTitle}
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
        <DialogTitle style={{backgroundColor: "steelblue"}} color="white">{props.title}</DialogTitle>
        <DialogContent draggable>{props.children}</DialogContent>
        <DialogActions style={{marginBottom: 3, marginRight: 5}}>
          <Button type="submit" title="Enviar" variant="contained">
            {props.endButtonText}
          </Button>
          <Button title="Cancelar" onClick={handleClose} variant="contained" color="error">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
