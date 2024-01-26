import type { SVGProps } from "react";
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} {...props}>
    <path
      fill="#707372"
      fillRule="evenodd"
      d="M20 0c11.046 0 20 8.954 20 20s-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0Zm0 4.21C11.28 4.21 4.21 11.28 4.21 20c0 8.72 7.07 15.79 15.79 15.79 8.72 0 15.79-7.07 15.79-15.79 0-8.72-7.07-15.79-15.79-15.79Zm1.852 10.87V29.6H18.01V15.08h3.842Zm0-5.523v3.555H18.01V9.557h3.842Z"
    />
  </svg>
);
export default SvgInfo;
