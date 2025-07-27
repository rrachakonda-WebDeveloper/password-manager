import React from "react";

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer mx-auto flex justify-between item-center px-4 py-5 h-14">
        <div className="logo font-bold text-white text-2xl">
          <h1 className="text-4xl font-bold text-center">
            <span className="text-green-500 px-1">&lt;</span>
            Pass
            <span className="text-green-500  px-1">OP/&gt;</span>
          </h1>
        </div>
        {/* <ul className="flex gap-4">
          <li>
            <a className="hover:font-bold" href="/">
              Home
            </a>
          </li>
          <li>
            <a className="hover:font-bold" href="#">
              About
            </a>
          </li>
          <li>
            <a className="hover:font-bold" href="#">
              Contact Us
            </a>
          </li>
        </ul> */}

        <button className="bg-green-500 p-2 rounded-lg hover:bg-green-600 transition">
          <img className="w-8 h-8" src="./src/assets/github.svg" alt="GitHub" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
