import { useState } from "react";

const FALLBACK = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80";

export default function SafeImg({ src, alt = "", className = "", fallback = FALLBACK, ...rest }) {
  const [s, setS] = useState(src);
  return <img src={s} alt={alt} className={className} loading="lazy"
              onError={() => { if (s !== fallback) setS(fallback); }} {...rest} />;
}
