import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

import * as Router from './router';

const app = express();

const PORT = process.env.PORT || 8090;

const mainHtml = fs.readFileSync(path.resolve() + '/build/index.html', 'utf-8');
const adminHtml = fs.readFileSync(path.resolve() + '/build/admin.html', 'utf-8');

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve() + '/build'));

/**
 * register router
 */
Object.values(Router).forEach((router) => {
	app.use(router.route, router.router);
});

app.get(['/admin', '/admin/*'], (req, res) => {
	res.send(adminHtml);
});

app.get('*', (req, res) => {
	res.send(mainHtml);
});

app.use(<ErrorRequestHandler>((error, req, res, next) => {
	res.status(500).json({ route: req.url, error: error.message, handled: true });
}));

app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));
