import { useNavigate } from "react-router-dom";
import { Box, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';

export default function HomeComponent() {
  const navigate = useNavigate();
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'space-evenly'}
      width={'100vw'}
      height={'100vh'}>
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