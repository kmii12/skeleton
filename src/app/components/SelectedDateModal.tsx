"use client";

import styles from "./SelectedDateModal.module.scss";
//db
// import { db } from "../../firebase";
// import { collection, addDoc } from "firebase/firestore";

//icon
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//framer motion
import { AnimatePresence, easeInOut, motion } from "framer-motion";

interface Slot {
  type: "event" | "free";
  start: string;
  end: string;
  title?: string; // typeが"event"の場合のみ
  className?: string; // typeが"free"の場合のみ
  id: string;
}

// interface Props {
//   setShowModal: (show: boolean) => void;
//   selectedDate: string;
//   slots: Slot[];
// }

interface SelectedDateModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: string;
  // events: Array<any>;
  slots: Slot[];
}

const SelectedDateModal: React.FC<SelectedDateModalProps> = ({
  setShowModal,
  selectedDate,
  slots,
}) => {
  //selectedDate(2024-11-05)を分割
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split("-");

  //animation設定
  const modalAnimation = {
    hidden: { y: "100%", opacity: 1 },
    visible: {
      y: -250,
      opacity: 1,

      transition: {
        type: "tween",
        stiffness: 100,
        damping: 20,
        ease: easeInOut,
      },
    },
    exit: { y: "100%", opacity: 0, scale: 0.9, transition: { duration: 0.8 } },
  };

  // モーダル外をクリックしたときにモーダルを閉じる処理
  // const handleModalClick = (e: React.MouseEvent) => {
  //   // モーダルのコンテンツ内をクリックした場合は閉じない
  //   if (e.target === e.currentTarget) {
  //     setShowModal(false);
  //   }
  // };
  // モーダルを閉じる処理
  const closeModal = () => {
    setShowModal(false); // モーダルを閉じる
  };

  return (
    <AnimatePresence>
      {typeof setShowModal === "function" && (
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          variants={modalAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          // onAnimationComplete={() => {
          //   // exitアニメーションが完了した後にモーダルを非表示にする
          //   if (!setShowModal) {
          //     setShowModal(false); // モーダルを閉じる
          //   }
          // }}
        >
          <div className={styles.modalContent}>
            <header>
              <h2>
                {selectedYear}年{selectedMonth}月{selectedDay}日
              </h2>
              <button className={styles.closeBtn} onClick={closeModal}>
                閉じる
              </button>
            </header>
            <main>
              {slots.map((slot) =>
                slot.type === "event" ? (
                  <div key={slot.id} className={styles.eventLabel}>
                    <span className={styles.colorLabel}></span>
                    <div className={styles.timeContainer}>
                      <p>{slot.start}</p>
                      <span className={styles.timeBorder}></span>
                      <p>{slot.end}</p>
                    </div>
                    <h3>{slot.title}</h3>
                  </div>
                ) : (
                  <div key={slot.id} className={styles.eventLabel_free}>
                    <span className={styles.colorLabel_free}></span>
                    <div className={styles.timeContainer}>
                      <p>{slot.start}</p>
                      <span className={styles.timeBorder}></span>
                      <p>{slot.end}</p>
                    </div>
                    <h3 className={styles.freeTimeTtl}>空き時間</h3>
                  </div>
                )
              )}
              {/* {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className={styles.eventLabel}>
                    <span className={styles.colorLabel}></span>
                    <div className={styles.timeContainer}>
                      <p>{event.startTime}</p>
                      <span className={styles.timeBorder}></span>
                      <p>{event.endTime}</p>
                    </div>
                    <h3>{event.title}</h3>
                  </div>
                ))
              ) : (
                <p className={styles.notEvent}>予定はありません</p>
              )} */}
            </main>
            <footer></footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectedDateModal;
