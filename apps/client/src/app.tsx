import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeComponent from './components/home/home.component';
import RoomComponent from './components/room/room.component';
import LayoutComponent from './components/layout/layout.component';
import JoinRoomComponent from './components/JoinRoom/joinRoom.component';
import CreateRoomComponent from './components/createRoom/createRoom.component';
import RoomListComponent from './components/roomList/roomList.component';
import Config from './config/config.tsx';
import './app.css'
import useSessionStorage from './hooks/useSessionStorage.tsx';
import LoginComponent from './components/login/login.component.tsx';
import { UserDTO } from 'models';

export function App() {
  const [configIsInitialized, setConfigIsInitialized] = useState<boolean>(false);
  const [user, setUser] = useSessionStorage("user", null);

  useEffect(() => {
    async function useEffectAsync() {
      if (!Config.isInitialized) {
        await Config.initialize();
        setConfigIsInitialized(Config.isInitialized);
      }
    }
    useEffectAsync();
  }, []);

  if (user === null || user === undefined) {
    return <LoginComponent afterLogin={(user: UserDTO) => { setUser(user) }} />
  }

  return configIsInitialized === true && (
    <LayoutComponent>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/room/:paramId" element={<RoomComponent />} />

        <Route path="/join" element={<JoinRoomComponent />} />
        <Route path="/room/join" element={<JoinRoomComponent />} />

        <Route path="/create" element={<CreateRoomComponent />} />
        <Route path="/room/create" element={<CreateRoomComponent />} />

        <Route path="/list" element={<RoomListComponent />} />
        <Route path="/room/list" element={<RoomListComponent />} />
      </Routes>
    </LayoutComponent>
  )
}
