const Input = (props) => {
  return (
    <div
      className={`${props.width} h-11 border-2 ${props.margin} rounded-md px-2`}
    >
      <input
        name={props.name}
        type={props.type}
        className="default-input w-full h-full"
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
};
export default Input;
