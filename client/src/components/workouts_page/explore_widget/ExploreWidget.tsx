import ContentCard from "./ContentCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay, Mousewheel } from "swiper/modules";

import styles from "./ExploreWidget.module.css";
import "./swiper-pagination.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

const ExploreWidget = function () {
  const explorations = useSelector(
    (state: RootState) => state.userActions.loadedUserData.explorations
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles.widget}>
      <div className={`content-wrapper ${isMale ? "male" : "female"}`}>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          effect={"fade"}
          loop={true}
          speed={300}
          autoplay={{ delay: 10000, disableOnInteraction: false }}
          mousewheel={{ invert: false }}
          pagination={{ clickable: true }}
          modules={[EffectFade, Pagination, Autoplay, Mousewheel]}
        >
          {explorations.map((card) => {
            return (
              <SwiperSlide key={card._id}>
                <ContentCard
                  _id={card._id}
                  imageSrc={card.image}
                  title={card.title}
                  description={card.content.description}
                  category={card.category}
                  duration={card.duration}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ExploreWidget;
