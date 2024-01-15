import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

export function generate_id(prefix: string, size?: number) {
	return `${prefix}_${nanoid(size ?? 9)}`;
}
