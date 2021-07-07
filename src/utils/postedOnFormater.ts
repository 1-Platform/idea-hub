/**
 * This function is used to convert the postedOn prop to formated string as shown in return
 * Reference: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript
 * @returns {String} : 2 days ago, 2 months ago, 5 years ago
 */
export const postedOnFormater = (postedOn: string): string => {
  const present = new Date().getTime(); //Gets the number of milliseconds
  const inputDate = new Date(postedOn).getTime();
  const daysDiff = (present - inputDate) / (1000 * 3600 * 24);
  if (daysDiff < 30) {
    const day = Math.round(daysDiff);
    return `${day} ${day > 1 ? 'days' : 'day'} ago`;
  } else if (daysDiff < 365) {
    const month = Math.round(daysDiff / 30);
    return `${month} ${month > 1 ? 'months' : 'month'} ago`;
  } else {
    const year = Math.round(daysDiff / 365);
    return `${year} ${year > 1 ? 'years' : 'year'} ago`;
  }
};
