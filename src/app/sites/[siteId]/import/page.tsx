"use client";

import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";

type ParsedRow = Record<string, string>;
type FieldMapping = Record<string, string>;

const eventFields = [
  { key: "name", label: "Event name", required: true },
  { key: "path", label: "Path", required: true },
  { key: "timestamp", label: "Timestamp", required: true },
  { key: "referrer", label: "Referrer", required: false },
  { key: "browser", label: "Browser", required: false },
  { key: "os", label: "OS", required: false },
  { key: "country", label: "Country", required: false },
  { key: "device", label: "Device", required: false },
  { key: "duration", label: "Duration", required: false },
  { key: "revenue", label: "Revenue", required: false },
];

export default function ImportPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ imported: number; skipped: number; errors: { row: number; error: string }[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback((file: File) => {
    setResult(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const data = results.data as ParsedRow[];
        const cols = results.meta.fields || [];
        setHeaders(cols);
        setRows(data);

        const autoMap: FieldMapping = {};
        for (const field of eventFields) {
          const match = cols.find(
            (c) => c.toLowerCase().replace(/[_\s-]/g, "") === field.key.toLowerCase()
          );
          if (match) autoMap[field.key] = match;
        }
        setMapping(autoMap);
      },
    });
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) processFile(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function mapField(fieldKey: string, csvCol: string) {
    setMapping((prev) => ({ ...prev, [fieldKey]: csvCol }));
  }

  async function handleImport() {
    setImporting(true);
    setProgress(0);

    const mapped = rows.map((row) => {
      const out: Record<string, string> = {};
      for (const field of eventFields) {
        const csvCol = mapping[field.key];
        if (csvCol && row[csvCol] !== undefined) {
          out[field.key] = row[csvCol];
        }
      }
      return out;
    });

    const BATCH = 1000;
    let totalImported = 0;
    let totalSkipped = 0;
    const allErrors: { row: number; error: string }[] = [];

    for (let i = 0; i < mapped.length; i += BATCH) {
      const chunk = mapped.slice(i, i + BATCH);
      const res = await fetch(`/api/sites/${siteId}/events/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: chunk }),
      });
      const data = await res.json();
      totalImported += data.imported;
      totalSkipped += data.skipped;
      allErrors.push(...(data.errors || []).map((e: { row: number; error: string }) => ({ ...e, row: e.row + i })));
      setProgress(Math.min(100, Math.round(((i + chunk.length) / mapped.length) * 100)));
    }

    setResult({ imported: totalImported, skipped: totalSkipped, errors: allErrors.slice(0, 50) });
    setImporting(false);
  }

  const requiredMapped = eventFields
    .filter((f) => f.required)
    .every((f) => mapping[f.key]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Import</h1>

      {/* Upload zone */}
      {rows.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
            dragOver
              ? "border-orange-400 bg-orange-50"
              : "border-stone-200 bg-white hover:border-stone-300"
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-stone-900">
            Drop a CSV here or click to browse.
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Revenue values should be in dollars. We convert to cents.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Column mapping */}
      {rows.length > 0 && !result && (
        <>
          <div className="mb-6 rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">
              Map columns
            </h2>
            <p className="mb-4 text-sm text-stone-500">
              Match your CSV columns to event fields. Required fields are marked with *.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {eventFields.map((field) => (
                <div key={field.key} className="flex items-center gap-3">
                  <label className="w-28 text-sm text-stone-700 flex-shrink-0">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  <select
                    value={mapping[field.key] || ""}
                    onChange={(e) => mapField(field.key, e.target.value)}
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-orange-500"
                  >
                    <option value="">-- skip --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6 rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-700">
                Preview — first 10 rows
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100">
                    {headers.slice(0, 8).map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-stone-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-stone-50">
                      {headers.slice(0, 8).map((h) => (
                        <td key={h} className="px-3 py-2 text-stone-600 truncate max-w-[150px] font-mono">
                          {row[h] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleImport}
              disabled={!requiredMapped || importing}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-50 transition-colors"
            >
              {importing ? `Importing... ${progress}%` : `Import ${rows.length.toLocaleString()} events`}

            </button>
            <button
              onClick={() => { setRows([]); setHeaders([]); setMapping({}); }}
              className="rounded-lg px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
          </div>

          {importing && (
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
              <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-stone-900">Done</p>
              <p className="text-sm text-stone-500">
                {result.imported.toLocaleString()} events imported.
                {result.skipped > 0 && ` ${result.skipped} skipped.`}
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <p className="mb-2 text-sm font-medium text-red-700">{result.errors.length} rows have errors</p>
              <ul className="space-y-1 text-xs text-red-600 font-mono">
                {result.errors.map((err, i) => (
                  <li key={i}>Row {err.row}: {err.error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => { setRows([]); setHeaders([]); setMapping({}); setResult(null); }}
            className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
          >
            Import more
          </button>
        </div>
      )}
    </div>
  );
}
