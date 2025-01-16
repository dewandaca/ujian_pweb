import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StokProvider } from './context/StokContext';
import WelcomingPage from './pages/WelcomingPage';

const App = () => {
  return (
    <StokProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomingPage />} />
        </Routes>
      </Router>
    </StokProvider>
  );
};

export default App;
