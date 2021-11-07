export const checkEnvVariables = (requiredKeys: string[], processEnvs: NodeJS.ProcessEnv) => {
	const missingKeys: string[] = [];
	for (const envKey of requiredKeys) {
		if (!processEnvs[envKey]) missingKeys.push(envKey);
	}
	if (missingKeys.length) throw new Error(`Missing required env variable${missingKeys.length > 1 ? 's' : ''}: ${missingKeys.join(', ')}.`);
};
