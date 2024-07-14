import { Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { FunctionComponent, useEffect } from 'react';
import { sanitizeText } from '../../helpers/helpers';
import useLocalStorage from '../../hooks/useLocalStorage';

type UserNameModalProps = {
    open: boolean,
    onClose: any
}

const UserNameModalComponent: FunctionComponent<UserNameModalProps> = ({ open, onClose }) => {
    const [userName, setUserName] = useLocalStorage('userName', '');

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    useEffect(() => {
        setUserName(sanitizeText(userName));
    }, []);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Participant name
                </Typography>
                <Box alignItems={'right'} alignContent={'right'} className='participant-name' sx={{ marginTop: 2 }}>
                    <Input placeholder='Participant name'
                        sx={{ color: 'unset' }}
                        value={userName}
                        inputProps={{ maxLength: 15 }}
                        onChange={(e) => setUserName(sanitizeText(e.target.value))} />
                </Box>
                <Button variant="contained" sx={{ marginTop: 2 }}
                    onClick={() => { window.location.reload(); }}>Join</Button>
            </Box>
        </Modal>
    );
}

export default UserNameModalComponent;