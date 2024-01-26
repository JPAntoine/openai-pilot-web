import type { SVGProps } from "react";
const SvgLink = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m30.366 10-5.001 5H8a3 3 0 0 0-3 3v24a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V26.579l5-5V42a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8h22.366ZM48 0a2.5 2.5 0 0 1 2.5 2.5v18a2.5 2.5 0 1 1-5 0V8.982L27.303 27.179a2.5 2.5 0 0 1-3.535-3.535L42.41 5H30a2.5 2.5 0 1 1 0-5h18Z"
    />
  </svg>
);
export default SvgLink;
