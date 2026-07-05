export function convertBrusselsToUTC(brusselsISO: string): string {
  // Parse input string manually
  const parts = brusselsISO.split(/[-T:.Z]/).map(Number);
  const [year, month, day, hour = 0, minute = 0, second = 0] = parts;

  const utcPlaceholder = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // Create a formatter for Brussels timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Brussels",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 🧠 Explicitly type the accumulator
  const brusselsParts = formatter.formatToParts(utcPlaceholder).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== "literal") {
      acc[p.type] = p.value;
    }
    return acc;
  }, {});

  const brusselsLocal = new Date(
    `${brusselsParts.year}-${brusselsParts.month}-${brusselsParts.day}T${brusselsParts.hour}:${brusselsParts.minute}:${brusselsParts.second}Z`
  );

  const offsetMs = utcPlaceholder.getTime() - brusselsLocal.getTime();
  const trueUTC = new Date(utcPlaceholder.getTime() + offsetMs);

  return trueUTC.toISOString();
}

