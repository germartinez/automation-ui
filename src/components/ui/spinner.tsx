'use client';

type SpinnerProps = {
  size?: number;
  color?: string;
};

function Spinner({ size = 16, color }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className="animate-[spin_0.8s_linear_infinite]"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={color || `var(--border)`}
        strokeWidth="2.5"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        fill="none"
        stroke={color || `var(--accent)`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Spinner;
