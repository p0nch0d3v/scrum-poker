import { Button, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { FunctionComponent, useEffect } from 'react';

type SetAdminModalProps = {
    open: boolean,
    onYes: any,
    onNo: any,
    newAdminName: string
}

const modalStyle = {
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

const SetAdminModalComponent: FunctionComponent<SetAdminModalProps> = ({ open, onYes, onNo, newAdminName }) => {
    return (
        <Modal
            open={open}
            onClose={onNo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Do you want [{newAdminName}] to be the new room admin ?
                </Typography>
                <Box sx={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
                    <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => { onYes(newAdminName); }}>Yes</Button>
                    <Button variant="outlined" sx={{ marginTop: 2 }} onClick={() => { onNo(); }}>No</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default SetAdminModalComponent;
