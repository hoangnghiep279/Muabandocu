const Button = ({ children, padding, width, text }) => {
  return (
    <div>
      <button
        className={`text-white opacity-80 ${text} flex items-center justify-center bg-[#181d1d] ${padding} ${width} rounded-md hover:bg-[#c7dddd] hover:text-[#131717] font-medium font-manrope`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
