type AppStatus = {
  totalUsers: number;
  activeUsers: number;
  isMatching: number;
  inactiveUsers: number;
  genderDistribution: { woman: number; man: number; others: number };
};

type AppStatusResponse = {
  success?: boolean;
  data?: AppStatus;
};

export async function fetchAppStatusPublic(): Promise<AppStatus | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return null;
  }

  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  try {
    const response = await fetch(`${normalizedBaseUrl}/status/app-status`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AppStatusResponse;
    if (!payload?.success || !payload.data) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}
