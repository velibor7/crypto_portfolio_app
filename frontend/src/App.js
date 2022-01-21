import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from './portfolio/pages/Portfolio';
import useAuth from './hooks/useAuth'
import Login from './auth/Login';
import Header from './navigation/Header';
import './App.css';

const App = () => {
  const { token, userId, removeToken, setToken } = useAuth();

  return (
    <BrowserRouter>
      <div className="App">
        <Header removeToken={removeToken} token={token} />
        {!token && token !=="" && token !== undefined?
        <Login setToken={setToken} />
        : (
          <>
          <Portfolio token={token} userId={userId} />
          {/*
          <Routes>
            <Route exact path='/portfolio' element={<Portfolio token={token} userId={userId} />}></Route>
          </Routes>*/}
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
