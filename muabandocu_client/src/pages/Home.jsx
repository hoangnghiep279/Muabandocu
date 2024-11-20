import Slideshow from "../components/Slideshow";
import { card } from "../imgs";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import axios from "axios";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        setProducts(response.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loading />;
  return (
    <main>
      <Slideshow />
      <div className="container">
        <div className="flex flex-wrap gap-7 mt-16">
          {card.map((item, index) => (
            <Card key={index} img={item} />
          ))}
        </div>
        <div className="my-16">
          <div>
            <h2 className="font-slab font-bold text-4xl">Sản phẩm mới nhất</h2>
            <div className="flex justify-between items-center my-4">
              <p className="w-[470px] font-light">
                Nhìn qua các sản phẩm mới của chúng tôi và làm cho ngày của bạn
                đẹp hơn và vui vẻ hơn.
              </p>
              <button className="px-6 border-[1px] border-[#005D63] py-3 text-lg font-medium rounded-md hover:bg-[#005D63] hover:border-transparent hover:text-white text-[#005D63]">
                Xem tất cả
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-7 ">
            {products.length > 0 ? (
              products.map((product) => (
                <Productcard key={product.id} product={product} />
              ))
            ) : (
              <p>Không có sản phẩm nào!</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;
