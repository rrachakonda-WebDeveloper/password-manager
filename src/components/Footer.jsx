import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className= "bg-[#192734] text-white py-4 text-center mt-auto">
      <div className="text-sm">
        <div className="logo font-bold text-white text-2xl">
          <h1 className="text-4xl font-bold text-center">
            <span className="text-green-500 px-1">&lt;</span>
            Pass
            <span className="text-green-500 px-1">OP/&gt;</span>
          </h1>
        </div>
        <span>© {currentYear} Made with ❤️ by Rachakonda Rajesh</span>
      </div>
    </footer>
  );
};

export default Footer;
