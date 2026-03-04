import type { Role } from "@/lib/careers-data";
import Badge from "../shared/Badge";
import Card from "../shared/Card";
import InlineIcon from "../shared/InlineIcon";
import CopyEmailButton from "./CopyEmailButton";

interface RoleCardProps {
  role: Role;
}

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <Card className="h-full p-4 md:p-5">
      <div className="flex flex-wrap gap-2">
        <Badge variant="highlight">{role.department}</Badge>
        <Badge variant="soft">{role.type}</Badge>
        <Badge variant="soft">{role.location}</Badge>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ui-shade">{role.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ui-shade/75">
        {role.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-ui-shade/70">
        <span className="inline-flex items-center gap-1.5">
          <InlineIcon name="location" className="h-3.5 w-3.5" />
          {role.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <InlineIcon name="briefcase" className="h-3.5 w-3.5" />
          {role.type}
        </span>
      </div>

      <CopyEmailButton
        email="careers@lumore.xyz"
        className="mt-5 w-full sm:w-auto"
      />
    </Card>
  );
}
