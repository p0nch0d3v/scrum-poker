import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import useSessionStorage from '../../hooks/useSessionStorage ';

export default function HomeComponent() {
  const [userName, setUserName] = useSessionStorage('userName', '');

  const onUserNameChange = function(e: any) {
    setUserName(e?.target?.value);
  };

  return (
    <>
      <div>
        Name:
        <input value={userName} type="text" placeholder={'your name'} onChange={onUserNameChange} />
      </div>
      <div>
        <JoinRoomComponent />
        <CreateRoomComponent />
      </div>
    </>
  )
}