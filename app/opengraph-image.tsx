import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function SproutMark({ size: markSize, color }: { size: number; color: string }) {
  return (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z" />
      <path d="M12 12c0-3.9 3.1-7 7-7 0 3.9-3.1 7-7 7Z" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#faf7f2",
          backgroundImage:
            "radial-gradient(circle at 15% -10%, rgba(193,127,58,0.12), transparent 40%), radial-gradient(circle at 100% 120%, rgba(61,90,69,0.16), transparent 45%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 24,
              backgroundColor: "#3d5a45",
            }}
          >
            <SproutMark size={48} color="#faf7f2" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                margin: 0,
                fontSize: 22,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#c17f3a",
              }}
            >
              {siteConfig.tagline}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1,
                color: "#2c2416",
              }}
            >
              Vida<span style={{ color: "#c17f3a" }}>sana</span>
            </p>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: 900,
            fontSize: 34,
            lineHeight: 1.35,
            color: "rgba(44, 36, 22, 0.78)",
          }}
        >
          {siteConfig.description}
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          {["Frutos secos", "Semillas", "Granolas"].map((item) => (
            <div
              key={item}
              style={{
                padding: "12px 24px",
                borderRadius: 999,
                border: "2px solid rgba(61, 90, 69, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                color: "#3d5a45",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
