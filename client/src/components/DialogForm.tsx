import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface DialogProps {
  butttonTitle: string;
  title: string;
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
      <Button variant="contained" onClick={handleClickOpen} color="primary">
        {props.butttonTitle}
      </Button>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </>
  );
}
