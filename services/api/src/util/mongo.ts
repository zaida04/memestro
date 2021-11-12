import { Schema } from 'mongoose';

export const serializedString = {
	type: String,
	trim: true
} as const;

export const requiredString = {
	...serializedString,
	required: true
} as const;

export const numberEqGZero = {
	type: Number,
	min: 0
} as const;

export const requiredID = {
	type: Schema.Types.ObjectId,
	required: true
} as const;

export const defaultBool = {
	type: Boolean,
	default: false
};
