import { Box, Button, Modal, Typography } from "@mui/material";
import { FunctionComponent } from "react";

type LogoutAdminModalProps = {
    open: boolean,
    onYes: any,
    onNo: any
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

const LogoutModalComponent:FunctionComponent<LogoutAdminModalProps> = ({ open, onYes, onNo }) => {
    return (
        <Modal
            open={open}
            onClose={onNo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure to logout ?
                </Typography>
                <Box sx={{ 'display': 'flex', 'justifyContent': 'space-evenly' }}>
                    <Button variant="contained" sx={{ marginTop: 2 }} onClick={() => { onYes(); }}>Yes</Button>
                    <Button variant="outlined" sx={{ marginTop: 2 }} onClick={() => { onNo(); }}>No</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default LogoutModalComponent;