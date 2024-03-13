import { AppBar, Box, TextField, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useLocalStorage from '../../hooks/useLocalStorage ';

export default function HeaderComponent() {
    const [userName, setUserName] = useLocalStorage('userName', null);

    const onUserNameChange = (e: any) => {
        setUserName(e.target.value);
    }

    return (
        <AppBar position="relative">
            <Toolbar>
                <MenuIcon />
                <Typography variant="h6" component="div" marginLeft={1} width={'100%'} align='left'>
                    Scrum pokeR
                </Typography>
                <Box alignItems={'right'} alignContent={'right'}>
                    <TextField
                        placeholder='Participant name'
                        variant="outlined"
                        color="secondary"
                        value={userName}
                        onChange={onUserNameChange} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}