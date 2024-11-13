import Button from "./Button";

function Card({ img, title, price }) {
  return (
    <div className="col-span-1 flex flex-col">
      <img src={img} alt={title} className="h-40 w-full object-cover" />
      <div className="px-2 py-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm font-medium">{price.toLocaleString()} VND</p>
        <Button text={"Mua ngay"} />
      </div>
    </div>
  );
}

export default Card;
