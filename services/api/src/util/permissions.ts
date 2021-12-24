import type { NextFunction, Request, Response } from 'express';
import type { IUser } from '../db/models/User';

export const ROLES = ['GUEST', 'MEMBER', 'MODERATOR', 'ADMIN', 'NICO'] as const;

export const hasPermission = (user: IUser, roleToCheckFor: typeof ROLES[number]) => {
	const roleCheckPosition = ROLES.indexOf(roleToCheckFor);
	// if the user has the role directly in their roles array, OR one of their roles is higher than the role asked for.
	// roles: ["GUEST"], role to check for: "MEMBER" should yield false
	// roles: ["MEMBER"], role to check for: "MEMBER" should yield true
	// roles: ["MODERATOR"], role to check for: "MEMBER" should yield true
	return user.roles.includes(roleToCheckFor) || user.roles.some((userRole) => roleCheckPosition < ROLES.indexOf(userRole));
};
