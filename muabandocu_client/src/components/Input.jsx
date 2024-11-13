const Input = ({ margin, placeholder, width, type, onChange, value, name }) => {
  return (
    <div className={`${width} h-11 border-2 ${margin} rounded-md px-2`}>
      <input
        name={name}
        type={type}
        className="default-input w-full h-full"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
export default Input;
