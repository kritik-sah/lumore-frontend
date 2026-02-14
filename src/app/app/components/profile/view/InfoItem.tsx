"use client";

import Icon from "@/components/icon";

const InfoItem = ({ icon, value }: { icon: string; value: string | number }) => (
  <div className="px-6 py-2 rounded-full bg-ui-highlight/5 border border-ui-shade/5 flex items-center justify-center gap-1 flex-shrink-0">
    <div className="flex items-center justify-center flex-shrink-0 aspect-square">
      <Icon name={icon} className="text-xl flex-shrink-0" />
    </div>
    <p className="w-full flex-shrink-0 text-sm">{value}</p>
  </div>
);

export default InfoItem;
