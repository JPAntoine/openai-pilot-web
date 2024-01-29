import { Alert, Info } from "@/icons";
import { LegalNotificationCard } from "./legalNotificationCard";
import { Links } from "@/app/constants";

const LegalNotification: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  // Define the data for the cards here or pass them via props
  const cardsData = [
    {
      title: "SCE Guidelines",
      explanation: "By using this tool...",
      link: Links.GEN_AI_POLICY,
      icon: <Alert className="self-center"></Alert>,
      listItems: [
        { text: "IMPORTANT: This tool includes proprietary data..." },
        {
          text: "Information Governance Policy",
          link: Links.INFORMATION_GOVERNANCE_POLICY,
        },
        // ... other items
      ],
    },
    {
      title: "Tips For Use",
      explanation: "This tool is for employee use only...",
      link: Links.FAQs,
      icon: <Info className="self-center"></Info>,
      listItems: [
        { text: "Writing a prompt question...", link: Links.PROMPT_TIPS },
        // ... other items
      ],
    },
    // ... other cards
  ];

  return (
    <div className={`flex flex-row justify-center ${className || ""}`}>
      {cardsData.map((card, index) => (
        <LegalNotificationCard
          key={index}
          className="mr-28"
          {...card}
          {...rest}
        />
      ))}
    </div>
  );
};

export default LegalNotification;
