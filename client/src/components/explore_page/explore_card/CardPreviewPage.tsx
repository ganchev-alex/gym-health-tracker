import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { mainAPIPath } from "../../../App";
import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { getToken } from "../../../util/auth";
import styles from "./CardPreviewPage.module.css";
import RelatedCard from "./RelatedCard";
import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";
import { setRoutinesData } from "../../../features/user-actions";
import { setNotificationState } from "../../../features/workout-page-actions";
import { setLoadingState } from "../../../features/loading-actions";
import { RootState } from "../../../features/store";
import LoadingPlane from "../../UI/loading_plane/LoadingPlane";
import { setExploreInitialState } from "../../../features/explore-actions";
import { setChoiceModalVisibility } from "../../../features/modals";
import ChoiceModal from "../../UI/choice_modal/ChoiceModal";

const CardPreview = function () {
  const dispatch = useDispatch();
  const { exploreId } = useParams();

  const { article, savedState, relatedArticles } = useLoaderData() as {
    article: Article;
    savedState: boolean;
    relatedArticles: {
      _id: string;
      title: string;
      category: string;
      image: string;
    }[];
  };
  const [savedArticle, setSavedArticle] = useState(savedState);

  const loadingState = useSelector(
    (state: RootState) => state.loadingManager.isLoading
  );
  const modalVisibility = useSelector(
    (state: RootState) => state.modalsManager.choiceModal.visibility
  );
  const { isMale } = useSelector((state: RootState) => state.userActions);

  useEffect(() => {
    dispatch(setExplorePreviewVisibility(true));
    dispatch(setExploreInitialState());
  }, []);

  const onSaveArticle = function (routine?: boolean) {
    if (savedArticle) {
      dispatch(setChoiceModalVisibility(true));
      return;
    }

    if (routine) {
      saveRoutine();
    } else {
      saveArticle();
    }
  };

  const onRemoveArticle = async function () {
    dispatch(setLoadingState(true));
    try {
      const response = await fetch(
        `${mainAPIPath}/explore/remove?exploreId=${exploreId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        setSavedArticle(false);
        dispatch(
          setNotificationState({
            message: "👍🏻 Article removed successfully!",
            visibility: true,
          })
        );
      } else {
        dispatch(
          setNotificationState({
            message: "👎🏻 Article wasn't removed.",
            visibility: true,
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          message: "👎🏻 Article wasn't removed.",
          visibility: true,
        })
      );
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 4000);
    }
  };

  const saveRoutine = async function () {
    dispatch(setLoadingState(true));
    try {
      const response = await fetch(
        `${mainAPIPath}/explore/save-routine?exploreId=${exploreId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        const data: any = await response.json();
        setSavedArticle(true);
        dispatch(setRoutinesData({ routines: data.newRoutines, append: true }));
        dispatch(
          setNotificationState({
            message: "🎉 Routine saved succesfully!",
            visibility: true,
          })
        );
      } else {
        dispatch(
          setNotificationState({
            message: "😖 Couldn't save the routine.",
            visibility: true,
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          message: "😖 Couldn't save the routine.",
          visibility: true,
        })
      );
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 4000);
    }
  };

  const saveArticle = async function () {
    dispatch(setLoadingState(true));
    try {
      const response = await fetch(
        `${mainAPIPath}/explore/save?exploreId=${exploreId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        setSavedArticle(true);
        dispatch(
          setNotificationState({
            message: "🎉 Article saved succesfully!",
            visibility: true,
          })
        );
      } else {
        dispatch(
          setNotificationState({
            message: "😖 Couldn't save the article.",
            visibility: true,
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          message: "😖 Couldn't save the article.",
          visibility: true,
        })
      );
    } finally {
      dispatch(setLoadingState(false));
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 4000);
    }
  };

  return (
    <React.Fragment>
      {modalVisibility && (
        <ChoiceModal
          message="Unsave article?"
          description="By proceeding with this action you will remove your routine from your saved collection. Do you really want to continue?"
          noButtonLable="Cancel"
          yesButtonLable="Remove"
          acceptAction={onRemoveArticle}
        />
      )}
      <div className={styles.page}>
        <article className={styles.article}>
          <header className={styles.header}>
            {(article.content.type === "routine" ||
              article.content.type === "article") && (
              <img src={article.image} />
            )}
            {article.content.type === "video" && (
              <iframe
                src={`https://www.youtube.com/embed/${article.content.source}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                frameBorder={0}
              ></iframe>
            )}
            <div className={styles.details}>
              <span>
                <p style={isMale ? { backgroundColor: "#472ed8" } : undefined}>
                  <TimerIcon />
                  {secondsConverter(article.duration)}
                </p>
                <p style={isMale ? { color: "#472ed8" } : undefined}>
                  {article.category}
                </p>
              </span>
              <p
                className={styles["content-type"]}
                style={{
                  backgroundColor: `${
                    article.content.type === "video" ? "#777da7" : "#4b2840"
                  }`,
                }}
              >
                {article.content.type.charAt(0).toUpperCase() +
                  article.content.type.slice(1)}
              </p>
            </div>
            <h1>{article.content.title}</h1>
            <h3>{article.content.description}</h3>
          </header>
          <main
            className={styles.main}
            dangerouslySetInnerHTML={{ __html: article.content.body }}
          />
          <div
            className={styles.controlls}
            style={
              loadingState ? { width: "25%", paddingTop: "3em" } : undefined
            }
          >
            {loadingState ? (
              <LoadingPlane />
            ) : (
              <button
                className={`${
                  savedArticle
                    ? styles["saved-button"]
                    : `${isMale ? styles.male : styles.female} ${
                        styles["main-button"]
                      }`
                }`}
                onClick={() =>
                  onSaveArticle(article.content.type === "routine")
                }
              >
                {savedArticle
                  ? "Remove"
                  : `+ Save ${
                      article.content.type.charAt(0).toUpperCase() +
                      article.content.type.slice(1)
                    }`}
              </button>
            )}
          </div>
        </article>
        <aside className={styles.aside}>
          <h4 style={isMale ? { color: "#472ed8" } : undefined}>
            You may also like
          </h4>
          {relatedArticles.map((article) => (
            <RelatedCard
              key={article._id}
              _id={article._id}
              title={article.title}
              category={article.category}
              image={article.image}
            />
          ))}
        </aside>
      </div>
    </React.Fragment>
  );
};

export default CardPreview;

interface Article {
  title: string;
  category: string;
  duration: number;
  image: string;
  keywords: [string];
  target: [string];
  level: [string];
  sex: string;
  content: {
    type: string;
    title: string;
    description: string;
    body: string;
    routines: string[];
    source: string;
  };
}

export const previewLoader = async function ({ params }: any) {
  const exploreId = params.exploreId;
  try {
    const response = await fetch(
      `${mainAPIPath}/explore/exploration?exploreId=${exploreId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (response.ok) {
      const data: {
        message: string;
        article: Article;
        savedState: boolean;
        relatedArticles: {
          _id: string;
          title: string;
          category: string;
          image: string;
        }[];
      } = await response.json();
      return {
        article: data.article,
        savedState: data.savedState,
        relatedArticles: data.relatedArticles,
      };
    }

    return null;
  } catch {
    return null;
  }
};
