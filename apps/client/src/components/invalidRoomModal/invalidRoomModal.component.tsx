import { useNavigate } from "react-router-dom";
import useLocalStorage from '../../hooks/useLocalStorage ';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FunctionComponent } from 'react';
import { Button, Input } from '@mui/material';

type InvalidRomModalProps = {
    open: boolean,
    onClose: any
}

const InvalidRomModalComponent: FunctionComponent<InvalidRomModalProps> = ({ open, onClose }) => {
    const navigate = useNavigate();

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
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Invalid room Id
                </Typography>
                <Button color="error" variant="contained" sx={{ marginTop: 2 }}
                    onClick={() => { navigate('/'); }}>Close</Button>
            </Box>
        </Modal>
    );
}

export default InvalidRomModalComponent;