import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { AppBar, Box, Input, Toolbar, Tooltip, Typography } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

import useLocalStorage from '../../hooks/useLocalStorage ';
import { reverseString, sanitizeText } from '../../helpers/helpers';
import { AppConstants } from 'models/index';
import Config from '../../config/config';
import themeOptions from '../../theme';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', '');
    const [applicationTitle, setApplicationTitle] = useState<string>('');
    const [versionLink, setVersionLink] = useState<string>('');

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
        setApplicationTitle(Config.IS_PRODUCTION === false ? reverseString(AppConstants.APP_TITLE) : AppConstants.APP_TITLE);
        window.document.title = applicationTitle;
        setVersionLink(`${AppConstants.REPO_URL}/${Config.GIT_BRANCH}`);
    }, [])

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={backToHome} >
                    {applicationTitle}
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
                    <a style={{ 
                        alignSelf: 'flex-end',
                        marginLeft:'0.5rem', 
                        color: themeOptions.palette.primary.contrastText 
                    }} 
                    target="_blank" href={versionLink}><GitHub /></a>
                </Box>
            </Toolbar>
        </AppBar>
    );
}