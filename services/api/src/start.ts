import app from './server';

// You might be wondering why there's a whole function for this, it's cause we have to export the app separately for
// chai and mocha tests
export const startApplication = (port: number | undefined) => {
	app.listen(port ?? 4327, () => console.log(`Server process started on port ${port} on process ${process.pid}`));
};
