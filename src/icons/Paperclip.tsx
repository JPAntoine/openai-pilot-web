import type { SVGProps } from "react";
const SvgPaperclip = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={26} {...props}>
    <path
      fill="currentColor"
      fillRule="nonzero"
      d="M11.95 23.686a7 7 0 0 0 2.05-4.95V4.87a5.244 5.244 0 0 0-10.46 0V16.42a3.46 3.46 0 1 0 6.92 0v-6.92H8.33v6.92a1.33 1.33 0 1 1-2.66 0V4.87a3.113 3.113 0 0 1 6.2 0v13.867a4.87 4.87 0 1 1-9.74 0V9.5H0v9.236a7 7 0 0 0 11.95 4.949Z"
    />
  </svg>
);
export default SvgPaperclip;
