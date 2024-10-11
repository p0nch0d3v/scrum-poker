import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Input, Toolbar, Tooltip, Typography } from '@mui/material';

import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppConstants } from 'models/index';
import Config from '../../config/config';
import { reverseString, sanitizeText } from '../../helpers/helpers';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ThemeContext } from '../../contexts/themeContext';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', '');
    const { switchColorMode, mode } = useContext(ThemeContext)
    const userNameRef = useRef(userName);
    const navigate = useNavigate();

    useEffect(() => {
        setUserName(sanitizeText(userName));
    }, []);

    const backToHome = () => {
        setTimeout(() => {
            navigate('/', { replace: true });
            window.location.reload();
        }, 1);
    };

    const onUserNameKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            setTimeout(() => {
                setUserName(sanitizeText(userNameRef.current.firstChild.value));
                backToHome();
            }, 250);
        }
    }

    useEffect(() => {
        userNameRef.current.firstChild.value = userName;
        window.document.title = Config.ApplicationTitle;
    }, [])

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={backToHome} >
                    {Config.ApplicationTitle}
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name' display={'flex'}>
                    <Tooltip disableFocusListener arrow
                        placement="left"
                        title="Press [ENTER] to update the Participant name" >
                        <Input placeholder='Participant name'
                            sx={{ color: 'unset' }}
                            inputProps={{ maxLength: 15 }}
                            ref={userNameRef}
                            onKeyUp={onUserNameKeyUp} />
                    </Tooltip>
                </Box>
                    <IconButton sx={{ ml: 1 }} onClick={switchColorMode} color="inherit">
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
            </Toolbar>
        </AppBar>
    );
}