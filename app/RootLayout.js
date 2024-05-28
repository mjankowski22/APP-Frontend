"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Page1 from "./components/Page_Console";
import Page2 from "./components/Page_Map";
import Page3 from "./components/Page_DataLoRa";
import Page4 from "./components/Page_DataChart";
import Page5 from "./components/Page_Settings";
import io from 'socket.io-client';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [selectedPage, setSelectedPage] = useState(1);
  const [fiveGStatus, setFiveGStatus] = useState(0);
  const [wifiStatus, setWifiStatus] = useState(0);   // Domyślny status Wifi

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Upewnij się, że URL jest zgodny z URL-em serwera Flask

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('fiveg', (data) => {
      setFiveGStatus(data.status);
    });

    socket.on('wifi', (data) => {
      setWifiStatus(data.status);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setFiveGStatus(0); // Ustaw status na 0 po rozłączeniu
      setWifiStatus(0); // Ustaw status na 0 po rozłączeniu
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
    case 5:
        pageContent = <Page5 wifiStatus={wifiStatus} setWifiStatus={setWifiStatus} />;
        break;
    default:
      pageContent = <div>Select a page</div>;
  }

  return (
    <div className="layout">
      
      <div className="sidebar">
        <div className="logo-container">
          <img src="/images/logo.png" alt="App Logo" className="app-logo" />
          <div className="app-title">
            A<span className="orange-letter">P</span>P
          </div>
        </div>

        <div className="card" onClick={() => setSelectedPage(1)}>
          <h2>Konsola</h2>
        </div>
        <div className="card" onClick={() => setSelectedPage(2)}>
          <h2>Mapa</h2>
        </div>
        <div className="card" onClick={() => setSelectedPage(3)}>
          <h2>Dane LORA</h2>
        </div>
        <div className="card" onClick={() => setSelectedPage(4)}>
          <h2>Dane pomiarowe</h2>
        </div>
        <div className="card" onClick={() => setSelectedPage(5)}>
          <h2>Ustawienia</h2>
        </div>        
      </div>

      <div className="rightSide">
        <div className="top-bar">
          <p className="top-text">5g/LTE <span style={{ color: fiveGStatus === 1 ? 'green' : 'red' }}>●</span></p>
          <p className="top-text">WiFi <span style={{ color: wifiStatus === 1 ? 'green' : 'red' }}>●</span></p>
        </div>

        <div className="content">{pageContent}</div>
      </div>
    </div>
  );
}
