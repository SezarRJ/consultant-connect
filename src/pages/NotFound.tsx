import { Link } from "react-router-dom";
import { Globe2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(var(--background))" }}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Globe2 className="h-12 w-12" style={{ color: "hsl(38 95% 52%)" }} />
        </div>
        <h1 className="text-4xl font-bold font-display mb-2" style={{ color: "hsl(210 40% 92%)" }}>404</h1>
        <p className="text-sm mb-6" style={{ color: "hsl(215 25% 55%)" }}>Page not found</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
