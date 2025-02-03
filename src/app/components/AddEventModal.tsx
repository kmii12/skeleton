"use client";

import React, { useState } from "react";
import styles from "./AddEventModal.module.scss";
//db
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

//framer motion
import { easeInOut, motion } from "framer-motion";

interface AddEventModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ setShowModal }) => {
  const [title, setTitle] = useState<string>(""); //予定のタイトル
  const [isAllday, setIsAllday] = useState<boolean>(false); //終日かどうか
  // const [startDate, setStartDate] = useState<string | null>(null); // 開始日時
  // const [endDate, setEndDate] = useState<string | null>(null); // 終了日時
  // const [startTime, setStartTime] = useState<string | null>(null); // 開始時間
  // const [endTime, setEndTime] = useState<string | null>(null); // 終了時間
  const [startDateTime, setStartDateTime] = useState<string | null>(null); // 開始日時
  const [endDateTime, setEndDateTime] = useState<string | null>(null); // 終了日時
  // const [date, setDate] = useState<string | null>(null);

  const [eventColor, setEventColor] = useState<string>(""); // 予定のカラー
  // const colorOptions = [
  //   { value: "work", label: "", color: "#f67fc8" },
  //   { value: "events", label: "", color: "#45d758" },
  //   { value: "school", label: "", color: "#a8acbd" },
  //   { value: "jobHunting", label: "", color: "#4bccff" },
  //   { value: "birthday", label: "", color: "#edc511" },
  //   { value: "goOn", label: "", color: "#ff774a" },
  // ];
  const [memo, setMemo] = useState<string>(""); // メモ
  // const [history, setHistory] = useState<string>(""); // 履歴

  // 予定をfireStoreに追加する関数
  const addEvent = async (e: React.FormEvent) => {
    if (!title) return; // タイトルが入力されていない場合は保存しない

    //startDateTime (形式：YYYY-MM-DD T HH:mm)になってるからTの前が日付、後ろが時間で分ける
    const startDate = startDateTime ? startDateTime.split("T")[0] : null;
    const startTime = startDateTime ? startDateTime.split("T")[1] : null;

    const endDate = endDateTime ? endDateTime.split("T")[0] : null;
    const endTime = endDateTime ? endDateTime.split("T")[1] : null;

    e.preventDefault();
    try {
      const eventRef = collection(db, "events"); // Firestoreの'events'コレクション
      await addDoc(eventRef, {
        title,
        isAllday,
        startTime, // 終日設定の場合nullにする
        endTime,
        startDate,
        endDate,
        memo,
        date: startDate,
        // date: new Date().toISOString().split("T")[0], // 現在の日付を保存
      });
      setShowModal(false); // モーダル閉じる
      alert("予定が追加されました！");
    } catch (error) {
      console.error("予定の追加に失敗:", error);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     await addDoc(collection(db, "events"), {
  //       title,
  //       isAllday,
  //       startDate: isAllday ? null : startDate, // 終日設定の場合、startDateとendDateをnullにする
  //       endDate: isAllday ? null : endDate,
  //       memo,
  //       history,
  //       date: new Date().toISOString().split("T")[0], // 現在の日付を保存
  //     });
  //   } catch (error) {
  //     console.error("予定の追加に失敗:", error);
  //   }
  // };

  //animation
  const modalAnimation = {
    hidden: { y: "100%", opacity: 1 },
    visible: {
      y: -740,
      opacity: 1,

      transition: {
        type: "tween",
        stiffness: 100,
        damping: 20,
        ease: easeInOut,
      },
    },
    exit: { y: "100%", opacity: 1, scale: 0.9, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className={styles.modal}
      variants={modalAnimation}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.modalContent}>
        <form onSubmit={addEvent}>
          <header>
            <button
              onClick={() => setShowModal(false)}
              className={styles.closeBtn}
            >
              キャンセル
            </button>

            <h2>新しい予定</h2>
            <button onClick={addEvent} className={styles.storageBtn}>
              保存
            </button>
          </header>
          <main>
            <section className={styles.ttlContainer}>
              <input
                className={styles.ttlWrap}
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button className={styles.ttlDeleteBtn}>
                {" "}
                <FontAwesomeIcon icon={faX} />
              </button>
              <button className={styles.regularBtn}>定型</button>
            </section>

            {/* 履歴 */}
            <h3 className={styles.historyTtl}>履歴</h3>
            {/* <input
              type="text"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              className={styles.historyContainer}
            /> */}
            <div className={styles.historyContainer}>
              <section className={styles.historyItem}>美容室</section>
              <section className={styles.historyItem}>病院</section>
              <section className={styles.historyItem}>会社　一次面接</section>
              <section className={styles.historyItem}>喫茶</section>
              <section className={styles.historyItem}>飲み会</section>
              <section className={styles.historyItem}>打ち上げ</section>
            </div>

            <label className={styles.isAlldayContainer}>
              <h3>終日</h3>

              <input
                type="checkbox"
                checked={isAllday}
                onChange={() => setIsAllday(!isAllday)}
                required
              />
            </label>

            {/* 終日じゃない場合の日時入力 */}
            {!isAllday && (
              <div className={styles.isNotAlldayWContainer}>
                <input
                  className={styles.startDateWrap}
                  type="datetime-local"
                  value={startDateTime || ""}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  step="1800"
                  required
                />

                <input
                  className={styles.endDateWrap}
                  type="datetime-local"
                  value={endDateTime || ""}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  step="1800"
                  required
                />
              </div>
            )}

            {/* 予定のカラー */}
            <select
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
              className={styles.colorSelect}
            >
              <option value="red">赤</option>
              <option value="blue">青</option>
              <option value="green">緑</option>
              <option value="yellow">黄</option>
              <option value="purple">紫</option>
              <option value="orange">オレンジ</option>
              required
            </select>

            <div className={styles.selectContainer}>
              <h3>繰り返し</h3>
              <select className={styles.repeatSelect}>
                <option value="なし" selected>
                  なし
                </option>
              </select>
            </div>
            <div className={styles.selectContainer}>
              <h3>通知</h3>
              <label>
                <select className={styles.repeatSelect}>
                  <option value="なし" selected>
                    なし
                  </option>
                </select>
              </label>
            </div>

            {/* メモ */}
            <textarea
              placeholder="メモ"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={styles.memoWrap}
            />
          </main>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEventModal;
