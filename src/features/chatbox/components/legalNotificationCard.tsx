import React from "react";
import Link from "../../link/link";

interface LegalNotificationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  explanation: string;
  link: string;
  icon: React.ReactNode;
  listItems?: { text: string; link?: string }[];
}

export const LegalNotificationCard: React.FC<LegalNotificationCardProps> = ({
  className,
  title,
  explanation,
  link,
  icon,
  listItems,
  ...rest
}) => {
  const baseStyle = "flex flex-col max-w-[22rem] text-white";
  const combinedStyle = `${baseStyle} ${className}`;

  return (
    <div className={combinedStyle} {...rest}>
      {icon}
      <span className="font-semibold text-xl pb-7 pt-3 self-center">{title}</span>
      <div className="list-disc flex flex-col self-center pl-6 text-base leading-5">
        <span className="mb-7 text-left">{explanation}</span>
        {listItems && (
          <ul className="pl-8">
            {listItems.map((item, index) => (
              <li key={index} className="mb-3">
                {item.link ? (
                  <Link href={item.link} openInNewTab={true} className="underline">
                    {item.text}
                  </Link>
                ) : (
                  item.text
                )}
              </li>
            ))}
          </ul>
        )}
        <Link className="self-center mt-3 underline" href={link} openInNewTab={true}>
          Learn more
        </Link>
      </div>
    </div>
  );
};
