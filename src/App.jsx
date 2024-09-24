import { Route, Routes } from 'react-router-dom';
import Login from './routes/Login'; 
import Signup from './routes/Signup';
import Index from './routes/Index'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;