import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  color,
  bgColor,
  size,
  text,
  borderRadius,
  link = "",
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        background: bgColor,
        color,
        borderRadius,
      }}
      className={`text-${size} p-3 hover:drop-shadow-xl`}
    >
      {link ? (
        <Link target="_blank" to={link}>
          {text}
        </Link>
      ) : (
        text
      )}
    </button>
  );
};
export default Button;
