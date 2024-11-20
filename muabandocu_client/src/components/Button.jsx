/**
 * @description  Đây là Button Nghiệp viết
 *
 * @param {JSX.Element} children đây là nội dung của Button
 * @param {string} padding Phần padding của button
 * @param {string} width Chiều rộng
 * @param {string} text The text style of the button
 * @param {boolean} disabled Nếu đúng thì ẩn button
 *
 * @returns {JSX.Element} A <button> element with the specified styles
 */
const Button = ({
  children,
  padding,
  width,
  fontSize,
  disabled = false,
  onClick,
  type = "button",
}) => {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`text-white opacity-80 ${fontSize} flex items-center justify-center bg-[#181d1d] ${padding} ${width} rounded-md hover:bg-[#c7dddd] hover:text-[#131717] font-medium font-manrope`}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
