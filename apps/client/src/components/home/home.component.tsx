import useLocalStorage from '../../hooks/useLocalStorage ';
import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import HeaderComponent from '../header/header.component'

export default function HomeComponent() {
  const [userName] = useLocalStorage('userName', null);

  return (
    <>
      <HeaderComponent />
      <div>
        <JoinRoomComponent userName={userName} />
        <CreateRoomComponent userName={userName}/>
      </div>
    </>
  )
}