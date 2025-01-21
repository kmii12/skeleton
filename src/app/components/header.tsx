"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./header.module.scss"; // モジュール化スタイルをインポート

// import handlePrevMonth from "../page";
// import handleNextMonth from "../page";

const Header = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const changeYear = (offset: number) => setYear(year + offset);

  const changeMonth = (offset: number) => {
    const newMonth = month + offset;
    if (newMonth < 1) {
      setMonth(12);
      setYear(year - 1);
    } else if (newMonth > 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
  };

  return (
    <header className={styles.header}>
      {" "}
      {/* クラス名をstylesオブジェクトを使って設定 */}
      {/* 年と月 */}
      <div className={styles.header__yearMonth}>
        <div className={styles.header__year}>
          <button onClick={() => changeYear(-1)} className={styles.header__btn}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className={styles.header__text}>{year}</span>
          <button onClick={() => changeYear(1)} className={styles.header__btn}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className={styles.header__month}>
          <button
            onClick={() => changeMonth(-1)}
            className={styles.header__btn}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className={styles.header__text}>{monthNames[month - 1]}月</span>
          <button onClick={() => changeMonth(1)} className={styles.header__btn}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
      {/* 検索バーとハンバーガーメニュー */}
      <div className={styles.header__actions}>
        <div className={styles.header__search}>
          <input
            type="text"
            placeholder=""
            className={styles.header__searchInput}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className={styles.header__searchIcon}
          />
        </div>
        <button className={styles.header__btn}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      {/* <button className={styles.nextButton} onClick={handleNextMonth}>
        次の月
      </button> */}
    </header>
  );
};

export default Header;
