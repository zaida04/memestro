import type { Cluster } from 'cluster';

export const clusterApplication = (cluster: Cluster, amountOfClusters: number) => {
	for (let i = 0; i < amountOfClusters; i++) {
		cluster.fork().on('message', console.log);
	}
};

export const attachHelperListenersToCluster = (cluster: Cluster) => {
	cluster
		.on('exit', (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} has been killed with a ${signal} signal returning a ${code} exit code.`);
		})
		.on('fork', (worker) => {
			console.log(`Worker process started on ${worker.process.pid}.`);
		});
};
