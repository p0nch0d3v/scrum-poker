import { AppBar, Box, Input, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useLocalStorage from '../../hooks/useLocalStorage ';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from 'react';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', null);
    const userNameRef = useRef(userName);
    const navigate = useNavigate();

    const backToHome = () => {
        setTimeout(() => {
          navigate('/', { replace: true });
          window.location.reload();
        }, 1);
      };

    const onUserNameKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            setTimeout(()=> {
                setUserName(userNameRef.current.firstChild.value);
                backToHome();
            }, 250);
        }
    }

    useEffect(() => {
        userNameRef.current.firstChild.value = userName
    }, [])

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={backToHome} >
                    Scrum pokeR
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name'>
                    <Input placeholder='Participant name'
                        sx={{ color: 'unset' }}
                        inputProps={{ maxLength: 15 }}
                        ref={userNameRef}
                        onKeyUp={onUserNameKeyUp} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}