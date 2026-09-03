import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function HomeComponent() {
  const navigate = useNavigate();
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'space-evenly'}
      height={'100vh'}
      >
      <Button
        variant='contained' 
        size='large'
        endIcon={<SendIcon />}
        onClick={() => { navigate('/join'); }}>
        JOIN
      </Button>

      <Button
        variant='contained' 
        size='large'
        endIcon={<AddIcon />}
        onClick={() => { navigate('/create'); }}>
        CREATE
      </Button>

      <Button
        variant='contained' 
        size='large'
        endIcon={<ListIcon />}
        onClick={() => { navigate('/list'); }}>
        OPEN LIST
      </Button>
    </Box>
  )
}