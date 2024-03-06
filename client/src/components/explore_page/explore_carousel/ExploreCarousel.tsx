import "./ExploreCarousel.css";

import { Parallax, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import CarouselCard from "./CarouselCard";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

function ExploreCarousel() {
  const explorations = useSelector(
    (state: RootState) => state.userActions.loadedUserData.explorations
  );

  return (
    <div className="main-wrapper">
      <div className="section slideStyle">
        <Swiper
          className="swiperParallax is-gallery"
          spaceBetween={30}
          slidesPerView={2}
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
