import { intervalToDuration } from "date-fns";
import { useState, useEffect } from "react";

export const CountDown = () => {
  const [countDown, setCountDown] = useState(
    intervalToDuration({
      start: new Date(),
      end: new Date("12/25/2022"),
    })
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(
        intervalToDuration({
          start: new Date(),
          end: new Date("12/25/2022"),
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div className="my-2 flex justify-center space-x-1">
      {countDown.months !== undefined && (
        <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
          <p className="text-2xl font-bold">
            {countDown.months.toString().length === 1
              ? countDown.months.toString().padStart(2, "0")
              : countDown.months}
          </p>
          <p className="text-sm font-light">Months</p>
        </div>
      )}
      {countDown.days !== undefined && (
        <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
          <p className="text-2xl font-bold">
            {countDown.days.toString().length === 1
              ? countDown.days.toString().padStart(2, "0")
              : countDown.days}
          </p>
          <p className="text-sm font-light">Days</p>
        </div>
      )}
      {countDown.minutes !== undefined && (
        <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
          <p className="text-2xl font-bold">
            {countDown.minutes.toString().length < 2
              ? countDown.minutes.toString().padStart(2, "0")
              : countDown.minutes}
          </p>
          <p className="text-sm font-light">Minutes</p>
        </div>
      )}
      {countDown.seconds !== undefined && (
        <div className="flex flex-col items-center rounded-md bg-white p-3 text-red-500">
          <p className="text-2xl font-bold">
            {countDown.seconds.toString().length < 2
              ? countDown.seconds.toString().padStart(2, "0")
              : countDown.seconds}
          </p>
          <p className="text-sm font-light">Seconds</p>
        </div>
      )}
    </div>
  );
};
