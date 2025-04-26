import Papa from "papaparse";

export async function getUnitsFromCSV() {
  const response = await fetch("/data/it_units.csv");
  const text = await response.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data;
}
