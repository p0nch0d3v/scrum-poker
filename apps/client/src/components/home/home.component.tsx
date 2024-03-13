import { Fragment } from 'react'
import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import RoomListComponent from '../roomList/roomList.component'
import { Box } from '@mui/material'

export default function HomeComponent() {
  return (
    <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }}>
      <JoinRoomComponent />
      <CreateRoomComponent />
      <RoomListComponent />
    </Box>
  )
}