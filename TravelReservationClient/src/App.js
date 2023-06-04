import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Reservation from './components/Reservation/Reservation';
import './App.css';

function App() {  
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/reservation" element={<Reservation />} />
      </Routes> 
    </div>
  );
}

export default App;
