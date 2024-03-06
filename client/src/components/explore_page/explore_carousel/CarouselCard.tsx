import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";

import "./ExploreCarousel.css";
import "swiper/swiper-bundle.css";

const CarouselCard: React.FC<{
  _id: string;
  image: string;
  heading: string;
  category: string;
}> = function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCardRedirect = function () {
    dispatch(setExplorePreviewVisibility(true));
    navigate(`/app/explore/${props._id}`);
  };

  return (
    <div className="swiper-slide is-gallery">
      <div className={"image-wrapper"}>
        <img data-swiper-parallax-x="25%" loading="lazy" src={props.image} />
        <div className={"gradient"} onClick={onCardRedirect} />
      </div>
      <div className={"description"}>
        <div className={"heading"}>{props.heading}</div>
        <div className={"category"}>{props.category}</div>
      </div>
    </div>
  );
};

export default CarouselCard;
