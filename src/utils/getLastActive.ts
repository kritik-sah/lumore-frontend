export default function getLastActive(timestamp: string) {
  const now: Date = new Date();
  const past: Date = new Date(timestamp);
  //@ts-ignore
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
