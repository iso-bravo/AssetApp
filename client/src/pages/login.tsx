import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        nombre: username,
        contraseña: password
      });
      console.log(response.data);
      if (response.status === 200 && response.data.mensaje === 'Inicio de sesión exitoso') {
        navigate('/home');
      } else {
        toast.error('Usuario o contraseña incorrectos. Intentelo de nuevo');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('Usuario o contraseña incorrectos. Intentelo de nuevo');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <ToastContainer />
      <div className="bg-[#E4E3E3] px-12 py-12 rounded-md w-7/8 sm:w-2/3 md:w-2/4 lg:w-1/3 2xl:w-1/4 h-2/3 flex flex-col">
        <h1 className="text-3xl text-center">Iniciar Sesión</h1>
        <div className='pt-8 border-[#E4E3E3]'>
          <TextField
            className="w-full border-t-8"
            id="standard-basic"
            label="Usuario"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='pt-6 border-[#E4E3E3]'>
          <FormControl className="w-full" variant="standard">
            <InputLabel className='text-xl' htmlFor="standard-adornment-password">Contraseña</InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className='w-full border-t-8 pt-10'>
          <Button className='w-full h-12' variant="contained" onClick={handleLogin}>Ingresar</Button>
        </div>
      </div>
    </div>
  );
}

export default LogIn;