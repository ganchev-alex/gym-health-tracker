export const getWeekNumber = function (date: Date) {
  date = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);

  return weekNumber;
};

export const formatDate = (date: Date) => {
  return `${padZero(date.getDate())}.${padZero(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;
};

export const padZero = (number: number) => {
  return number < 10 ? "0" + number : number;
};

export const getStartOfWeek = (date: Date) => {
  const dayOfWeek = date.getDay();
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const getEndOfWeek = (date: Date) => {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return endOfWeek;
};

export const formatMonth = (date: Date) => {
  return `${getMonthName(date.getMonth())} ${date.getFullYear()}`;
};

export const getMonthName = (monthIndex: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthIndex];
};
