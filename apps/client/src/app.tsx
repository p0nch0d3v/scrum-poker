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
import useSessionStorage from './hooks/useSessionStorage';
import LoginComponent from './components/login/login.component';
import { UserDTO } from 'models';
import { getUser, isTokenValid } from './services/auth.services.ts';

export function App() {
  const [configIsInitialized, setConfigIsInitialized] = useState<boolean>(false);
  const [token, setToken] = useSessionStorage("token", null);
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

  useEffect(() => {
    if (token) {
      const user = getUser(token);
      if (user) {
        setUser(user);
      }
    }
  }, [token]);

  const afterLogin = function (token: string) {
    setToken(token);
    setTimeout(()=>{
      window.location.reload();
    }, 250)
  };

  if (configIsInitialized === true) {
    if (token === null || token === undefined || isTokenValid(token) === false) {
      return (
        <LoginComponent clientId={Config.GOOGLE_AUTH_CLIENT_ID}
          afterLogin={afterLogin} />
      );
    }
   
    return (
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
    );
  }
  return <></>;
}
