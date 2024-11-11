import React from 'react';
import { BrowserRouter as Router, Route, Routes, HashRouter } from 'react-router-dom';
import Home from './pages/Home';
import MeditationResources from './pages/MeditationResources';
import ProgressTracker from './pages/ProgressTracker';
import Navbar from './components/Navbar';
import * as Constants from './lib/Constants';

const App: React.FC = () => {
  const MyRouter = Constants.HASH_ROUTER ? HashRouter : Router;

  return (
    <MyRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<MeditationResources />} />
        <Route path="/progress" element={<ProgressTracker />} />
      </Routes>
    </MyRouter>
  );
};

export default App;
