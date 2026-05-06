import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import "hostApp/themeBootstrap";
import './index.scss';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';

const App = () => (
  <Router>
    <Routes>
      <Route path="/profile" element={<Profile self={false} />} />
      <Route path="/gallery/:id" element={<Gallery />} />
    </Routes>
  </Router>
);

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
