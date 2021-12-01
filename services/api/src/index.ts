import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { startApplication } from './start';
import { checkEnvVariables, attachHelperListenersToCluster, clusterApplication } from './util';

(() => {
	checkEnvVariables(['JWT_KEY', 'MONGO_URL', 'CDN_ACCOUNT_ID', 'CDN_TOKEN'], process.env);
	if (!cluster.isMaster || process.env.NODE_ENV !== 'production') return startApplication(Number(process.env.PORT));
	clusterApplication(cluster, cpus().length);
	attachHelperListenersToCluster(cluster);
})();
