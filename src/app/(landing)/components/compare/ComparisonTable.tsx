import {
  coreBenchmarkFeatures,
  type CompareAppBenchmark,
  type CompareAppBenchmarkExtra,
} from "@/lib/compareData";

interface ComparisonTableProps {
  appName: string;
  benchmark: CompareAppBenchmark;
}

type TableRow = {
  id: string;
  feature: string;
  lumore: string;
  app: string;
};

function hasValidExtraRow(
  extra: CompareAppBenchmarkExtra | undefined,
): extra is CompareAppBenchmarkExtra {
  return Boolean(
    extra &&
      typeof extra.label === "string" &&
      extra.label.trim() &&
      typeof extra.lumoreValue === "string" &&
      extra.lumoreValue.trim() &&
      typeof extra.appValue === "string" &&
      extra.appValue.trim(),
  );
}

export default function ComparisonTable({
  appName,
  benchmark,
}: ComparisonTableProps) {
  const coreRows: TableRow[] = coreBenchmarkFeatures.map((feature) => ({
    id: feature.id,
    feature: feature.label,
    lumore: feature.lumoreValue,
    app: benchmark.core[feature.id],
  }));

  const extraRows: TableRow[] = (benchmark.extras ?? [])
    .filter(hasValidExtraRow)
    .map((extra, index) => ({
      id: extra.id || `extra-${index}`,
      feature: extra.label.trim(),
      lumore: extra.lumoreValue.trim(),
      app: extra.appValue.trim(),
    }));

  const rows = [...coreRows, ...extraRows];

  return (
    <div className="overflow-hidden rounded-2xl border border-ui-shade/12 bg-ui-light/95 shadow-[0_14px_35px_rgba(0,0,0,0.06)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">
            Competitive benchmark comparison table for Lumore and {appName}
          </caption>
          <thead className="bg-ui-background/70">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-ui-shade/80 md:px-6">
                Feature
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-ui-shade/80 md:px-6">
                Lumore
              </th>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-ui-shade/80 md:px-6">
                {appName}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.feature}
                className="border-t border-ui-shade/10 even:bg-ui-light odd:bg-ui-background/35"
              >
                <th className="px-5 py-4 text-sm font-semibold text-ui-shade md:px-6 md:text-base">
                  {row.feature}
                </th>
                <td className="px-5 py-4 md:px-6">
                  <p className="text-sm font-semibold text-ui-shade md:text-base">
                    {row.lumore}
                  </p>
                </td>
                <td className="px-5 py-4 md:px-6">
                  <p className="text-sm text-ui-shade/85 md:text-base">
                    {row.app}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
