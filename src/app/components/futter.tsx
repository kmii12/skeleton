"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCalendar,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar as faRegCalendar } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./futter.module.scss"; // 修正したSCSSファイルをインポート

const Futter = () => {
  // // 初期状態で "calendar1" をアクティブに設定
  const [activeButton, setActiveButton] = useState<string>("calendar1");
  // const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isCalendarOn, setIsCalendarOn] = useState(true);

  const handleButtonClick = (button: string) => {
    console.log(`クリック ${button}`);

    setActiveButton(button);

    if (button === "calender2") {
      window.location.href = "/SubCalender";
      console.log("Button clicked");
    }
    if (button === "calender1") {
      window.location.href = "/MainCalender";
      console.log("Button clicked");
    }
  };

  useEffect(() => {
    // デフォルトで "calendar1" をアクティブに設定
    // setActiveButton("calendar1");
    console.log("Active Button:", activeButton);
  }, [activeButton]); // 初回レンダリング時に実行

  return (
    <div className={styles.footer}>
      <button
        className={`${styles.footer__button} ${
          activeButton === "list" ? styles.active : ""
        }`}
        onClick={() => handleButtonClick("list")}
      >
        <FontAwesomeIcon icon={faList} />
      </button>
      <div className={styles.footer__buttonsMiddle}>
        <Link
          className={`${styles.footer__button} ${
            activeButton === "calendar1" ? styles.active : ""
          }`}
          onClick={() => {
            setIsCalendarOn(true);
            handleButtonClick("calendar1");
          }}
          href={"/MainCalender"}
        >
          <FontAwesomeIcon icon={faCalendar} />
        </Link>
        <Link
          className={`${styles.footer__button} ${
            activeButton === "calendar2" ? styles.active : ""
          }`}
          onClick={() => {
            setIsCalendarOn(false);
            handleButtonClick("calendar2");
          }}
          href={"/SubCalender"}
        >
          <FontAwesomeIcon icon={faRegCalendar} />
        </Link>
      </div>
      <button
        className={`${styles.footer__button} ${
          activeButton === "listCheck" ? styles.active : ""
        }`}
        onClick={() => handleButtonClick("listCheck")}
      >
        <FontAwesomeIcon icon={faListCheck} />
      </button>
    </div>
  );
};

export default Futter;
