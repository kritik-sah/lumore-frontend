interface TrackAnalyticProps {
  activity: string;
  label: string;
  category?: string;
  value?: any;
}
const trackAnalytic = ({
  activity,
  category = "engagement",
  label,
  value = 1,
}: TrackAnalyticProps) => {
  // Track activity in Google Analytics
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", activity, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
