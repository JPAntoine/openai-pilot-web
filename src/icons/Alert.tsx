import type { SVGProps } from "react";
const SvgAlert = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} {...props}>
    <path
      fill="#707372"
      fillRule="evenodd"
      d="M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0Zm0 4.21C11.28 4.21 4.21 11.28 4.21 20c0 8.72 7.07 15.79 15.79 15.79 8.72 0 15.79-7.07 15.79-15.79 0-8.72-7.07-15.79-15.79-15.79Zm0 22.19c1.46 0 2.4.948 2.4 2.408 0 1.444-.94 2.392-2.4 2.392s-2.4-.948-2.4-2.392c0-1.46.94-2.408 2.4-2.408Zm2.4-17.6-.399 14.4H18L17.6 8.8h4.8Z"
    />
  </svg>
);
export default SvgAlert;
