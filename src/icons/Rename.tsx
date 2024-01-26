import type { SVGProps } from "react";
const SvgRename = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} {...props}>
    <path
      fill="#FFF"
      fillRule="nonzero"
      d="M10.091 3.778a.972.972 0 0 1 1.375 0l2.756 2.757c.38.38.38.994 0 1.374l-9.806 9.806a.972.972 0 0 1-.688.285H.972A.972.972 0 0 1 0 17.028v-2.755c0-.258.102-.505.285-.687ZM14.96.285l2.756 2.756c.38.38.38.995 0 1.374l-.842.843a.972.972 0 0 1-1.374 0L12.742 2.5a.972.972 0 0 1 0-1.374l.842-.842a.972.972 0 0 1 1.375 0Z"
    />
  </svg>
);
export default SvgRename;
