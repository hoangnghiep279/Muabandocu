const Input = ({ margin, placeholder, width, type }) => {
  return (
    <div className={`${width} h-11 border-2 ${margin} rounded-md px-2`}>
      <input
        type={type}
        className="default-input w-full h-full"
        placeholder={placeholder}
      />
    </div>
  );
};
export default Input;
