import { useEffect, useMemo, useState } from 'react';
import reportsData from '../data/rlcs-reports.json';

// Utility: build column list from rows; apply requested order, then any extras alphabetically
function getColumns(rows) {
	const cols = new Set();
	rows.forEach(r => Object.keys(r || {}).forEach(k => cols.add(k)));
	const all = Array.from(cols);
	// Exclude helper fields that shouldn't render as columns
	const filtered = all.filter(k => k !== 'logoImg');
	const desiredOrder = ['name', 'seriesPct', 'seriesWins', 'seriesLosses', 'gfpg', 'gapg', 'gamePct'];
	const inDesired = desiredOrder.filter(k => filtered.includes(k));
	const extras = filtered.filter(k => !desiredOrder.includes(k)).sort((a, b) => a.localeCompare(b));
	return [...inDesired, ...extras];
}

// Utility: detect numeric column (treat null/undefined as empty)
function isNumericColumn(rows, key) {
	for (const r of rows) {
		const v = r?.[key];
		if (v === null || v === undefined || v === '') continue;
		if (typeof v === 'number') return true;
		const n = Number(v);
		if (!Number.isNaN(n)) return true;
		return false; // first non-empty and not numeric
	}
	return false;
}

// Utility: friendly header labels
function labelFor(key) {
	if (key === 'name') return 'Team';
	if (key === 'seriesPct') return 'Series W%';
	if (key === 'seriesWins') return 'Series W';
	if (key === 'seriesLosses') return 'Series L';
	if (key === 'gfpg') return 'G/g';
	if (key === 'gapg') return 'GA/g';
	if (key === 'gamePct') return 'Games W%';
	if (key.toLowerCase().endsWith('pct')) return key.replace(/Pct$/i, ' %');
	return key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
}

// Sortable table component per report
function SortableReportTable({ rows }) {
	const columns = useMemo(() => getColumns(rows), [rows]);
	const [sortKey, setSortKey] = useState(() => (columns.includes('seriesPct') ? 'seriesPct' : (columns[0] || null)));
	const [sortDir, setSortDir] = useState('desc'); // default desc for numbers

	// Reset default sort when data shape (columns) changes
	useEffect(() => {
		setSortKey(columns.includes('seriesPct') ? 'seriesPct' : (columns[0] || null));
		setSortDir('desc');
	}, [columns]);

	const numericMap = useMemo(() => {
		const map = {};
		columns.forEach(c => (map[c] = isNumericColumn(rows, c)));
		return map;
	}, [columns, rows]);

	const sortedRows = useMemo(() => {
		const data = [...rows];
		if (!sortKey) return data;
		const isNum = numericMap[sortKey];
		data.sort((a, b) => {
			const va = a?.[sortKey];
			const vb = b?.[sortKey];
			// Handle undefined/null as smallest
			if (va == null && vb == null) return 0;
			if (va == null) return sortDir === 'asc' ? -1 : 1;
			if (vb == null) return sortDir === 'asc' ? 1 : -1;
			if (isNum) {
				const na = typeof va === 'number' ? va : Number(va);
				const nb = typeof vb === 'number' ? vb : Number(vb);
				return sortDir === 'asc' ? na - nb : nb - na;
			} else {
				const sa = String(va).toUpperCase();
				const sb = String(vb).toUpperCase();
				if (sa < sb) return sortDir === 'asc' ? -1 : 1;
				if (sa > sb) return sortDir === 'asc' ? 1 : -1;
				return 0;
			}
		});
		return data;
	}, [rows, sortKey, sortDir, numericMap]);

	function onHeaderClick(key) {
		if (key === sortKey) {
			setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortKey(key);
			setSortDir(numericMap[key] ? 'desc' : 'asc');
		}
	}

	return (
			<div className="w-full overflow-x-auto">
				<table className="w-full text-sm text-left text-neutral-300 border border-slate-700 rounded-md overflow-hidden">
					<thead className="bg-slate-950 text-neutral-300">
					<tr>
						{columns.map((col) => {
							const active = col === sortKey;
							const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
							return (
								<th
									key={col}
									scope="col"
									aria-sort={ariaSort}
										className={`px-3 py-2 border-b border-slate-800 whitespace-nowrap select-none cursor-pointer hover:text-white ${active ? 'text-white' : ''}`}
									onClick={() => onHeaderClick(col)}
									title={`Sort by ${labelFor(col)}`}
								>
									<div className="flex items-center gap-1">
										<span>{labelFor(col)}</span>
										{active && (
											<span className="text-[10px] opacity-70">{sortDir === 'asc' ? '▲' : '▼'}</span>
										)}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{sortedRows.map((row, idx) => (
						<tr key={idx} className={idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}>
							{columns.map((col) => {
								const val = row?.[col];
								const isNum = numericMap[col];
											const isPct = /pct$/i.test(col);
								return (
									<td key={col} className="px-3 py-2 border-t border-slate-700 align-middle">
										{col === 'name' ? (
											(() => {
												const logo = row?.logoImg;
												const teamName = row?.name || '';
												if (logo) {
													return (
														<div className="flex items-center gap-2">
															<img
																src={`/${logo}`}
																alt={teamName}
																title={teamName}
																className="h-7 w-auto object-contain"
																loading="lazy"
															/>
															<span className="sr-only">{teamName}</span>
														</div>
													);
												}
												return teamName ? <span className="text-neutral-200">{teamName}</span> : <span className="text-neutral-500">—</span>;
											})()
										) : (
											val == null || val === '' ? (
												<span className="text-neutral-500">—</span>
											) : (
												<span className="text-neutral-200">
													{isNum ? (() => {
														const num = typeof val === 'number' ? val : Number(val);
														if (!Number.isFinite(num)) return String(val);
														const show = Number.isInteger(num) ? String(num) : num.toFixed(2);
														return isPct ? `${show}%` : show;
													})() : String(val)}
												</span>
											)
										)}
									</td>
								);
							})}
						</tr>
					))}
					{sortedRows.length === 0 && (
						<tr>
							<td className="px-3 py-4 text-neutral-500" colSpan={columns.length || 1}>No data</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default function Rlcs2025LanPage() {
	const reports = reportsData?.reports ?? [];
	const powerReports = useMemo(
		() => reports.filter(r => /power ranking/i.test(r.label || '')),
		[reports]
	);
	const lanReports = useMemo(
		() => reports.filter(r => /\bLAN\b/i.test(r.label || '') || /at a LAN/i.test(r.label || '')),
		[reports]
	);

	const [selectedPowerIdx, setSelectedPowerIdx] = useState(() => {
		const idx = powerReports.findIndex(r => /power\s*ranking\s*<=\s*8/i.test(r.label || ''));
		return idx >= 0 ? idx : 0;
	});
	const [selectedLanIdx, setSelectedLanIdx] = useState(() => {
		const idx = lanReports.findIndex(r => /top\s*8\b.*LAN/i.test(r.label || ''));
		return idx >= 0 ? idx : 0;
	});

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full items-center mb-2">
				<h2 className="my-0 text-xl text-neutral-200">RLCS 2025 LAN Reports</h2>
			</div>

			<div className="flex flex-col gap-6 w-full">
				{/* Power Ranking Reports */}
				<div className="rounded-md border border-slate-700 bg-contentBg">
					<div className="px-3 py-2 border-b border-slate-700 bg-slate-900 flex flex-col sm:flex-row gap-2 sm:items-center">
						<h3 className="m-0 text-neutral-200 text-base">Power Ranking Reports</h3>
						<div className="ml-0 sm:ml-auto flex items-center gap-2">
							{/* <label htmlFor="power-select" className="text-xs text-neutral-400">Select report</label> */}
							<select
								id="power-select"
								className="bg-contentBg text-neutral-200 border border-slate-700 rounded px-2 py-1 text-sm"
								value={selectedPowerIdx}
								onChange={(e) => setSelectedPowerIdx(Number(e.target.value))}
							>
								{powerReports.map((r, idx) => (
									<option key={idx} className="cursor-pointer bg-slate-950" value={idx}>{r.label || `Report ${idx + 1}`}</option>
								))}
							</select>
						</div>
					</div>
					<div className="p-3">
						{powerReports.length > 0 ? (
							<SortableReportTable rows={powerReports[selectedPowerIdx]?.rows || []} />
						) : (
							<div className="text-neutral-400 text-sm">No power ranking reports found.</div>
						)}
					</div>
				</div>

				{/* LAN Finish Reports */}
				<div className="rounded-md border border-slate-700 bg-contentBg">
					<div className="px-3 py-2 border-b border-slate-700 bg-slate-900 flex flex-col sm:flex-row gap-2 sm:items-center">
						<h3 className="m-0 text-neutral-200 text-base">LAN Finish Reports</h3>
						<div className="ml-0 sm:ml-auto flex items-center gap-2">
							{/* <label htmlFor="lan-select" className="text-xs text-neutral-400">Select report</label> */}
							<select
								id="lan-select"
								className="bg-contentBg text-neutral-200 border border-slate-700 rounded px-2 py-1 text-sm"
								value={selectedLanIdx}
								onChange={(e) => setSelectedLanIdx(Number(e.target.value))}
							>
								{lanReports.map((r, idx) => (
									<option key={idx} className="cursor-pointer bg-slate-950" value={idx}>{r.label || `Report ${idx + 1}`}</option>
								))}
							</select>
						</div>
					</div>
					<div className="p-3">
						{lanReports.length > 0 ? (
							<SortableReportTable rows={lanReports[selectedLanIdx]?.rows || []} />
						) : (
							<div className="text-neutral-400 text-sm">No LAN reports found.</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

