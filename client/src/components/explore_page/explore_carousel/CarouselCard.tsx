import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";

import "./ExploreCarousel.css";
import "swiper/swiper-bundle.css";
import { RootState } from "../../../features/store";

const CarouselCard: React.FC<{
  _id: string;
  image: string;
  heading: string;
  category: string;
}> = function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const onCardRedirect = function () {
    dispatch(setExplorePreviewVisibility(true));
    navigate(`/app/explore/${props._id}`);
  };

  return (
    <div className="swiper-slide is-gallery">
      <div className={"image-wrapper"}>
        <img data-swiper-parallax-x="25%" loading="lazy" src={props.image} />
        <div
          className={`${isMale ? "male" : "female"} gradient`}
          onClick={onCardRedirect}
        />
      </div>
      <div className={"description"}>
        <div
          className={"heading"}
          style={isMale ? { color: "#472ED8" } : undefined}
        >
          {props.heading}
        </div>
        <div
          className={"category"}
          style={isMale ? { backgroundColor: "#472ED8" } : undefined}
        >
          {props.category}
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
