import { AppBar, Box, Input, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useLocalStorage from '../../hooks/useLocalStorage ';
import { useNavigate } from "react-router-dom";

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', null);
    const navigate = useNavigate();

    const onUserNameChange = (e: any) => {
        setUserName(e.target.value);
    }

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'
                    onClick={() => { navigate('/') }}>
                    Scrum pokeR
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name'>
                    <Input placeholder='Participant name'
                        sx={{ color: 'unset' }}
                        value={userName}
                        inputProps={{ maxLength: 15 }}
                        onChange={onUserNameChange} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}