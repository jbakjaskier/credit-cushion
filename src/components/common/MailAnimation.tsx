export default function MailAnimation() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      className="mx-auto mb-4"
    >
      <defs>
        <clipPath id="envelopeClip">
          <path d="M10,20 h80 v60 h-80 z" />
        </clipPath>
      </defs>

      {/* Envelope body */}
      <rect
        x="10"
        y="20"
        width="80"
        height="60"
        fill="#f0f0f0"
        stroke="#2c3e50"
        strokeWidth="2"
      >
        <animate
          attributeName="y"
          from="120"
          to="20"
          dur="0.5s"
          fill="freeze"
          begin="0s"
        />
      </rect>

      {/* Envelope flap */}
      <path
        d="M10,20 l40,30 l40,-30"
        fill="none"
        stroke="#2c3e50"
        strokeWidth="2"
      >
        <animate
          attributeName="d"
          from="M10,20 l40,30 l40,-30"
          to="M10,20 l40,-20 l40,20"
          dur="0.5s"
          fill="freeze"
          begin="0.5s"
        />
      </path>

      {/* Letter */}
      <rect
        x="15"
        y="25"
        width="70"
        height="50"
        fill="white"
        stroke="#2c3e50"
        strokeWidth="1"
        clipPath="url(#envelopeClip)"
      >
        <animate
          attributeName="y"
          from="90"
          to="25"
          dur="0.5s"
          fill="freeze"
          begin="0s"
        />
      </rect>

      {/* Letter lines */}
      <g clipPath="url(#envelopeClip)">
        <line
          x1="20"
          y1="35"
          x2="80"
          y2="35"
          stroke="#2c3e50"
          strokeWidth="1"
          opacity="0.5"
        >
          <animate
            attributeName="y1"
            from="100"
            to="35"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
          <animate
            attributeName="y2"
            from="100"
            to="35"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
        </line>
        <line
          x1="20"
          y1="45"
          x2="80"
          y2="45"
          stroke="#2c3e50"
          strokeWidth="1"
          opacity="0.5"
        >
          <animate
            attributeName="y1"
            from="110"
            to="45"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
          <animate
            attributeName="y2"
            from="110"
            to="45"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
        </line>
        <line
          x1="20"
          y1="55"
          x2="80"
          y2="55"
          stroke="#2c3e50"
          strokeWidth="1"
          opacity="0.5"
        >
          <animate
            attributeName="y1"
            from="120"
            to="55"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
          <animate
            attributeName="y2"
            from="120"
            to="55"
            dur="0.5s"
            fill="freeze"
            begin="0s"
          />
        </line>
      </g>

      {/* Sending animation */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="0 -80"
          dur="0.5s"
          fill="freeze"
          begin="1s"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="0.5s"
          fill="freeze"
          begin="1s"
        />
      </g>

      {/* Checkmark */}
      <path
        d="M30,50 l15,15 l25,-25"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="stroke-dasharray"
          from="0 100"
          to="100 100"
          dur="0.5s"
          fill="freeze"
          begin="1.5s"
        />
      </path>
    </svg>
  );
}
