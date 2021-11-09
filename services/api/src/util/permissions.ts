import type { IUser } from '../models/User';

export const ROLES = ['GUEST', 'MEMBER', 'MODERATOR', 'ADMIN', 'NICO'] as const;

export const hasPermission = (user: IUser, role: typeof ROLES[number]) => {
	const rolePosition = ROLES.indexOf(role);
	// if the user has the role directly in their roles array, OR one of their roles is higher than the role asked for.
	// roles: ["GUEST"], role to check for: "MEMBER" should yield false
	// roles: ["MEMBER"], role to check for: "MEMBER" should yield true
	// roles: ["MODERATOR"], role to check for: "MEMBER" should yield true
	return user.roles.includes(role) || user.roles.some((role) => rolePosition < ROLES.indexOf(role));
};
