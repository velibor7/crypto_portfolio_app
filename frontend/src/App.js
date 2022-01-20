import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from './portfolio/pages/Portfolio';
import useToken from './hooks/useToken'
import Login from './auth/Login';
import Header from './navigation/Header';
import './App.css';

function App() {
  const [ portfolio, setPortfolio ] = useState([])
  const { token, removeToken, setToken } = useToken();

  return (
    <BrowserRouter>
      <div className="App">
        <Header token={removeToken} />
        {!token && token !=="" && token !== undefined?
        <Login setToken={setToken} />
        : (
          <>
          <Routes>
            <Route exact path='/portfolio' element={<Portfolio token={token} />}></Route>
          </Routes>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
