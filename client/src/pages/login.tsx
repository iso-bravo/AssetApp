// src/pages/Login.tsx
import React, { useState, useContext } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../auth/Auth';
import BackgroundImage from '../assets/fondo.jpg';
import { API } from './Home';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      const response = await API.post('/api/login/', {
        nombre: username,
        contraseña: password
      });
      if (response.status === 200 && response.data.mensaje === 'Inicio de sesión exitoso') {
        authContext?.login({ username });
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
    <div className="fixed top-0 left-0 w-full h-full flex">
      <ToastContainer />
      <div className="w-1/2 h-full flex items-center justify-center bg-[#E4E3E3]">
        <div className="px-12 py-12 rounded-md w-3/4 sm:w-2/3 md:w-2/4 lg:w-2/3 2xl:w-1/2 flex flex-col">
          <h1 className="text-3xl text-center">Iniciar Sesión</h1>
          <div className='pt-8'>
            <TextField
              className="w-full"
              id="standard-basic"
              label="Usuario"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='pt-6'>
            <FormControl className="w-full" variant="standard">
              <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
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
          <div className='w-full pt-10'>
            <Button className='w-full h-12' variant="contained" onClick={handleLogin}>Ingresar</Button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full" style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover' }}>
        {/* Imagen de fondo */}
      </div>
    </div>
  );
}

export default Login;
