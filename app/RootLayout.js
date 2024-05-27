"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Page4 from "./components/Page4";

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
        <h1 className="app-title">APP</h1>
        <div className="card" onClick={() => setSelectedPage(1)}>
          <h2>
            Konsola 
          </h2>
          <p>Wyslij polecenie do plawy</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(2)}>
          <h2>
            Mapa 
          </h2>
          <p>Oznacz obszar działania pławy</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(3)}>
          <h2>
            Dane LORA 
          </h2>
          <p>Pokaż dane z LORAwan</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(4)}>
          <h2>
            Dane pomiarowe 
          </h2>
          <p>
            Wyswietl dane pomiarowe
          </p>
        </div>
      </div>
      <div className="content">{pageContent}</div>
    </div>
  );
}
