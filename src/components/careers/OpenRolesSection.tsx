"use client";

import type { Role, RoleDepartment, RoleType } from "@/lib/careers-data";
import { useMemo, useState } from "react";
import Icon from "../icon";
import InlineIcon from "../shared/InlineIcon";
import RoleCard from "./RoleCard";

interface OpenRolesSectionProps {
  roles: Role[];
}

type FilterType = "All" | RoleType;

const filters: FilterType[] = ["All", "Intern", "Full-time"];
const departmentOrder: RoleDepartment[] = [
  "Engineering",
  "Product & Design",
  "Growth",
  "Ops",
];

function getDepartmentId(department: string) {
  return `dept-${department.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export default function OpenRolesSection({ roles }: OpenRolesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [query, setQuery] = useState("");

  const filteredRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return roles.filter((role) => {
      const filterMatch = activeFilter === "All" || role.type === activeFilter;

      const searchMatch =
        normalizedQuery.length === 0 ||
        role.title.toLowerCase().includes(normalizedQuery) ||
        role.department.toLowerCase().includes(normalizedQuery) ||
        role.location.toLowerCase().includes(normalizedQuery) ||
        role.description.toLowerCase().includes(normalizedQuery);

      return filterMatch && searchMatch;
    });
  }, [activeFilter, query, roles]);

  const groupedRoles = useMemo(
    () =>
      departmentOrder
        .map((department) => ({
          department,
          items: filteredRoles.filter((role) => role.department === department),
        }))
        .filter((group) => group.items.length > 0),
    [filteredRoles],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Role type filters"
          className="flex shrink-0 w-full flex-wrap items-center gap-2 md:w-auto"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full shrink-0 border px-6 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-highlight/60 ${
                  isActive
                    ? "border-ui-highlight bg-ui-highlight text-ui-light"
                    : "border-ui-shade/15 bg-ui-light text-ui-shade hover:bg-ui-background/60"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="relative block w-full flex items-center justify-center md:max-w-sm">
          <span className="sr-only">Search roles</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles"
            className="p-4 h-11 w-full rounded-xl border border-ui-shade/20 bg-ui-light text-sm text-ui-shade placeholder:text-ui-shade/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-highlight/60"
          />
        </div>
      </div>

      {groupedRoles.length > 0 ? (
        <div className="mt-8 space-y-8">
          {groupedRoles.map((group) => (
            <section
              key={group.department}
              aria-labelledby={getDepartmentId(group.department)}
            >
              <h3
                id={getDepartmentId(group.department)}
                className="text-sm font-semibold uppercase tracking-[0.08em] text-ui-shade/70"
              >
                {group.department}
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.items.map((role) => (
                  <RoleCard key={role.title} role={role} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-ui-shade/12 bg-ui-light p-6 text-center">
          <p className="text-sm text-ui-shade/75">
            No roles match your current filters. Try another keyword or switch
            tabs.
          </p>
        </div>
      )}
    </div>
  );
}
