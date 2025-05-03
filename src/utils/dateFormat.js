export default function formatDate(dateString) {
  const date = new Date(dateString);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Return in dd-mm-yyyy format
  return `${day}-${month}-${year}`;
}

export const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

export const formatUTCDate = (dateString) => {
  const date = new Date(dateString);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = date.getUTCFullYear();
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");
  //const ss = String(date.getUTCSeconds()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

export function getEventStatus(startUTC, endUTC) {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  const now = new Date(Date.now() + istOffset);
  const startTime = new Date(new Date(startUTC).getTime());
  const endTime = new Date(new Date(endUTC).getTime());

  const formatDiff = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""}`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return `a few seconds`;
  };

  if (now < startTime) {
    const timeLeft = formatDiff(startTime - now);
    return `Will start in ${timeLeft}`;
  } else if (now >= startTime && now <= endTime) {
    const timeSinceStart = formatDiff(now - startTime);
    return `Ongoing, started ${timeSinceStart} ago`;
  } else {
    const timeSinceEnd = formatDiff(now - endTime);
    return `Ended ${timeSinceEnd} ago`;
  }
}
