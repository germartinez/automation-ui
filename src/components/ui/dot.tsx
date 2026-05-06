'use client';

type DotProps = {
  color: string;
  size?: number;
};

function Dot({ color, size = 7 }: DotProps) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, background: color }}
    />
  );
}

export default Dot;
