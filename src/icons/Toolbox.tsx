import type { SVGProps } from "react";
const SvgToolbox = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 17" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="currentColor"
        d="M2 2.489h20a2 2 0 0 1 2 2v3.6H0v-3.6a2 2 0 0 1 2-2ZM0 9.333h24V16.8H0z"
      />
      <rect
        width={10.5}
        height={3.478}
        x={6.75}
        y={0.75}
        stroke="#FFF"
        strokeWidth={1.5}
        rx={1.739}
      />
      <path
        stroke="#2D343B"
        strokeLinecap="square"
        d="M6.06 7.467v2.488M18 7.467v2.488"
      />
    </g>
  </svg>
);
export default SvgToolbox;
