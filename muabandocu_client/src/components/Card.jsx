import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Productcard from "./Productcard";

function Card({ products }) {
  return (
    <section className="py-3 container">
      <div>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          navigation
          // pagination={{ type: "bullets" }}
          modules={[Pagination, Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="w-full rounded-lg"
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <Productcard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Card;
