import { Link } from "react-router-dom";

function Card({ img }) {
  return (
    <Link
      to="/product"
      className="flex items-center justify-center w-[170px] h-[140px] p-4 bg-[#F1DEB4]"
    >
      <img className="w-full h-full object-contain" src={img} alt="" />
    </Link>
  );
}

export default Card;
