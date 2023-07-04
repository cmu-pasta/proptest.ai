import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Proptest from './pages/proptest';

const Main = () => {
  return (
    <Routes> {/* The Switch decides which component to show based on the current URL.*/}
      <Route exact path='/' element={<Home />} />
      <Route index element={<Home />} />
      <Route exact path='/playground' element={<Proptest />} />
    </Routes>
  );
}

export default Main;
