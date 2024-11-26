import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import { Pagination, FreeMode } from "swiper";
import { slide1, slide2, slide3, slide4 } from "../imgs";

const images = [
  {
    src: slide4,
    alt: "slide1",
  },
  {
    src: slide2,
    alt: "slide2",
  },
  {
    src: slide3,
    alt: "slide3",
  },
  {
    src: slide1,
    alt: "slide4",
  },
];
function Slideshow() {
  return (
    <section className="py-8">
      <div>
        <Swiper
          navigation
          pagination={{ type: "bullets" }}
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="h-[600px] w-full rounded-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="block h-full w-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Slideshow;
