import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: 'https://env-manager-rust.vercel.app',
		trace: 'on-first-retry',
	},
	projects: [
		// Roda primeiro: faz login e salva estado
		{ name: 'setup', testMatch: /auth\.setup\.ts/ },
		// Testes que precisam de auth
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'tests/e2e/.auth/user.json',
			},
			dependencies: ['setup'],
		},
	],
});
