import JoinRoomComponent from '../JoinRoom/joinRoom.component'
import CreateRoomComponent from '../createRoom/createRoom.component'
import useLocalStorage from '../../hooks/useLocalStorage ';

export default function HomeComponent() {
  const [userName, setUserName] = useLocalStorage('userName', null);

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
        <JoinRoomComponent userName={userName} />
        <CreateRoomComponent userName={userName}/>
      </div>
    </>
  )
}