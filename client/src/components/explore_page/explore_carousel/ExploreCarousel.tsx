import "./ExploreCarousel.css";

import { Parallax, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import CarouselCard from "./CarouselCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { useEffect, useState } from "react";

function ExploreCarousel() {
  const explorations = useSelector(
    (state: RootState) => state.userActions.loadedUserData.explorations
  );

  const [slidesPerView, setSlidesPerView] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1150) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(2);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-wrapper">
      <div className="section slideStyle">
        <Swiper
          className="swiperParallax is-gallery"
          spaceBetween={30}
          slidesPerView={slidesPerView}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          centeredSlides={true}
          speed={500}
          loop
          grabCursor
          modules={[Parallax, Autoplay]}
        >
          {explorations.map((card) => (
            <SwiperSlide className="swiper-slide is-gallery" key={card._id}>
              <CarouselCard
                _id={card._id}
                heading={card.title}
                category={card.category}
                image={card.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ExploreCarousel;
