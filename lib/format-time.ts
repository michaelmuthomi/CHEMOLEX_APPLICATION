export const formatTime = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);

  // Format options for East African Time (UTC+3)
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Nairobi",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};
