if (!self.define) {
  let e,
    n = {};
  const s = (s, i) => (
    (s = new URL(s + ".js", i).href),
    n[s] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = n), document.head.appendChild(e);
        } else (e = s), importScripts(s), n();
      }).then(() => {
        let e = n[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, a) => {
    const c =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[c]) return;
    let t = {};
    const r = (e) => s(e, c),
      d = { module: { uri: c }, exports: t, require: r };
    n[c] = Promise.all(i.map((e) => d[e] || r(e))).then((e) => (a(...e), t));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "b870beefb501f35f9305a179cc141412",
        },
        {
          url: "/_next/static/chunks/173-3961165c4685ef85.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/20-e87cede47e685a5c.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/306-02c633c159e8054b.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/381-3a6705613b788185.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/385cb88d-1c431ad24a4cbcd7.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/42-a97a76afd51d05c8.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/422-2c4e44eb69393cb7.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/440-bb0ce2c909e56468.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/462-e0048c67b898bcfc.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/472-be68284604065cb3.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/4bd1b696-984eb1d58b8f392f.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/517-8407d22aab9adab0.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/529-244c089e4701ce1e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/53c13509-c37a923412cdc62d.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/565-ea04e731fc174305.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/59650de3-1a4dc5d8431cd2c8.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/619edb50-90cd326a110374ff.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/66ec4792-09e5b6368c346586.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/795d4814-cb8ca87fe01258a7.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/870-43cfbffb5db8af52.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/8e1d74a4-e6d4c60bd2b2238d.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/94730671-f41c03d3504bb133.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/984-c912d1954a8378b2.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/9c4e2130-e0d9706d46f98a5e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/(landing)/layout-d297a409027ec3f1.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/(landing)/page-562dc11804baebe3.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-92636d2707e21d9d.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/chat/%5Bid%5D/page-2afa145c389d6db8.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/layout-fff1d7c8badcbc1c.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/login/page-021fb86468031770.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/page-326ab1ca4570109e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/profile/edit/page-56cbb7d4b2ca9221.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/profile/page-8aed1424e6aff1d9.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/set-new-password/page-253713f6d0d04f6e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/signup/page-489542352b9b730e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/app/slots/page-398159035593a5b9.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/auth/callback/page-5cb66a9c03d35634.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/app/layout-07dac39793d20bba.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/f7333993-e8fe72b5abdba634.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/f8025e75-5f58e191db50e108.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/framework-6b27c2b7aa38af2d.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/main-3eb6608a46c4bb0e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/main-app-f5b1c1f9705feb2e.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/pages/_app-d23763e3e6c904ff.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/pages/_error-9b7125ad1a1e68fa.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-87e7e215093dbe63.js",
          revision: "ndr0e5gWQee0vAYn6IHDu",
        },
        {
          url: "/_next/static/css/baef8039cb30d51b.css",
          revision: "baef8039cb30d51b",
        },
        {
          url: "/_next/static/media/0822b6067e7c0dee-s.woff2",
          revision: "e639e31d35a7aa5fb0bc336286469c3c",
        },
        {
          url: "/_next/static/media/56d4c7a1c09c3371-s.woff2",
          revision: "43b1d1276722d640d51608db4600bb69",
        },
        {
          url: "/_next/static/media/67354d9f27664b22-s.woff2",
          revision: "828d8b6c05d4a29e33d11e60773f0f74",
        },
        {
          url: "/_next/static/media/6905431624c34d00-s.p.woff2",
          revision: "5b3db6889bd28d3ebeef0fe9ae345c4e",
        },
        {
          url: "/_next/static/media/7e6a2e30184bb114-s.p.woff2",
          revision: "bca21fe1983e7d9137ef6e68e05f3aee",
        },
        {
          url: "/_next/static/ndr0e5gWQee0vAYn6IHDu/_buildManifest.js",
          revision: "c2dbad04652482803242080b003e15ee",
        },
        {
          url: "/_next/static/ndr0e5gWQee0vAYn6IHDu/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/android-chrome-192x192.png",
          revision: "b9cf56de170440b681ae2c9afdeb0074",
        },
        {
          url: "/android-chrome-512x512.png",
          revision: "ca03da34c09ea18f9c4b546e1e3dba28",
        },
        {
          url: "/apple-touch-icon.png",
          revision: "675af97590713d103083f05ed00c7be8",
        },
        {
          url: "/assets/date.svg",
          revision: "77cfa4dd6f8ebdcfd6e8cf44a2cb3997",
        },
        {
          url: "/favicon-16x16.png",
          revision: "70b02153532d962f85c39adba0cd59f2",
        },
        {
          url: "/favicon-32x32.png",
          revision: "46055bac66013d243f834ec97ed42967",
        },
        { url: "/favicon.ico", revision: "7c9c641c0ea4fdfd6401dd658a09bfc4" },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icon-source.png",
          revision: "a0f5ad8dd0329dea05dfabd53d9c36d5",
        },
        {
          url: "/icons/icon-128x128.png",
          revision: "4e98182d1ab151e7fdd65849a58019ea",
        },
        {
          url: "/icons/icon-144x144.png",
          revision: "293468c9bbcadca590c0973ce49ea2be",
        },
        {
          url: "/icons/icon-152x152.png",
          revision: "9bef662e16fbabcd739a380a80db4b57",
        },
        {
          url: "/icons/icon-192x192.png",
          revision: "0a0eaa32730f9c6b28840c09165b7f23",
        },
        {
          url: "/icons/icon-384x384.png",
          revision: "50e4475d44c3b264f25ded84ebe0b7bb",
        },
        {
          url: "/icons/icon-512x512.png",
          revision: "8999f0a934c0672a3d30ea5292e4edfa",
        },
        {
          url: "/icons/icon-72x72.png",
          revision: "e1107ee23f5b29fb32f3b1121d1bf6d0",
        },
        {
          url: "/icons/icon-96x96.png",
          revision: "4f26e7266b53f096be51dabe54b6169a",
        },
        { url: "/manifest.json", revision: "01f9b47524efa630091725f4dd591177" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/splash.html", revision: "ffd1ccd44d59bc140f0b6acfe5de3094" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: n,
              event: s,
              state: i,
            }) =>
              n && "opaqueredirect" === n.type
                ? new Response(n.body, {
                    status: 200,
                    statusText: "OK",
                    headers: n.headers,
                  })
                : n,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const n = e.pathname;
        return !n.startsWith("/api/auth/") && !!n.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
