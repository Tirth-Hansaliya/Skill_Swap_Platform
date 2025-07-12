import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfileEdit from './components/ProfileEdit';
import SkillFilter from './components/SkillFilter';
import ExchangeManager from './components/ExchangeManager';
import Messaging from './components/Messaging';
import Profile from './components/Profile';
import AllChats from './components/AllChats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<SkillFilter />} />
        <Route path="/exchanges" element={<ExchangeManager />} />
         <Route path="/all-chats" element={<AllChats/>} />
        <Route path="/messages/:recipientId" element={<Messaging />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
