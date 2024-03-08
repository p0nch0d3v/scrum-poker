import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import HeaderComponent from '../header/header.component'
import RoomListComponent from '../roomList/roomList.component'

export default function HomeComponent() {
  return (
    <>
      <HeaderComponent />
      <div>
        <JoinRoomComponent />
        <CreateRoomComponent />
        <RoomListComponent />
      </div>
    </>
  )
}