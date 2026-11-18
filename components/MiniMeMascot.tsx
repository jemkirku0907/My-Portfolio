import type { CSSProperties } from "react";

/**
 * MiniMeMascot
 * Self-contained animated mascot: pure SVG + CSS keyframes.
 * No images, no GIF, no dependencies, so it always animates.
 * Works in the Next.js App Router (server or client component).
 *
 * Usage:
 *   import MiniMeMascot from "@/components/MiniMeMascot";
 *   <MiniMeMascot size={160} />
 *   <MiniMeMascot size={96} bubble={false} />
 *   <MiniMeMascot texts={["Ask anything", "Tanong lang!"]} />
 */

type MiniMeMascotProps = {
  /** Width and height. Number = px, or any CSS size. Default 240. */
  size?: number | string;
  /** Show the speech bubble. Default true. */
  bubble?: boolean;
  /** The two lines the bubble alternates between. */
  texts?: [string, string];
  /** Freeze motion when the visitor's OS has "reduce motion" on. Default false. */
  respectReducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

const CSS = `
.mmx{display:block;overflow:visible}
.mmx .mmx-bob{animation:mmx-bob 1.68s ease-in-out infinite}
.mmx .mmx-arm{transform-box:view-box;transform-origin:252px 276px;animation:mmx-wave .84s ease-in-out infinite alternate}
.mmx .mmx-ear-l{transform-box:view-box;transform-origin:110px 148px;animation:mmx-ear .84s ease-in-out -.08s infinite}
.mmx .mmx-ear-r{transform-box:view-box;transform-origin:290px 148px;animation:mmx-ear .84s ease-in-out -.08s infinite}
.mmx .mmx-horn-l{transform-box:view-box;transform-origin:154px 100px;animation:mmx-horn-l 1.68s ease-in-out infinite}
.mmx .mmx-horn-r{transform-box:view-box;transform-origin:246px 100px;animation:mmx-horn-r 1.68s ease-in-out infinite}
.mmx .mmx-spark{transform-box:fill-box;transform-origin:center;animation:mmx-tw .84s ease-in-out infinite}
.mmx .mmx-code{animation:mmx-code 1.68s ease-in-out infinite}
.mmx .mmx-shadow{transform-box:fill-box;transform-origin:center;animation:mmx-shadow 1.68s ease-in-out infinite}
.mmx .mmx-glow{transform-box:view-box;transform-origin:200px 210px;animation:mmx-glow 1.68s ease-in-out infinite}
.mmx .mmx-bubble{animation:mmx-float 1.68s ease-in-out -.27s infinite}
.mmx .mmx-t1{animation:mmx-t1 1.68s step-end infinite}
.mmx .mmx-t2{animation:mmx-t2 1.68s step-end infinite}
.mmx .mmx-sweep{animation:mmx-sweep 1.68s linear infinite}
.mmx .mmx-chain-glint{animation:mmx-chs 1.68s step-end infinite}
@keyframes mmx-bob{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(5px)}75%{transform:translateY(-5px)}}
@keyframes mmx-wave{from{transform:rotate(-90deg)}to{transform:rotate(-34deg)}}
@keyframes mmx-ear{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
@keyframes mmx-horn-l{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(-1.6deg)}75%{transform:rotate(1.6deg)}}
@keyframes mmx-horn-r{0%,50%,100%{transform:rotate(0)}25%{transform:rotate(1.6deg)}75%{transform:rotate(-1.6deg)}}
@keyframes mmx-tw{0%,50%,100%{transform:scale(.55)}25%,75%{transform:scale(1)}}
@keyframes mmx-code{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(-6.5px)}75%{transform:translateY(6.5px)}}
@keyframes mmx-shadow{0%,50%,100%{transform:scaleX(1)}25%{transform:scaleX(.9)}75%{transform:scaleX(1.1)}}
@keyframes mmx-glow{0%,50%,100%{transform:scale(1)}25%{transform:scale(1.05)}75%{transform:scale(.95)}}
@keyframes mmx-float{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(3px)}75%{transform:translateY(-3px)}}
@keyframes mmx-t1{0%{opacity:1}50%{opacity:0}100%{opacity:0}}
@keyframes mmx-t2{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
@keyframes mmx-sweep{0%{transform:translateX(-34px)}55%{transform:translateX(34px)}100%{transform:translateX(34px)}}
@keyframes mmx-chs{0%{opacity:0}12%{opacity:1}20%{opacity:0}62%{opacity:1}70%{opacity:0}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.mmx.mmx-rm *{animation:none!important}}
`;

const STAR = "M9 0 L1.8 1.8 L0 9 L-1.8 1.8 L-9 0 L-1.8 -1.8 L0 -9 L1.8 -1.8 Z";

function Spark({ x, y, fill, delay }: { x: number; y: number; fill: string; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="mmx-spark" d={STAR} fill={fill} style={{ animationDelay: `${delay}s` }} />
    </g>
  );
}

export default function MiniMeMascot({
  size = 240,
  bubble = true,
  texts = ["Ask anything", "GOAT mode"],
  respectReducedMotion = false,
  className,
  style,
  title = "Mini me mascot",
}: MiniMeMascotProps) {
  const cls = ["mmx", respectReducedMotion ? "mmx-rm" : "", className ?? ""].filter(Boolean).join(" ");
  const FONT = '"DejaVu Sans", Verdana, system-ui, sans-serif';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        className={cls}
        style={style}
        viewBox="0 0 400 400"
        width={size}
        height={size}
        role="img"
        aria-label={title}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        <defs>
          <radialGradient id="mmx-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#624ce6" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#4a3aa8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#4a3aa8" stopOpacity="0" />
          </radialGradient>
          <clipPath id="mmx-lens-l">
            <rect x="144" y="188" width="44" height="32" rx="9" />
          </clipPath>
          <clipPath id="mmx-lens-r">
            <rect x="212" y="188" width="44" height="32" rx="9" />
          </clipPath>
        </defs>

        {/* glow + sparkles + code tag */}
        <g className="mmx-glow">
          <circle cx="200" cy="210" r="175" fill="url(#mmx-glow-grad)" />
        </g>
        <Spark x={58} y={96} fill="#46dcff" delay={0} />
        <Spark x={346} y={168} fill="#fafaff" delay={-0.267} />
        <Spark x={52} y={268} fill="#b4a0ff" delay={-0.535} />
        <Spark x={350} y={300} fill="#46dcff" delay={-0.134} />
        <text
          className="mmx-code"
          x="24"
          y="193"
          fontFamily='"DejaVu Sans Mono", Menlo, Consolas, monospace'
          fontWeight="700"
          fontSize="24"
          fill="#46c8f0"
        >
          {"</>"}
        </text>

        {/* ground shadow */}
        <ellipse className="mmx-shadow" cx="200" cy="359" rx="62" ry="7" fill="#060810" />

        {/* character */}
        <g className="mmx-bob">
          {/* feet */}
          <rect x="158" y="342" width="37" height="22" rx="9" fill="#1e1e34" />
          <rect x="205" y="342" width="37" height="22" rx="9" fill="#1e1e34" />

          {/* hoodie body */}
          <rect x="142" y="252" width="116" height="94" rx="30" fill="#6c5cfc" />
          <rect x="168" y="300" width="64" height="36" rx="12" fill="#5446d6" />
          <line x1="188" y1="258" x2="186" y2="284" stroke="#fafaff" strokeWidth="3" />
          <line x1="212" y1="258" x2="214" y2="284" stroke="#fafaff" strokeWidth="3" />

          {/* left arm */}
          <rect x="122" y="266" width="28" height="56" rx="13" fill="#6c5cfc" />
          <circle cx="136" cy="324" r="12" fill="#f5c49e" />

          {/* waving arm (rotates from the shoulder) */}
          <g className="mmx-arm">
            <line x1="252" y1="276" x2="308" y2="276" stroke="#6c5cfc" strokeWidth="26" />
            <circle cx="252" cy="276" r="13" fill="#6c5cfc" />
            <circle cx="308" cy="276" r="13" fill="#f5c49e" />
          </g>

          {/* neck, ears, head */}
          <rect x="184" y="244" width="32" height="22" rx="6" fill="#e1a580" />
          <ellipse cx="122" cy="199.5" rx="10" ry="16.5" fill="#f5c49e" />
          <ellipse cx="278" cy="199.5" rx="10" ry="16.5" fill="#f5c49e" />
          <ellipse cx="200" cy="178" rx="85" ry="78" fill="#f5c49e" />

          {/* hair */}
          <path d="M110 175 A90 81 0 0 1 290 175 Z" fill="#18182c" />
          <polygon
            points="113,170 118,154 287,154 287,170 272,192 254,172 236,200 216,174 196,196 176,172 156,202 138,176"
            fill="#18182c"
          />

          {/* horns */}
          <g className="mmx-horn-l">
            <polyline points="154,100 144,74 144,48 160,30" fill="none" stroke="#deaa60" strokeWidth="18" strokeLinejoin="round" />
            <line x1="136" y1="77" x2="152" y2="71" stroke="#b48242" strokeWidth="3" />
            <line x1="136" y1="51" x2="152" y2="45" stroke="#b48242" strokeWidth="3" />
            <circle cx="160" cy="30" r="6.5" fill="#deaa60" />
          </g>
          <g className="mmx-horn-r">
            <polyline points="246,100 256,74 256,48 240,30" fill="none" stroke="#deaa60" strokeWidth="18" strokeLinejoin="round" />
            <line x1="248" y1="77" x2="264" y2="71" stroke="#b48242" strokeWidth="3" />
            <line x1="248" y1="51" x2="264" y2="45" stroke="#b48242" strokeWidth="3" />
            <circle cx="240" cy="30" r="6.5" fill="#deaa60" />
          </g>

          {/* floppy goat ears */}
          <g className="mmx-ear-l">
            <polygon points="110,138 50,128 46,152 112,158" fill="#faf4e8" />
            <polygon points="104,142 62,134 60,147 106,152" fill="#e8c4a4" />
          </g>
          <g className="mmx-ear-r">
            <polygon points="290,138 350,128 354,152 288,158" fill="#faf4e8" />
            <polygon points="296,142 338,134 340,147 294,152" fill="#e8c4a4" />
          </g>

          {/* boonie hat: brim, crown, band */}
          <ellipse cx="200" cy="157" rx="118" ry="25" fill="#2c2668" />
          <ellipse cx="200" cy="156" rx="108" ry="20" fill="#3e368c" />
          <ellipse cx="200" cy="156" rx="102" ry="16" fill="none" stroke="#9684ff" strokeWidth="2" />
          <path d="M120 146 A80 68 0 0 1 280 146 Z" fill="#3e368c" />
          <rect x="120" y="126" width="160" height="18" rx="4" fill="#9684ff" />
          <line x1="152" y1="126" x2="173.6" y2="93.6" stroke="#2c2668" strokeWidth="2" />
          <line x1="176" y1="126" x2="186.8" y2="88.8" stroke="#2c2668" strokeWidth="2" />
          <line x1="200" y1="126" x2="200" y2="84" stroke="#2c2668" strokeWidth="2" />
          <line x1="224" y1="126" x2="213.2" y2="88.8" stroke="#2c2668" strokeWidth="2" />
          <line x1="248" y1="126" x2="226.4" y2="93.6" stroke="#2c2668" strokeWidth="2" />

          {/* shades */}
          <rect x="144" y="188" width="44" height="32" rx="9" fill="#0e1020" />
          <rect x="212" y="188" width="44" height="32" rx="9" fill="#0e1020" />
          <rect x="147" y="191" width="38" height="9" rx="5" fill="#223468" />
          <rect x="215" y="191" width="38" height="9" rx="5" fill="#223468" />
          <ellipse cx="154" cy="195.5" rx="3" ry="2.5" fill="#fafaff" />
          <ellipse cx="222" cy="195.5" rx="3" ry="2.5" fill="#fafaff" />
          <g clipPath="url(#mmx-lens-l)">
            <g className="mmx-sweep">
              <polygon points="166,190 173,190 165,218 158,218" fill="#82a0dc" />
            </g>
          </g>
          <g clipPath="url(#mmx-lens-r)">
            <g className="mmx-sweep">
              <polygon points="234,190 241,190 233,218 226,218" fill="#82a0dc" />
            </g>
          </g>
          <rect x="188" y="194" width="24" height="6" rx="3" fill="#0e1020" />
          <line x1="144" y1="198" x2="116" y2="196" stroke="#0e1020" strokeWidth="4" />
          <line x1="256" y1="198" x2="284" y2="196" stroke="#0e1020" strokeWidth="4" />

          {/* smirk */}
          <polyline
            points="190,232 200,236 212,230 218,223"
            fill="none"
            stroke="#8c3746"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* chin strap */}
          <polyline points="100,172 118,222 152,256 200,264" fill="none" stroke="#1e1a46" strokeWidth="3" strokeLinejoin="round" />
          <polyline points="300,172 282,222 248,256 200,264" fill="none" stroke="#1e1a46" strokeWidth="3" strokeLinejoin="round" />
          <rect x="192" y="258" width="16" height="14" rx="4" fill="#ffcd46" />

          {/* gold chain + J pendant */}
          <path d="M170 262 Q200 334 230 262" fill="none" stroke="#ffcd46" strokeWidth="4" />
          <circle cx="200" cy="304" r="12" fill="#ffcd46" />
          <circle cx="200" cy="304" r="8" fill="#ffe282" />
          <text x="200" y="309" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="13" fill="#78500a">
            J
          </text>
          <g transform="translate(214 292)">
            <path
              className="mmx-chain-glint"
              d="M6 0 L1.2 1.2 L0 6 L-1.2 1.2 L-6 0 L-1.2 -1.2 L0 -6 L1.2 -1.2 Z"
              fill="#fafaff"
              opacity="0"
            />
          </g>
        </g>

        {/* speech bubble */}
        {bubble && (
          <g className="mmx-bubble">
            <rect x="232" y="14" width="160" height="48" rx="16" fill="#fafaff" />
            <path d="M256 60 L280 60 L252 82 Z" fill="#fafaff" />
            <text className="mmx-t1" x="312" y="45" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="19" fill="#1e1e3c">
              {texts[0]}
            </text>
            <text className="mmx-t2" x="312" y="45" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="19" fill="#6e46f0" opacity="0">
              {texts[1]}
            </text>
          </g>
        )}
      </svg>
    </>
  );
}
