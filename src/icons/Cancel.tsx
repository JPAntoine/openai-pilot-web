import type { SVGProps } from "react";
const SvgCancel = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} {...props}>
    <path
      fill="#000"
      fillRule="nonzero"
      d="M16 14.709 14.709 16 7.994 9.286 1.28 16 0 14.709l6.714-6.715L0 1.28 1.28 0l6.714 6.714L14.71 0 16 1.28 9.286 7.994z"
    />
  </svg>
);
export default SvgCancel;
