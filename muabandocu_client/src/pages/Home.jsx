import Slideshow from "../components/Slideshow";
import { NavLink } from "react-router-dom";
import { card } from "../imgs";
import Card from "../components/Card";
import Loading from "../components/Loading";
import Productcard from "../components/Productcard";
import { useEffect, useState } from "react";
import { fetchProducts } from "../apis/ProductApi";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(setProducts, setTotalPages, setLoading, page);
  }, [page]);
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
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
              <NavLink to={"/product"}>
                <button className="px-6 border-[1px] border-[#005D63] py-3 text-lg font-medium rounded-md hover:bg-[#005D63] hover:border-transparent hover:text-white text-[#005D63]">
                  Xem tất cả
                </button>
              </NavLink>
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
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <span className="text-lg">{`${page} `}</span>
            <button
              className="px-2 py-2 mx-2 bg-[#005d6312] rounded hover:bg-[#005c6338] border border-primaryColor hover:border"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;
