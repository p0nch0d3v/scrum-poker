import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Input, Toolbar, Tooltip, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import Config from '../../config/config';
import { ThemeContext } from '../../contexts/themeContext';
import useSessionStorage from '../../hooks/useSessionStorage';
import LogoutModalComponent from '../logoutModal/logoutModal.component';
import { logout } from '../../services/auth.services';

export default function HeaderComponent() {
    const [user] = useSessionStorage("user", null);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [picture, setPicture] = useState();
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
    const { switchColorMode, mode } = useContext(ThemeContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const { name, email, picture } = user;
            setName(name);
            setEmail(email);
            setPicture(picture);
        }
    }, [user]);

    const backToHome = () => {
        setTimeout(() => {
            navigate('/', { replace: true });
            window.location.reload();
        }, 1);
    };

    useEffect(() => {
        window.document.title = Config.ApplicationTitle;
    }, [])

    return (
        <AppBar position="relative">
            <Toolbar sx={{ display: 'flex' }}>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={backToHome} >
                    {Config.ApplicationTitle}
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name' display={'flex'} flexGrow={2}>
                    <Tooltip disableFocusListener arrow
                        placement="bottom" title={email}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => { setShowLogoutModal(true); }}>
                            <Typography sx={{ minWidth: '9em', textWrap: 'pretty', textAlign: 'right', marginRight: '0.5em' }}>
                                {name}
                            </Typography>
                            <img src={picture} style={{ height: '3em', width: '3em' }} />
                        </Box>
                    </Tooltip>
                </Box>
                <IconButton sx={{ ml: 1 }} onClick={switchColorMode} color="inherit">
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {showLogoutModal && <LogoutModalComponent
                    open={true}
                    onYes={() => { logout(); backToHome(); }}
                    onNo={() => { setShowLogoutModal(false); }} />}
            </Toolbar>
        </AppBar>
    );
}