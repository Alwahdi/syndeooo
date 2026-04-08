import { database } from "@repo/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "../components/header";

interface SearchPageProperties {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q: rawQ } = await searchParams;
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;

  return {
    title: q ? `${q} - Search results` : "Search",
    description: q ? `Search results for ${q}` : "Search",
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q: rawQ } = await searchParams;
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ;

  if (!q) {
    redirect("/");
  }

  const shifts = await database.shift.findMany({
    where: {
      title: { contains: q, mode: "insensitive" },
      status: "open",
    },
    include: {
      clinic: { select: { name: true, city: true } },
    },
    take: 20,
    orderBy: { shiftDate: "asc" },
  });

  return (
    <>
      <Header page="Search" pages={["SyndeoCare"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <p className="text-muted-foreground text-sm">
          {shifts.length} result{shifts.length !== 1 ? "s" : ""} for &ldquo;{q}
          &rdquo;
        </p>
        {shifts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
            <p className="mb-2 font-medium text-lg">No shifts found for &ldquo;{q}&rdquo;</p>
            <p className="mb-4 text-muted-foreground text-sm">
              Try adjusting your search or browse all available shifts
            </p>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
              href="/shifts"
            >
              Browse All Shifts
            </Link>
          </div>
        ) : (
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {shifts.map((shift) => (
              <Link href={`/shifts/${shift.id}`} key={shift.id}>
                <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                  <p className="font-medium">{shift.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {shift.clinic?.name && `${shift.clinic.name} \u00B7 `}{shift.city}
                  </p>
                  <p className="mt-1 text-primary text-sm">
                    SAR {Number(shift.hourlyRate)}/hr
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;