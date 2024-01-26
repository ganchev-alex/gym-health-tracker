import Widget from "../../layout/Widget";
import ContentCard from "./ContentCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay, Mousewheel } from "swiper/modules";

import styles from "./ExploreWidget.module.css";
import "./swiper-pagination.css";

const DUMMY_DATA = [
  {
    imageSrc:
      "https://images.unsplash.com/photo-1518310952931-b1de897abd40?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Cardio Blast",
    description:
      "Boost your heart rate with high-intensity interval training, combining sprints and jumping jacks for an effective full-body workout.",
    category: "Cardio",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1594917300528-262a0d67aaa1?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Strength Circuit",
    description:
      "Target major muscle groups with a circuit of squats, push-ups, and planks. Ideal for building strength and endurance.",
    category: "Cardio & Strength",
  },
  {
    imageSrc:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2120&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Yoga Flow",
    description:
      "Find inner peace and flexibility in this yoga session. A gentle sequence of poses to improve balance and reduce stress.",
    category: "Yoga & Meditation",
  },
];

const ExploreWidget = function () {
  return (
    <div className={styles.widget}>
      <div className="content-wrapper">
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
          {DUMMY_DATA.map((card, index) => {
            return (
              <SwiperSlide key={index}>
                <ContentCard
                  imageSrc={card.imageSrc}
                  title={card.title}
                  description={card.description}
                  category={card.category}
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
