import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

import { prisma } from './prisma';
import { pubsub } from './pubsub';
import { rewrites } from './rewrites';
import * as Router from './router';

const app = express();

const PORT = process.env.PORT || 8090;

export const serverContext = {
	prisma,
	pubsub,
} as const;

app.context = serverContext;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve() + '/build'));

/**
 * register router
 */
Object.values(Router).forEach((route) => {
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
	res.status(500).json({ route: req.url, error: error.message, handled: true });
}));

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
