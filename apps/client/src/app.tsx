import { Router, Route }from 'preact-router';
import HomeComponent from './components/home/home.component';
import RoomComponent from './components/room/room.component';
import './app.css'


export function App() {
  return (
    <Router>
      <Route path='/' component={HomeComponent} />
      <Route path='/room/:id' component={RoomComponent} />
    </Router>
  )
}
