import { database } from "@repo/database";
import { redirect } from "next/navigation";
import { Header } from "../components/header";

interface SearchPageProperties {
  searchParams: Promise<{
    q: string;
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;

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
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {shifts.map((shift) => (
            <div className="rounded-xl border bg-card p-4" key={shift.id}>
              <p className="font-medium">{shift.title}</p>
              <p className="text-muted-foreground text-sm">
                {shift.clinic?.name} &middot; {shift.city}
              </p>
              <p className="mt-1 text-primary text-sm">
                SAR {Number(shift.hourlyRate)}/hr
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
