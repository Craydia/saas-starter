import { useEffect, useState } from 'react';

// Define a type for the return value of `getReturnValues`
type Countdown = {days: number, hours: number, minutes: number, seconds: number};

const parseDuration = (duration: string, bonusMinuts: number = 0): number => {
  const [hours, minutes] = duration.split(':').map(Number);
  // Convert hours and minutes to milliseconds and return total duration
  return hours * 60 * 60 * 1000 + (minutes + bonusMinuts) * 60 * 1000;
};

// Optionally, define the type for the targetDate parameter if you want to restrict it to a specific type, such as string or number
// For broader compatibility, it's defined as string | number here
export const useCountdown = (startDate?: string, duration?: string): Countdown => {
  const startTime = new Date(startDate ?? '').getTime();
  const durationMs = parseDuration(duration ?? '00:00');
  const countDownDate = startTime + durationMs;

  const [countDown, setCountDown] = useState<number>(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  if(!startDate || !duration) return {days: 0, hours: 0, minutes: 0, seconds: 0};

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number): Countdown => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  if(days + hours + minutes + seconds <= 0) return {days: 0, hours: 0, minutes: 0, seconds: 0};
  return {days, hours, minutes, seconds};
};
