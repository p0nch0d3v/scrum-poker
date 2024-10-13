import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Input, Toolbar, Tooltip, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

import Config from '../../config/config';
import { ThemeContext } from '../../contexts/themeContext';
import useSessionStorage from '../../hooks/useSessionStorage';

export default function HeaderComponent() {
    // const [userName, setUserName] = useLocalStorage('userName', '');
    const [user] = useSessionStorage("user", null);
    const { switchColorMode, mode } = useContext(ThemeContext)
    // const userNameRef = useRef(userName);
    const navigate = useNavigate();

    useEffect(() => {
        // setUserName(sanitizeText(userName));
    }, []);

    useEffect(() => {
        if (user) {
            const { name, email, picture } = user;
        }
    }, [user]);

    const backToHome = () => {
        setTimeout(() => {
            navigate('/', { replace: true });
            window.location.reload();
        }, 1);
    };

    const onUserNameKeyUp = (e: any) => {
        if (e.keyCode === 13) {
            setTimeout(() => {
                // setUserName(sanitizeText(userNameRef.current.firstChild.value));
                backToHome();
            }, 250);
        }
    }

    useEffect(() => {
        // userNameRef.current.firstChild.value = userName;
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
                        placement="bottom" title={user?.email}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: '9em', textWrap: 'pretty', textAlign: 'right', marginRight:'0.5em' }}>
                                {user?.name}
                            </Typography>
                            <img src={user?.picture} style={{ height: '3em', width: '3em' }} />
                            </Box>
                    </Tooltip>
                </Box>
                <IconButton sx={{ ml: 1 }} onClick={switchColorMode} color="inherit">
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}