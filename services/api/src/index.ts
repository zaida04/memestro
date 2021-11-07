import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { startApplication } from './server';
import { checkEnvVariables, attachHelperListenersToCluster, clusterApplication } from './util';

(() => {
	checkEnvVariables(['JWT_KEY', 'MONGO_URL'], process.env);
	if (!cluster.isMaster || process.env.NODE_ENV !== 'production') return startApplication();
	clusterApplication(cluster, cpus().length);
	attachHelperListenersToCluster(cluster);
})();
