import './App.css';
import Homepage from './pages/Homepage';
import ResponsiveAppBar from './components/ResponsiveAppbar';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import PeoplePage from './pages/PeoplePage';

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar/>
      <Routes>
        <Route path='/' element={<PeoplePage/>}/>
        <Route path='People' element={<PeoplePage/>} />
        <Route path='Home' element={<Homepage/>}/>
        

      </Routes>

      {/* <Homepage/> */}
    </div>
  );
}

export default App;
