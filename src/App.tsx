import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import ChatLobby from './pages/ChatLobby';
import ChatRoom from './pages/ChatRoom';
import Home from './pages/Home';
import Rules from './pages/Rules';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatLobby />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
