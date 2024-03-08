import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import HeaderComponent from '../header/header.component'

export default function HomeComponent() {
  return (
    <>
      <HeaderComponent />
      <div>
        <JoinRoomComponent />
        <CreateRoomComponent />
      </div>
    </>
  )
}