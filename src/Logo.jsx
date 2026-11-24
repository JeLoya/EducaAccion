import { useState } from "react";

/* Logo de EducaAcción: usa /public/logo.png. Si no encuentra la imagen, muestra la «E» como respaldo. */
export default function Logo({ size = 34 }) {
  const [falla, setFalla] = useState(false);
  if (falla) {
    return (
      <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: size, height: size, flex: "none",
        border: "2px solid #16224a", borderRadius: 8, background: "#ffd84d", color: "#16224a", fontWeight: 800 }}>E</span>
    );
  }
  return (
    <img src="/logo.png" alt="" width={size} height={size} onError={() => setFalla(true)}
      style={{ display: "block", flex: "none", width: size, height: size, objectFit: "contain" }} />
  );
}
