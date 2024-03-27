import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';

function LogIn() {
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className=" bg-[#E4E3E3] px-12 py-12 rounded-md w-7/8 sm:w-2/3 md:w-2/4 lg:w-1/3 2xl:w-1/4 h-2/3 flex flex-col">
                <h1 className=" text-3xl text-center">Iniciar Sesión</h1>
                  <div className=' pt-8 border-[#E4E3E3]'>
                <TextField className=" w-full border-t-8" id="standard-basic" label="Usuario" variant="standard" />
                </div>
                <div className=' pt-6 border-[#E4E3E3]'>
                <FormControl className=" w-full" variant="standard">
          <InputLabel className=' text-xl' htmlFor="standard-adornment-password">Contraseña</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
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
          <Button className=' w-full h-12' variant="contained">Ingresar</Button>
          </div>
            </div>
        </div>
    );
}

export default LogIn;
