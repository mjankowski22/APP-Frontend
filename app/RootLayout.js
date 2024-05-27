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
        <div className="card" onClick={() => setSelectedPage(1)}>
          <h2>
            1 <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(2)}>
          <h2>
            2 <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(3)}>
          <h2>
            3 <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </div>
        <div className="card" onClick={() => setSelectedPage(4)}>
          <h2>
            4 <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </div>
      </div>
      <div className="content">{pageContent}</div>
    </div>
  );
}
