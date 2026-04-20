import axios from "axios";

const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export async function exportImageFromSvg({ svg, format = "png", quality = 95 }) {
  const { data } = await axios.post(`${baseUrl}/export/image`, {
    svg,
    format,
    quality,
  });

  if (!data?.dataUrl) {
    throw new Error("Invalid image export response");
  }

  return data.dataUrl;
}
