import { useEffect, useState } from "react";
import "./App.css";

const tasks = [
  { taskName: "Palcare", start: "08:00", end: "10:00" },
  { taskName: "GasBuddy", start: "11:00", end: "13:00" },
  { taskName: "GasBuddy", start: "14:00", end: "17:00" },
  { taskName: "GasBuddy", start: "18:00", end: "20:00" },
];

const getCurrentTask = (time: Date) => {
  const taskFinded = tasks.find((task) => {
    const [startHours, startMinutes] = task.start
      .split(":")
      .map((str) => Number(str));
    const [endHours, endMinutes] = task.end
      .split(":")
      .map((str) => Number(str));
    console.log(startHours, startMinutes, endHours, endMinutes, time);
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
  return `${minutes}:${secondsLeft.toFixed(0)}`;
};

function App() {
  const [currentTask, setCurrentTask] = useState(getCurrentTask(new Date()));
  const [secondsLeftForTask, setSecondsLeftForTask] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentTask = getCurrentTask(currentTime);
      setCurrentTask(currentTask);
      if (currentTask) {
        const [endHours, endMinutes] = currentTask.end
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
        </>
      ) : (
        <p className="timer">FREE TIME</p>
      )}
    </div>
  );
}

export default App;
