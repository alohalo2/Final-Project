import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import '../css/Layout/Layout.css';

const Layout = () => {
  return (
    <>
      <Header/>
        <main>
            <Outlet/>
        </main>
      <Footer/>
    </>
  );
};

export default Layout;