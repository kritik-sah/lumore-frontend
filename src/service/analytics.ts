interface TrackAnalyticProps {
  activity: string;
  label: string;
  category?: string;
  value?: any;
}

const ensureGtag = () => {
  if (typeof window === "undefined") return null;

  (window as any).dataLayer = (window as any).dataLayer || [];
  if (typeof (window as any).gtag !== "function") {
    (window as any).gtag = (...args: unknown[]) => {
      (window as any).dataLayer.push(args);
    };
  }

  return (window as any).gtag as (...args: unknown[]) => void;
};

export const trackAnalytic = ({
  activity,
  category = "engagement",
  label,
  value = 1,
}: TrackAnalyticProps) => {
  const gtag = ensureGtag();
  if (!gtag) return;

  gtag("event", activity, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackAnalyticOnce = (
  key: string,
  payload: TrackAnalyticProps,
) => {
  if (typeof window === "undefined") return;
  const storageKey = `analytic-once:${key}`;
  if (window.localStorage.getItem(storageKey)) return;
  trackAnalytic(payload);
  window.localStorage.setItem(storageKey, "1");
};

