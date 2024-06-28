import { Routes, Route } from 'react-router-dom';
import HomeComponent from './components/home/home.component';
import RoomComponent from './components/room/room.component';
import LayoutComponent from './components/layout/layout.component';
import JoinRoomComponent from './components/JoinRoom/joinRoom.component';
import CreateRoomComponent from './components/createRoom/createRoom.component';
import RoomListComponent from './components/roomList/roomList.component';
import Config from './config/config.tsx';

import './app.css'
import { useEffect, useState } from 'react';

export function App() {
  const [configIsInitialized, setConfigIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    async function useEffectAsync() {
      if (!Config.isInitialized) {
        await Config.initialize();
        setConfigIsInitialized(Config.isInitialized);
      }
    }
    useEffectAsync();
  }, []);

  return configIsInitialized === true && (
    <LayoutComponent>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/room/:id" element={<RoomComponent />} />

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
