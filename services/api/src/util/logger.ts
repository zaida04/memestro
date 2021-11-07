import COLORS from './colors';
import { getHeapStatistics } from 'v8';

const colorifyText = (text: string, color: string) => `${color}${text}${COLORS.RESET}`;

export const buildLogger = (name?: string) => {
	const max_mem_mb = Math.round(getHeapStatistics().total_available_size / 1024 / 1024).toFixed(2);
	const base = (type: string, value: string, color: string) => {
		const used_mem_mb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
		const prelude = colorifyText(`[${new Date().toUTCString()}][${used_mem_mb}MB/${max_mem_mb}MB][${name ?? ''}]`, COLORS.MAGENTA);
		return console.log(prelude, colorifyText(`[${type}] ${value}`, color), COLORS.RESET);
	};

	return {
		info: (value: string) => {
			return base('INFO', value, COLORS.GREEN);
		},
		warn: (value: string) => {
			return base('WARN', value, COLORS.YELLOW);
		},
		error: (value: string | Error) => {
			return base('ERR', value instanceof Error ? value.message + value.stack : value, COLORS.RED);
		}
	};
};

export type logger = ReturnType<typeof buildLogger>;
export interface Logger {
	info: (value: string) => void;
	warn: (value: string) => void;
	error: (value: string) => void;
}
