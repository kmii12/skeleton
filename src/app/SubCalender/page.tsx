"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faCalendar,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar as faRegCalendar } from "@fortawesome/free-regular-svg-icons";
import { useState, useEffect } from "react";
// import styles from "./SubCalender.module.scss"; // 修正したSCSSファイルをインポート

import SubCalender from "../components/SubCalender";
const SubCalenderPage = () => {
  return (
    <>
      <SubCalender />
    </>
  );
};

export default SubCalenderPage;
