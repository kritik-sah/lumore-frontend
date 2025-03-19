import { Suspense } from "react";
import AuthCallback from "./AuthCallback";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthCallback />
    </Suspense>
  );
}
