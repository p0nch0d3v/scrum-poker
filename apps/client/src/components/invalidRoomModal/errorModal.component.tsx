import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { FunctionComponent } from 'react';
import { useNavigate } from "react-router-dom";

type ErrorModalProps = {
    open: boolean,
    onClose: any,
    message?: string
}

const ErrorModalComponent: FunctionComponent<ErrorModalProps> = ({ open, onClose, message }) => {
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
                    {message}
                </Typography>
                <Button color="error" variant="contained" sx={{ marginTop: 2 }}
                    onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
}

export default ErrorModalComponent;