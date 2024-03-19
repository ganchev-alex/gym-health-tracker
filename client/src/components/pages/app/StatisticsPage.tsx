import React, { useEffect } from "react";
import BodyView from "../../statistics_page/body_view/BodyView";

import styles from "./StatisticsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setExplorePreviewVisibility,
  setHeadersState,
} from "../../../features/styles-manager-actions";
import EssentialsSummary from "../../statistics_page/esentails_summary/EssentailsSummary";
import MusclesGraph from "../../statistics_page/muscle_distribution/MusclesGraph";
import PeriodControl from "../../statistics_page/controlls/PeriodControl";
import { RootState } from "../../../features/store";
import HelpModal from "../../UI/help_modal/HelpModal";
import EssentialsPreview from "../../statistics_page/esentails_summary/EssentialsPreview";

function StatisticsPage() {
  const dispatch = useDispatch();
  const { helpModal, summaryPreviewModal } = useSelector(
    (state: RootState) => state.modalsManager
  );

  useEffect(() => {
    dispatch(
      setHeadersState({
        mainHeader: "Statistics",
        subHeader:
          "Track your your gym performance and monitor your progress and achievements",
      })
    );
    dispatch(setExplorePreviewVisibility(false));
  }, []);

  return (
    <React.Fragment>
      {helpModal.visibility && <HelpModal />}
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <PeriodControl />
          <MusclesGraph />
        </div>
        <div className={styles.right}>
          <BodyView />
          <EssentialsSummary />
        </div>
      </div>
      {summaryPreviewModal.visibility && <EssentialsPreview />}
    </React.Fragment>
  );
}

export default StatisticsPage;
