import { Route, Routes } from 'react-router-dom';
import Login from './routes/Login'; 
import Signup from './routes/Signup';
import Index from './routes/Index';
import Chat from './routes/Chat'; 
import Profile from './routes/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat/:contactid" element={<Chat />} />
      <Route path="/profiles/:id" element={<Profile />} />

    </Routes>
  );
}

export default App;