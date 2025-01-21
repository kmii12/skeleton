"use client";

import React, { useState } from "react";
import styles from "./AddEventButton.module.scss";

//components
import AddEventModal from "./AddEventModal";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

//animation
import { AnimatePresence } from "framer-motion";

const AddEventButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [isDisplayModal, setIsDisplayModal] = useState<boolean>(false);

  return (
    // <div className={styles.addBtnContainer}>
    //   {/* showModalがfalseのときのみボタンを表示 */}

    // </div>
    <AnimatePresence>
      {!showModal && (
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <FontAwesomeIcon className={styles.plus} icon={faPlus} />
        </button>
      )}

      {/* showModalがtrueの場合、モーダルを表示 */}
      {showModal && (
        <AddEventModal setShowModal={setShowModal} key="add-event-modal" />
      )}
    </AnimatePresence>
  );
};
export default AddEventButton;
