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
	if (key === 'seriesPct') return 'W%';
	if (key === 'seriesWins') return 'Srs W';
	if (key === 'seriesLosses') return 'Srs L';
	if (key === 'gfpg') return 'GF/g';
	if (key === 'gapg') return 'GA/g';
	if (key === 'gamePct') return 'Gs W%';
	if (key.toLowerCase().endsWith('pct')) return key.replace(/Pct$/i, ' %');
	if (key === 'games' || key === "series") return null
	return key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
}

// Sortable table component per report
function SortableReportTable({ rows }) {
	const [expandedSet, setExpandedSet] = useState(() => new Set());
	const columns = useMemo(() => getColumns(rows), [rows]);
	const visibleColumns = useMemo(() => columns.filter(col => labelFor(col) !== null), [columns]);
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

	function toggleExpanded(idx) {
		setExpandedSet(prev => {
			const next = new Set(prev);
			if (next.has(idx)) next.delete(idx); else next.add(idx);
			return next;
		});
	}

	// Build per-series groups with computed stats by matching games via seriesId or seriesBaseKey
	function buildSeriesGroups(row) {
		const seriesList = Array.isArray(row?.series) ? row.series : [];
		const games = Array.isArray(row?.games) ? row.games : [];
		const out = [];

		if (seriesList.length > 0) {
			for (const s of seriesList) {
				const sid = s.seriesId ?? s.id ?? null;
				let sGames = Array.isArray(s.games) && s.games.length > 0
					? s.games
					: games.filter(g => (sid != null && g.seriesId === sid) || (s.seriesBaseKey && g.seriesBaseKey === s.seriesBaseKey));
				sGames = [...sGames].sort((a, b) => (a.gameNumber ?? 0) - (b.gameNumber ?? 0));
				const wins = sGames.reduce((acc, g) => acc + (typeof g.goalsFor === 'number' && typeof g.goalsAgainst === 'number' ? (g.goalsFor > g.goalsAgainst ? 1 : 0) : (g.win === true ? 1 : 0)), 0);
				const losses = sGames.reduce((acc, g) => acc + (typeof g.goalsFor === 'number' && typeof g.goalsAgainst === 'number' ? (g.goalsFor < g.goalsAgainst ? 1 : 0) : (g.win === false ? 1 : 0)), 0);
				out.push({
					key: sid ?? s.seriesBaseKey ?? `s-${Math.random().toString(36).slice(2)}`,
					opponent: s.opponent ?? s.opponentName ?? (sGames[0]?.opponent ?? ''),
					opponentImg: s.opponentImg ?? (sGames[0]?.opponentImg),
					seriesBaseKey: s.seriesBaseKey ?? (sGames[0]?.seriesBaseKey),
					gameWins: s.gameWins ?? wins,
					gameLosses: s.gameLosses ?? losses,
					games: sGames,
				});
			}
			return out;
		}

		// Derive series from games if no explicit series list
		const byKey = new Map();
		for (const g of games) {
			const k = g.seriesId ?? g.seriesBaseKey;
			if (k == null) continue;
			if (!byKey.has(k)) byKey.set(k, []);
			byKey.get(k).push(g);
		}
		for (const [k, arr] of byKey.entries()) {
			const sorted = [...arr].sort((a, b) => (a.gameNumber ?? 0) - (b.gameNumber ?? 0));
			const wins = sorted.reduce((acc, g) => acc + (typeof g.goalsFor === 'number' && typeof g.goalsAgainst === 'number' ? (g.goalsFor > g.goalsAgainst ? 1 : 0) : (g.win === true ? 1 : 0)), 0);
			const losses = sorted.reduce((acc, g) => acc + (typeof g.goalsFor === 'number' && typeof g.goalsAgainst === 'number' ? (g.goalsFor < g.goalsAgainst ? 1 : 0) : (g.win === false ? 1 : 0)), 0);
			const first = sorted[0] || {};
			out.push({
				key: k,
				opponent: first.opponent ?? '',
				opponentImg: first.opponentImg,
				seriesBaseKey: first.seriesBaseKey,
				gameWins: wins,
				gameLosses: losses,
				games: sorted,
			});
		}
		return out;
	}

	return (
		<div className="w-full overflow-x-auto">
			<table className="table-fixed w-full text-xs text-left text-neutral-300 border border-slate-700 rounded-md overflow-hidden">
				<thead className="bg-slate-950 text-neutral-300">
					<tr>
						{visibleColumns.map((col) => {
							const active = col === sortKey;
							const ariaSort = active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
							return (
								<th
									key={col}
									scope="col"
									aria-sort={ariaSort}
									className={`px-2 py-1 border-b border-slate-800 whitespace-nowrap select-none cursor-pointer hover:text-white text-center ${active ? 'text-white' : ''}`}
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
						<>
						<tr
							key={idx}
							className={idx % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800'}
							style={{ cursor: (Array.isArray(row.series) && row.series.length) || (Array.isArray(row.games) && row.games.length) ? 'pointer' : undefined }}
							onClick={() => toggleExpanded(idx)}
						>
							{visibleColumns.map((col) => {
								const val = row?.[col];
								const isNum = numericMap[col];
								const isPct = /pct$/i.test(col);
								return (
									<td key={col} className={`px-2 py-1 border-t border-slate-700 align-middle whitespace-nowrap text-center ${isNum ? 'font-mono tabular-nums' : ''}`}>
										{col === 'name' ? (
											(() => {
												const logo = row?.logoImg;
												const teamName = row?.name || '';
												if (logo) {
													return (
														<div className="flex items-center justify-center gap-2">
															<img
																src={`/${logo}`}
																alt={teamName}
																title={teamName}
																className="h-5 w-auto object-contain max-w-[40px]"
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
						{expandedSet.has(idx) && ((Array.isArray(row.series) && row.series.length) || (Array.isArray(row.games) && row.games.length)) && (
							<tr key={`detail-${idx}`} className="bg-slate-950">
								<td colSpan={visibleColumns.length} className="px-2 py-2 border-t border-slate-700">
									<div className="overflow-x-auto">
										{buildSeriesGroups(row).map((series, sIdx) => (
											<table key={series.key ?? sIdx} className="table-fixed w-full mb-3 text-xs border border-slate-800 rounded">
												<thead>
													<tr className="bg-slate-900">
														<th className="px-2 py-1 text-center w-28">Opponent</th>
														<th className="px-2 py-1 text-center w-40">Series</th>
														<th className="px-2 py-1 text-center w-10">W</th>
														<th className="px-2 py-1 text-center w-10">L</th>
														<th className="px-2 py-1 text-center">Game Scores</th>
													</tr>
												</thead>
												<tbody>
													<tr className="w-full">
														<td className="px-2 py-1 text-center w-28">
															{series.opponentImg ? (
																<img src={`/${series.opponentImg}`} alt={series.opponent} title={series.opponent} className="h-5 w-auto mx-auto object-contain max-w-[40px]" />
															) : (
																<span>{series.opponent}</span>
															)}
														</td>
														<td className="px-2 py-1 text-center w-40">{series.seriesBaseKey}</td>
														<td className="px-2 py-1 text-center w-10">{series.gameWins}</td>
														<td className="px-2 py-1 text-center w-10">{series.gameLosses}</td>
														<td className="px-2 py-1 text-center whitespace-nowrap">
															{(() => {
																const scores = Array.isArray(series.games) ? series.games.map((g) => {
																	if (typeof g.goalsFor === 'number' && typeof g.goalsAgainst === 'number') {
																		return `${g.goalsFor}-${g.goalsAgainst}`;
																	}
																	if (g.win === true) return 'W';
																	if (g.win === false) return 'L';
																	return '—';
																}) : [];
																return scores.length > 0 ? scores.join(', ') : '—';
															})()}
														</td>
													</tr>
												</tbody>
											</table>
										))}
									</div>
								</td>
							</tr>
						)}
						</>
					))}
					{sortedRows.length === 0 && (
						<tr>
							<td className="px-2 py-3 text-neutral-500" colSpan={visibleColumns.length || 1}>No data</td>
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
					<div className="p-0">
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
					<div className="p-0">
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

