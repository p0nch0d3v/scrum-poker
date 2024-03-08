import { Routes, Route } from 'react-router-dom';
import HomeComponent from './components/home/home.component';
import RoomComponent from './components/room/room.component';
import LayoutComponent from './components/layout/layout.component';
import './app.css'

export function App() {
  return (
    <LayoutComponent>
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/room/:id" element={<RoomComponent />} />
      </Routes>
    </LayoutComponent>
  )
}
