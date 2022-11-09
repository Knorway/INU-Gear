import { Response } from 'express';

export class PubSub {
	public readonly connections: Record<string, Response> = {};

	public subscribe({ conn, key }: { conn: Response; key: string }) {
		this.connections[key] = conn;

		conn.setHeader('Content-Type', 'text/event-stream');
		conn.setHeader('Cache-Control', 'no-cache');
		conn.setHeader('X-Accel-Buffering', 'no');

		conn.on('close', () => {
			delete this.connections[key];
			console.log('stream disconnected from client side');
			conn.end();
		});
	}

	public publish({ key, payload }: { key: string; payload: unknown }) {
		const data = JSON.stringify(payload);
		this.connections[key].write(`data: ${data}\n\n`);
	}
}
