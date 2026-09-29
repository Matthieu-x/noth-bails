export type SendTableCell = string | number | boolean | null | undefined

export interface SendTableOptions {
	title?: string
	headers: string[]
	rows: SendTableCell[][]
	footer?: string
}

const cellToString = (value: SendTableCell): string => String(value ?? '')

/**
 * Creates a WhatsApp-safe text table. It intentionally uses plain text so
 * the table remains visible on normal WhatsApp clients.
 */
export const formatTable = ({ title, headers, rows, footer }: SendTableOptions): string => {
	if (!headers.length) {
		throw new Error('sendTable requires at least one header')
	}

	const normalizedRows = rows.map(row =>
		Array.from({ length: headers.length }, (_, index) => cellToString(row[index]))
	)
	const headerCells = headers.map(cellToString)

	const widths = headers.map((header, index) =>
		Math.max(header.length, ...normalizedRows.map(row => (row[index] ?? '').length))
	)

	const formatRow = (row: string[]) =>
		`│ ${row.map((cell, index) => cell.padEnd(widths[index] ?? 0)).join(' │ ')} │`

	const separator = `├─${widths.map(width => '─'.repeat(width)).join('─┼─')}─┤`
	const top = `┌─${widths.map(width => '─'.repeat(width)).join('─┬─')}─┐`
	const bottom = `└─${widths.map(width => '─'.repeat(width)).join('─┴─')}─┘`

	const lines: string[] = []
	if (title) lines.push(`*${title}*`)
	lines.push(top, formatRow(headerCells), separator)
	if (normalizedRows.length) {
		lines.push(...normalizedRows.map(formatRow))
	}
	lines.push(bottom)
	if (footer) lines.push(footer)

	return lines.join('\n')
}
