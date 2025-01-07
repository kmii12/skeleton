"use client";

import React, { useState, useEffect } from "react";
import styles from "./AddEventModal.module.scss";
import { log } from "console";
//db
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

//framer motion
import { easeIn, easeInOut, motion } from "framer-motion";

interface AddEventModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ setShowModal }) => {
  const [eventTtl, setEventTtl] = useState<string>(""); //予定のタイトル
  const [isAllday, setIsAllday] = useState<boolean>(false); //終日かどうか
  const [startDate, setStartDate] = useState<string | null>(null); // 開始日時
  const [endDate, setEndDate] = useState<string | null>(null); // 終了日時
  const [startTime, setStartTime] = useState<string | null>(null); // 開始時間
  const [endTime, setEndTime] = useState<string | null>(null); // 終了時間

  const [eventColor, setEventColor] = useState<string>("red"); // 予定のカラー
  const [memo, setMemo] = useState<string>(""); // メモ
  const [history, setHistory] = useState<string>(""); // 履歴

  // 予定をfirestoreに追加する関数
  const addEvent = async (e: React.FormEvent) => {
    if (!eventTtl) return; // タイトルが入力されていない場合は保存しない

    e.preventDefault();
    try {
      const eventRef = collection(db, "events"); // Firestoreの'events'コレクション
      await addDoc(eventRef, {
        eventTtl,
        isAllday,
        startTime: isAllday ? null : startTime, // 終日設定の場合nullにする
        endTime: isAllday ? null : endTime,
        startDate: isAllday ? null : startDate,
        endDate: isAllday ? null : endDate,
        memo,
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
      y: -650,
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
                value={eventTtl}
                onChange={(e) => setEventTtl(e.target.value)}
                required
              />
              <button className={styles.ttlDeleteBtn}>
                {" "}
                <FontAwesomeIcon icon={faX} />
              </button>
              <button className={styles.regularBtn}>定型</button>
            </section>

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
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                ～
                <input
                  className={styles.endDateWrap}
                  type="datetime-local"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            )}

            {/* 履歴 */}
            <input
              type="text"
              value={history}
              onChange={(e) => setHistory(e.target.value)}
            />

            {/* 予定のカラー */}
            <select
              value={eventColor}
              onChange={(e) => setEventColor(e.target.value)}
            >
              <option value="red">赤</option>
              <option value="blue">青</option>
              <option value="green">緑</option>
              <option value="yellow">黄</option>
              <option value="purple">紫</option>
              <option value="orange">オレンジ</option>
              required
            </select>

            {/* メモ */}
            <textarea
              placeholder="メモ"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </main>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEventModal;
