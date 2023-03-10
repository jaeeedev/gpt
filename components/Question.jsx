import React from "react";
import styles from "../pages/index.module.css";

const Question = ({ question }) => {
  // 질문이 발생하면(submit 이벤트) 그 텍스트를 띄우기
  return question ? (
    <div className={styles.question}>
      <div className={styles["bot-tag"]}>you</div>
      <div className={styles["question-text"]}>{question}</div>
    </div>
  ) : null;
};

export default React.memo(Question);
