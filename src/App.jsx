import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import MobileTopBar from './components/layout/MobileTopBar';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './styles/global.css';
import './styles/animations.css';

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <ToastProvider>
        <TransactionProvider>
          <BrowserRouter>
            <div className="flex flex-col md:flex-row min-h-screen">
              <MobileTopBar onOpenSidebar={() => setMobileMenuOpen(true)} />
              
              <Sidebar 
                isOpen={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
              />

              <main className="app-main">
                <div className="app-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </main>

              <BottomNav />
            </div>
          </BrowserRouter>
        </TransactionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
