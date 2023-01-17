import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smoothly scrolling
    });
  };

  return (
    <div className="footer">
      <a onClick={scrollToTop}>Back to top &#8679;</a>
    </div>
  );
};

export default Footer;