import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'

import LayoutComponent from '../layout/layout.component'
import RoomListComponent from '../roomList/roomList.component'

export default function HomeComponent() {
  return (
    <LayoutComponent>
      <>
        <JoinRoomComponent />
        <CreateRoomComponent />
        <RoomListComponent />
      </>
    </LayoutComponent>
  )
}