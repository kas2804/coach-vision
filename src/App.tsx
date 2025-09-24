import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;