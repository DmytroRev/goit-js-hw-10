import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
let countdownInterval;


flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    validateSelectedDate();
  }
});


startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;
  startTimer();
});


function startTimer() {
  startButton.disabled = true;
  datetimePicker.disabled = true;

  countdownInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - new Date();
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay(0, 0, 0, 0);
      return;
    }
    const time = convertMs(timeRemaining);
    updateTimerDisplay(time.days, time.hours, time.minutes, time.seconds);
  }, 1000);
}


function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
}
console.log(convertMs(2000));
console.log(convertMs(140000)); 
console.log(convertMs(24140000)); 


function validateSelectedDate() {
  if (!userSelectedDate) return;
  const currentDate = new Date();
    if (userSelectedDate <= currentDate) {
      iziToast.show({
    message: 'Please choose a date in the future'
});
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
  }
}