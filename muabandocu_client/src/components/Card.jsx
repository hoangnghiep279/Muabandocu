function Card({ img }) {
  return (
    <div className="flex items-center justify-center w-[270px] h-[210px] bg-[#F1DEB4]">
      <img src={img} alt="" />
    </div>
  );
}

export default Card;
