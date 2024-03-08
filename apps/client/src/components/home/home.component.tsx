import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import RoomListComponent from '../roomList/roomList.component'

export default function HomeComponent() {
  return (
      <>
        <JoinRoomComponent />
        <CreateRoomComponent />
        <RoomListComponent />
      </>
  )
}