"use client";
// import React from "react";

// type Event = {
//   startTime: string;
//   endTime: string;
// };

// type FreeTimeProps = {
//   events: Array<Event>; // イベントリスト
//   startTime?: string; // 営業開始時間 (デフォルト: 09:00)
//   endTime?: string; // 営業終了時間 (デフォルト: 18:00)
// };

const GetFreeTime = (events: Array<{ startTime: string; endTime: string }>) => {
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
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
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
      //前のイベントが終わってから（ない場合は1日の始まり）次のイベントが始まるまでの時間があればその時間をfreeTimeに追加
      freeTime.push({ start: timeData(lastEnd), end: timeData(event.start) });
    }
    //引数に含まれた数値のうち最大のものを取得しlastEndに入れてる
    //イベントの終了時刻をlastEndに上書き
    //イベント重複していても一番終わるのが遅いイベントの時間を考慮する！
    lastEnd = Math.max(lastEnd, event.end);
  }

  //dayEnd(24:00)までの空き時間を取得しfreeTimeに追加
  if (lastEnd > dayEnd) {
    freeTime.push({ start: timeData(lastEnd), end: timeData(dayEnd) });
  }

  return freeTime;

  // return <div></div>;
};

export default GetFreeTime;
