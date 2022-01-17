import React, { useState } from 'react';
import './App.css';
import Portfolio from './portfolio/pages/Portfolio';

function App() {
  const [portfolio, setPortfolio] = useState([])

  return (
    <div className="App">
      <Portfolio />
    </div>
  );
}

export default App;
