const { exec } = require('child_process');
const logExecOutput = (data) => console.log(data);

const runNPMInstall = exec('cd .. && yarn install');
runNPMInstall.stdout.on('data', logExecOutput);
runNPMInstall.stderr.on('data', logExecOutput);
runNPMInstall.on('close', () => {
	const runBuild = exec('cd .. && yarn run build');
	runBuild.stdout.on('data', logExecOutput);
	runBuild.stderr.on('data', logExecOutput);
	runBuild.on('close', () => {
		console.log('Setup complete.');
	});
});
