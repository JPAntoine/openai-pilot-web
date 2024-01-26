import type { SVGProps } from "react";
const SvgSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
    <path
      fill="#78BE20"
      fillRule="evenodd"
      d="M15 0C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15Zm7.713 11.83-9.384 9.124a1.258 1.258 0 0 1-.878.354c-.329 0-.646-.127-.878-.354l-4.286-4.167a1.182 1.182 0 0 1 0-1.707 1.265 1.265 0 0 1 1.755 0l3.409 3.314 8.507-8.27a1.265 1.265 0 0 1 1.755 0 1.182 1.182 0 0 1 0 1.706Z"
    />
  </svg>
);
export default SvgSuccess;
