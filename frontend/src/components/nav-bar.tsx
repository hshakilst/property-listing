"use client";
import { useState } from "react";

const NavBar: React.FC = () => {
  const [crawlerRunning, setCrawlerRunning] = useState(false);

  const handleStartCrawler = async () => {
    setCrawlerRunning(true);
    const data = await handleCrawler("start");
    if (data?.message) alert(data?.message);
  };

  const handleStopCrawler = async () => {
    setCrawlerRunning(false);
    const data = await handleCrawler("stop");
    if (data?.message) alert(data?.message);
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/properties">Properties</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl" href="/">
          Property Listing
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/properties">Properties</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end px-4">
        <button
          className="btn btn-primary"
          disabled={crawlerRunning}
          onClick={handleStartCrawler}
        >
          Start Crawler
        </button>
        <div className="divider divider-horizontal"></div>
        <button
          className="btn btn-primary"
          disabled={!crawlerRunning}
          onClick={handleStopCrawler}
        >
          Stop Crawler
        </button>
      </div>
    </div>
  );
};

async function handleCrawler(
  command: "start" | "stop"
): Promise<{ message: string } | null> {
  if (!command) return null;
  const response = await fetch(`api/crawler?command=${command}`);

  if (!response?.ok) return null;

  const result: { message: string } = await response.json();

  if (!result?.message) return null;

  return result;
}

export default NavBar;
