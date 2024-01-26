import type { SVGProps } from "react";
const SvgFail = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
    <g fill="currentColor" fillRule="evenodd">
      <path
        fill="#D0021B"
        d="M15 30C6.716 30 0 23.284 0 15 0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15Z"
      />
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M13.2 6.6h3.6l-.299 10.8H13.5L13.2 6.6ZM15 23.4c-1.095 0-1.8-.711-1.8-1.794 0-1.095.705-1.806 1.8-1.806 1.095 0 1.8.711 1.8 1.806 0 1.083-.705 1.794-1.8 1.794Z"
      />
    </g>
  </svg>
);
export default SvgFail;
