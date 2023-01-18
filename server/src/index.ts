import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

import { asyncHandler } from './asyncHandler';
import { serverContext } from './context';
import { rewrites } from './rewrites';
import * as Routes from './router';

const app = express();

const PORT = process.env.PORT || 8090;

app.context = serverContext;

app.use(cors());
app.use(express.json());
app.use(
	express.static(path.resolve() + '/build', {
		maxAge: '365d',
	})
);

/**
 * register router
 */
Object.values(Routes).forEach((route) => {
	app.use(route.path, route.router);
});

/**
 * apply rewrites rules for static serving
 */
const staticHtmlMap = new Map<typeof rewrites[number]['page'], string>();

rewrites.forEach((rule) => {
	staticHtmlMap.set(
		rule.page,
		fs.readFileSync(path.resolve() + `/build/${rule.filepath}`, 'utf-8')
	);

	app.get(rule.path as string, (req, res) => {
		res.send(staticHtmlMap.get(rule.page));
	});
});

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	const statusCode = req.statusCode || 500;
	res.status(statusCode).json({ route: req.url, error: error.message, handled: true });
	console.log(`[ErrorRequestHandler]: ${error.message}`);
}));

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
