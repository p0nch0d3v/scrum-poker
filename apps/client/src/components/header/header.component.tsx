import { AppBar, Box, Input, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useLocalStorage from '../../hooks/useLocalStorage ';
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { reverseString, sanitizeText } from '../../helpers/helpers';
import Config from '../../config/config';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', '');
    const [applicationTitle, setApplicationTitle] = useState<string>('');

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
        const defaultTitle = "Scrum pokeR"
        setApplicationTitle(Config.IS_PRODUCTION === false ? reverseString(defaultTitle) : defaultTitle);
        window.document.title = applicationTitle;
    }, [])

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={backToHome} >
                    {applicationTitle}
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name'>
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
            </Toolbar>
        </AppBar>
    );
}