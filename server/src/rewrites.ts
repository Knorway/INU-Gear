export const rewrites = [
	{
		page: 'admin',
		path: ['/admin', '/admin/*'],
		filepath: 'admin.html',
	},
	{
		page: 'panel',
		path: ['/panel', '/panel/*'],
		filepath: 'panel/[sessionId].html',
	},
	{
		page: 'device',
		path: ['/device', '/device/*'],
		filepath: 'device/[sessionId].html',
	},
	{
		page: 'main',
		path: '*',
		filepath: 'index.html',
	},
] as const;
