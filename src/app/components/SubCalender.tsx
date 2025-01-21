"use client";

import React, { useState, useEffect } from "react";
import styles from "./SubCalender.module.scss";

//db
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

//components
import AddEventButton from "../components/AddEventButton";
import SelectedDateModal from "../components/SelectedDateModal";
// import GetFreeTime from "../components/freeTime";
import Header from "../components/header";
import Futter from "../components/Futter";

const SubCalender: React.FC = () => {
  //timezoneを日本に設定し今日の日付を取得する関数
  const getToday = () => {
    const formatter = new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const parts = formatter.formatToParts(new Date());
    const today = {
      //全部Number型でとってきてる
      year: Number(parts.find((part) => part.type === "year")?.value),
      month: Number(parts.find((part) => part.type === "month")?.value),
      date: Number(parts.find((part) => part.type === "day")?.value),
    };
    // console.log("今日の日付は", today);

    return today;
  };
  //日本の今日
  const today = getToday();
  // const [currentYear, setCurrentYear] = useState(today.year);
  const [currentYear] = useState(today.year);
  const [currentMonth] = useState(today.month);
  const [dates, setDates] = useState<Array<number | null>>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [events, setEvents] = useState<Array<any>>([]); // Firestoreのイベントデータを格納

  //月毎に何日あるのか取得
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  //今月の日付を作成
  const generateDates = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month - 1);
    //月の初日が何曜日か
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    // console.log("今月は", firstDayOfMonth, "から始まる");

    //今日の日にち（dateのみ）取得
    const todayDate = today.date;
    // console.log("今日は", todayDate, "日です");
    //今日の年（yearのみ）取得
    // const todayYear = today.year;
    // console.log("今日は", todayYear, "年です");
    //今日の月（monthのみ）取得
    // const todayMonth = today.month;
    // console.log("今日は", todayMonth, "月です");
    //yearの値が一致し、かつmonthも一致する
    const isThisMonth = year === today.year && month === today.month;
    // console.log(isThisMonth);

    const dates: Array<{
      date: number | null;
      weekEnd: boolean;
      isSaturday: boolean;
      isSunday: boolean;
      isToday: boolean;
    }> = [];

    //前月へ
    // const handlePrevMonth = () => {
    //   if (currentMonth === 1) {
    //     setCurrentYear(currentYear - 1);
    //     setCurrentMonth(12);
    //   } else {
    //     setCurrentMonth(currentMonth - 1);
    //   }
    // };

    // const handleNextMonth = () => {
    //   if (currentMonth === 12) {
    //     setCurrentYear(currentYear + 1);
    //     setCurrentMonth(1);
    //   } else {
    //     setCurrentMonth(currentMonth + 1);
    //   }
    // };

    //firstDayOfMonthで取得した、月の初日の曜日より前の部分を空白にする
    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push({
        date: null,
        weekEnd: false,
        isSaturday: false,
        isSunday: false,
        isToday: false,
      });
    }

    //実際の日付を挿入すると同時に、土日の取得と土曜日曜それぞれの取得
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(year, month - 1, i).getDay();
      // console.log(dayOfWeek);

      const weekEnd = dayOfWeek === 0 || dayOfWeek === 6;
      const isSaturday = dayOfWeek === 6;

      const isSunday = dayOfWeek === 0;
      //今日の日(todayDate)とisThisMonthがtrue
      const isToday = isThisMonth && i === todayDate;
      dates.push({ date: i, weekEnd, isSaturday, isSunday, isToday });

      // console.log(
      //   `日付: ${i}, 曜日: ${dayOfWeek}, 土曜: ${isSaturday}, 日曜: ${isSunday}, 週末: ${weekEnd}`
      // );
      // console.log(`Year: ${year}, Month: ${month}, Day: ${i}`);
    }

    return dates;
  };

  //fireStoreから予定データ取得する関数
  const fetchEvents = async () => {
    // //開始日と終了日
    // const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(
    //   year,
    //   month,
    //   0
    // ).getDate()}`;

    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const fetchEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log("取得した予定データ", fetchEvents);

      setEvents(fetchEvents);
    } catch (error) {
      console.error("予定データ取得失敗", error);
    }
  };

  //空き時間を取得する関数
  const GetFreeTime = (
    events: Array<{ startTime: string; endTime: string }>
  ) => {
    //全時間を分単位で計算
    const timeMinutes = (time: string) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    //時刻形式の文字列（HH:mm）に変換
    const timeData = (minutes: number) => {
      //minutesの合計を60でわり何時間か取得→例：75/60=1.25
      //math.floorで小数点以下を切り捨て
      const hours = Math.floor(minutes / 60);
      //60で割ったあまりを分に変更→例：75分→75%60=15分
      const mins = minutes % 60;
      //hoursを文字列に変換→二桁未満の場合0を追加
      //minsも同じく
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
    };

    //1日の終わりと始まり
    const dayStart = 0; //00:00
    const dayEnd = 1440; //24:00→1440分てことね

    //eventをstartTime順でソート
    const eventsSort = events
      .map((event) => ({
        start: timeMinutes(event.startTime),
        end: timeMinutes(event.endTime),
      }))
      .sort((a, b) => a.start - b.end);

    const freeTime = [];
    //現在までに処理したイベントの終了時刻を追跡→初期値は00:00
    let lastEnd = dayStart;

    for (const event of eventsSort) {
      if (lastEnd < event.start) {
        //空き時間が何時間あるか
        const freeDuration = event.start - lastEnd;

        //freeDurationに合わせてクラス付与
        let durationClass = "";

        //30分以上２時間未満
        if (freeDuration >= 30 && freeDuration <= 119) {
          durationClass = "block_one";
        }
        //２時間以上３時間未満
        else if (freeDuration >= 120 && freeDuration <= 179) {
          durationClass = "block_two";
        }
        //３時間以上４時間未満
        else if (freeDuration >= 180 && freeDuration <= 239) {
          durationClass = "block_three";
        }
        //４時間以上
        else if (freeDuration >= 240) {
          durationClass = "block_stick";
        }

        //前のイベントが終わってから（ない場合は1日の始まり）次のイベントが始まるまでの時間があればその時間をfreeTimeに追加
        freeTime.push({
          start: timeData(lastEnd),
          end: timeData(event.start),
          className: durationClass,
        });
      }
      //引数に含まれた数値のうち最大のものを取得しlastEndに入れてる
      //イベントの終了時刻をlastEndに上書き
      //イベント重複していても一番終わるのが遅いイベントの時間を考慮する！
      lastEnd = Math.max(lastEnd, event.end);
    }

    //dayEnd(24:00)までの空き時間を取得しfreeTimeに追加
    if (lastEnd < dayEnd) {
      //空き時間が何時間あるか
      const freeDuration = dayEnd - lastEnd;

      //freeDurationに合わせてクラス付与
      let durationClass = "";

      //30分以上２時間未満
      if (freeDuration >= 30 && freeDuration <= 119) {
        durationClass = "block_one";
      }
      //２時間以上３時間未満
      else if (freeDuration >= 120 && freeDuration <= 179) {
        durationClass = "block_two";
      }
      //３時間以上４時間未満
      else if (freeDuration >= 180 && freeDuration <= 239) {
        durationClass = "block_three";
      }
      //４時間以上
      else if (freeDuration >= 240) {
        durationClass = "block_stick";
      }

      freeTime.push({
        start: timeData(lastEnd),
        end: timeData(dayEnd),
        className: durationClass,
      });
    }

    return freeTime;

    // return <div></div>;
  };

  //useEffect ----------------------------------------------
  // useEffectで管理
  useEffect(() => {
    setDates(generateDates(currentYear, currentMonth));
  }, [currentYear, currentMonth]); // currentYear や currentMonth が変更されたときに再実行

  //予定データ取得
  useEffect(() => {
    fetchEvents();
  }, []);

  //クリックした日付取得の関数
  const handleDateClick = (date: number) => {
    // selectedDateを"YYYY-MM-DD"の形式に変更
    const formattedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${String(date).padStart(2, "0")}`;
    setSelectedDate(formattedDate);
    //クリックした日
    console.log("クリックした日", formattedDate);

    const [selectedYear, selectedMonth, selectedDay] = formattedDate
      .split("-")
      .map(Number);
    console.log("selectedYear:", selectedYear);
    console.log("selectedMonth:", selectedMonth);
    console.log("selectedDay:", selectedDay);

    setShowModal(true); // モーダルを表示
  };

  // const dates = generateDates(currentYear, currentMonth);

  // 月名リスト
  // const monthNames = [
  //   "1月",
  //   "2月",
  //   "3月",
  //   "4月",
  //   "5月",
  //   "6月",
  //   "7月",
  //   "8月",
  //   "9月",
  //   "10月",
  //   "11月",
  //   "12月",
  // ];
  return (
    <>
      <Header></Header>
      <div className={styles.calenderContainer}>
        <div className={styles.weekdays}>
          {["日", "月", "火", "水", "木", "金", "土"].map((day) => {
            //日曜と土曜でクラス付与
            const dayClass =
              day === "日"
                ? styles.sunday
                : day === "土"
                ? styles.saturday
                : "";
            return (
              <div key={day} className={`${styles.weekday} ${dayClass}`}>
                {day}
              </div>
            );
          })}
        </div>

        <div className={styles.dates}>
          {dates.map((dateInfo, index) => {
            //dateInfoを分割して代入してる
            const { date, isSaturday, isSunday, isToday } = dateInfo;
            //空白を定数に定義
            // const displayDate = date || "";
            //日付がある場合とない場合でクラス名をそれぞれ付与
            //dateが空→dateOut
            //dateInの場合→weekEndがtrueならクラス付与
            const dateClass = date
              ? `${styles.dateIn} ${isSaturday ? styles.saturday : ""} ${
                  isSunday ? styles.sunday : ""
                } `
              : styles.dateOut;
            return (
              <div
                key={index}
                className={`${styles.date} ${
                  selectedDate ===
                  `${currentYear}-${String(currentMonth).padStart(
                    2,
                    "0"
                  )}-${String(date).padStart(2, "0")}`
                    ? styles.selected
                    : ""
                } ${dateClass}`}
                onClick={() => date && handleDateClick(date)}
              >
                <div className={styles.dateTopContainer}>
                  <div
                    className={`${styles.dateNum} ${
                      isToday ? styles.isToday : ""
                    }`}
                  >
                    {date}
                  </div>
                  <div className={styles.midnightMark}></div>
                </div>
                {date && (
                  <section className={styles.dateMainContainer}>
                    {(() => {
                      // フォーマットされた日付
                      const formattedDate = `${currentYear}-${String(
                        currentMonth
                      ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

                      // 指定された日付の予定データをフィルタリング
                      const filteredEvents = events
                        .filter((event) => event.date === formattedDate)
                        .map((event) => ({
                          type: "event",
                          start: event.startTime,
                          end: event.endTime,
                          title: event.title,
                          id: event.id,
                          color: event.color,
                        }));

                      // 空き時間データを取得
                      const freeTimeSlots = GetFreeTime(
                        filteredEvents.map((e) => ({
                          startTime: e.start,
                          endTime: e.end,
                        }))
                      )
                        .filter(
                          //朝の時間の条件フィルタリング
                          (slot) =>
                            !(slot.start === "00:00" && slot.end === "09:00")
                        )
                        .map((slot, index) => ({
                          type: "free",
                          start: slot.start,
                          end: slot.end,
                          className: slot.className,
                          id: `free-${index}`, // ユニークなIDを生成
                          color: slot.color,
                        }));

                      // 予定と空き時間を統合してソート
                      const allSlots = [
                        ...filteredEvents,
                        ...freeTimeSlots,
                      ].sort((a, b) => a.start.localeCompare(b.start));

                      // 統合データを表示
                      return allSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={
                            slot.type === "event"
                              ? styles.eventContainer
                              : styles[slot.className]
                          }
                          style={
                            slot.type === "event"
                              ? { backgroundColor: slot.color }
                              : {}
                          }
                        >
                          {slot.type === "event" ? (
                            <p>{slot.title}</p>
                          ) : (
                            <p className={styles.freeSlotTxt}>
                              {slot.start.split(":")[0]}
                            </p>
                          )}
                        </div>
                      ));
                    })()}
                  </section>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showModal && selectedDate && (
        <SelectedDateModal
          setShowModal={setShowModal}
          selectedDate={selectedDate}
          slots={(() => {
            const formattedDate = selectedDate;
            const filteredEvents = events
              .filter((event) => event.date === formattedDate)
              .map((event) => ({
                type: "event",
                start: event.startTime,
                end: event.endTime,
                title: event.title,
                id: event.id,
              }));
            const freeTimeSlots = GetFreeTime(
              filteredEvents.map((e) => ({
                startTime: e.start,
                endTime: e.end,
              }))
            )
              .filter(
                (slot) => !(slot.start === "00:00" && slot.end === "09:00")
              )
              .map((slot, index) => ({
                type: "free",
                start: slot.start,
                end: slot.end,
                className: slot.className,
                id: `free-${index}`,
              }));
            return [...filteredEvents, ...freeTimeSlots].sort((a, b) =>
              a.start.localeCompare(b.start)
            );
          })()}
          // events={events.filter((event) => event.date === selectedDate)}
        />
      )}
      <div className={styles.footerTopWrap}></div>
      <Futter></Futter>
      <AddEventButton />
    </>
  );
};

export default SubCalender;
