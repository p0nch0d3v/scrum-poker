import { Routes, Route } from 'react-router-dom';
import HomeComponent from './components/home/home.component';
import RoomComponent from './components/room/room.component';
import LayoutComponent from './components/layout/layout.component';
import JoinRoomComponent from './components/JoinRoom/joinRoom.component';
import CreateRoomComponent from './components/createRoom/createRoom.component';
import RoomListComponent from './components/roomList/roomList.component';

import './app.css'

export function App() {
  return (
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
