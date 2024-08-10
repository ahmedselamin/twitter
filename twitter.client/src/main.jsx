import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import Tweets from "./Tweets.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/tweets" element={<Tweets />} />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
