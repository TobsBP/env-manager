export interface Connection {
	id: string;
	userId: string;
	fromProjectId: string;
	fromEnvId: string;
	toProjectId: string;
	toEnvId: string;
	createdAt: unknown;
}
