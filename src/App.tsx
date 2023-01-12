import { useCallback, useEffect, useState } from "react";
import "./App.css";
import pauseIMG from "./assets/pause.png";
import playIMG from "./assets/play.png";
import _ from "lodash";

const tasks = [
  { taskName: "Gym", start: "10:00", end: "13:00" },
  { taskName: "GasBuddy", start: "14:00", end: "17:00" },
  { taskName: "GasBuddy", start: "18:00", end: "24:00" },
];

const getCurrentTask = (time: Date) => {
  const taskFinded = tasks.find((task) => {
    const [startHours, startMinutes] = task.start
      .split(":")
      .map((str) => Number(str));
    const [endHours, endMinutes] = task.end
      .split(":")
      .map((str) => Number(str));
    const startTime = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      startHours,
      startMinutes
    );
    const endTime = new Date(
      time.getFullYear(),
      time.getMonth(),
      time.getDate(),
      endHours,
      endMinutes
    );

    return (
      time.getTime() >= startTime.getTime() &&
      time.getTime() <= endTime.getTime()
    );
  });

  return taskFinded;
};

const secondsToMinutesAndSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  return `${minutes.toFixed(0).toString().padStart(2, "0")}:${secondsLeft
    .toFixed(0)
    .toString()
    .padStart(2, "0")}`;
};

function App() {
  const [currentTask, setCurrentTask] = useState(getCurrentTask(new Date()));
  const [secondsLeftForTask, setSecondsLeftForTask] = useState(0);
  const [currentTaskTotalSecondsWorked, setCurrentTaskTotalSecondsWorked] =
    useState(0);
  const [currentTaskTotalTimerOn, setCurrentTaskTotalTimerOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      let previousTask = { ...currentTask };
      const newCurrent = getCurrentTask(currentTime);
      setCurrentTask(newCurrent);
      if (newCurrent) {
        const [endHours, endMinutes] = newCurrent.end
          .split(":")
          .map((str) => Number(str));
        const endTime = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          endHours,
          endMinutes
        );
        setSecondsLeftForTask(
          (endTime.getTime() - currentTime.getTime()) / 1000
        );
        if (_.isEqual(previousTask, newCurrent) && currentTaskTotalTimerOn) {
          setCurrentTaskTotalSecondsWorked((prev) => prev + 1);
        }
        if (!_.isEqual(previousTask, newCurrent)) {
          setCurrentTaskTotalSecondsWorked(0);
          setCurrentTaskTotalTimerOn(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        style={{ position: "absolute", top: 10, right: 10 }}
        onClick={() =>
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.getElementsByTagName("body")[0].requestFullscreen()
        }
      >
        {`</>`}
      </button>
      {currentTask ? (
        <>
          <h1>{currentTask?.taskName}</h1>
          <p className="timer">
            {secondsToMinutesAndSeconds(secondsLeftForTask)}
          </p>
          <div className="current-task-timer">
            <img
              className="play-pause"
              onClick={() => setCurrentTaskTotalTimerOn((prev) => !prev)}
              src={currentTaskTotalTimerOn ? pauseIMG : playIMG}
            />
            <p>{secondsToMinutesAndSeconds(currentTaskTotalSecondsWorked)}</p>
          </div>
        </>
      ) : (
        <p className="timer">FREE TIME</p>
      )}
    </div>
  );
}

export default App;
