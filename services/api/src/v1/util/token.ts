import { sign, verify } from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';

// create a JWT created from a string formatted like id::timeitwascreated
export function createJWT(id: string, JWT_KEY: string): string {
	return sign(
		{
			id
		},
		JWT_KEY
	);
}

export interface JWTPayload {
	id: string | null;
}

export function decryptFormattedJWT(token: string, JWT_KEY: string): string {
	const { id } = verify(token, JWT_KEY) as JWTPayload;
	if (id && isValidObjectId(id)) return id;
	throw new Error('Invalid JWT');
}
