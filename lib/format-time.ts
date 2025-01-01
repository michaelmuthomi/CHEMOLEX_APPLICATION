export const formatTime = (dateString: any) => {
  const date = new Date(dateString);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always have two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${ampm}`;
};
