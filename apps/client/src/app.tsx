import { Router, Route }from 'preact-router';
import HomeComponent from './components/home/home.component';
import './app.css'

export function App() {
  return (
    <Router>
      <Route path='/' component={HomeComponent} />
    </Router>
  )
}
