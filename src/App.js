import React from "react";
import { Routes, Route } from 'react-router-dom'

import './index.css';
import "./assets/css/bootstrap.min.css";
import "./assets/css/now-ui-kit.min.css";
import 'react-notifications/lib/notifications.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Layout from  "./components/Layout"
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
           <Route path="/" element={<Products />} />
           <Route path="/add-product" element={<AddProduct/>} />
        </Route>
    </Routes>
  )
}

export default App
