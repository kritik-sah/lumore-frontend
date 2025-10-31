import Script from "next/script";

export default function Newsletter() {
  return (
    <>
      <Script async src="https://subscribe-forms.beehiiv.com/embed.js" />

      <iframe
        src="https://subscribe-forms.beehiiv.com/7ddb850c-5670-41db-8f13-d486304b39a9"
        data-test-id="beehiiv-embed"
        style={{
          width: "100%",
          height: "376px",
          border: "0",
          backgroundColor: "transparent",
        }}
      />
    </>
  );
}
