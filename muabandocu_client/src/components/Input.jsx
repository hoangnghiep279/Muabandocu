const Input = ({ margin, placeholder, width }) => {
  return (
    <div className={`${width} h-11 border-2 ${margin} rounded-md px-2`}>
      <input
        type="text"
        className="default-input w-full h-full"
        placeholder={placeholder}
      />
    </div>
  );
};
export default Input;
