"use client";



import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Page1 from "./components/WebSocketComponent";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Page4 from "./components/DataChart";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [selectedPage, setSelectedPage] = useState(1);


  let pageContent;
  switch (selectedPage) {
    case 1:
      pageContent = <Page1 />;
      break;
    case 2:
      pageContent = <Page2 />;
      break;
    case 3:
      pageContent = <Page3 />;
      break;
    case 4:
      pageContent = <Page4 />;
      break;
    default:
      pageContent = <div>Select a page</div>;
  }

  return (

  
    
      
<div className="layout">
    <div className="sidebar">

      <div className="logo-container">
      <img  src="/images/logo.png" alt="App Logo" className="app-logo" />
      <div  className="app-title">
            A<span className="orange-letter">P</span>P
          </div>
      </div>



      <div className="card" onClick={() => setSelectedPage(1)}>
        <h2>Konsola</h2>
        <p>Wyślij polecenie do pływającego urządzenia</p>
      </div>
      <div className="card" onClick={() => setSelectedPage(2)}>
        <h2>Mapa</h2>
        <p>Oznacz obszar działania pływającego urządzenia</p>
      </div>
      <div className="card" onClick={() => setSelectedPage(3)}>
        <h2>Dane LORA</h2>
        <p>Pokaż dane z LORAwan</p>
      </div>
      <div className="card" onClick={() => setSelectedPage(4)}>
        <h2>Dane pomiarowe</h2>
        <p>Wyświetl dane pomiarowe</p>
      </div>
    </div>
    
    <div className="rightSide"> 
    <div className="top-bar">
    <p className="top-text">Nagłówek na górze strony</p>
  </div>
    <div className="content">{pageContent}</div>
  </div>
</div>
   
  );
}
