import { readFileSync } from "node:fs";
import { join } from "node:path";

const loginIllustrationSvg = readFileSync(join(process.cwd(), "public/img/login.svg"), "utf8");

export default function LoginHeroIllustration() {
  return (
    <div
      aria-hidden
      className="relative z-1 w-full max-w-xl [&>svg]:h-auto [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: loginIllustrationSvg }}
    />
  );
}
