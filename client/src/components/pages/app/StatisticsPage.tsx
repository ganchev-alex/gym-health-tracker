import { useEffect } from "react";
import BodyView from "../../statistics_page/body_view/BodyView";

import styles from "./StatisticsPage.module.css";
import { useDispatch } from "react-redux";
import {
  setExplorePreviewVisibility,
  setHeadersState,
} from "../../../features/styles-manager-actions";
import EssentialsSummary from "../../statistics_page/esentails_summary/EssentailsSummary";
import MusclesGraph from "../../statistics_page/muscle_distribution/MusclesGraph";

function StatisticsPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setHeadersState({
        mainHeader: "Statistcs",
        subHeader: "This is the description of the statistics page.",
      })
    );
    dispatch(setExplorePreviewVisibility(false));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <BodyView />
        <EssentialsSummary />
      </div>
      <div className={styles.right}>
        <MusclesGraph />
      </div>
    </div>
  );
}

export default StatisticsPage;
