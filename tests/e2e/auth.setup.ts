import { test as setup } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL as string;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD as string;

setup('authenticate', async ({ page }) => {
	if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
		throw Error('Set the email and pass');
	}

	await page.goto('/login');
	await page
		.getByRole('textbox', { name: 'Email address' })
		.fill(TEST_USER_EMAIL);
	await page
		.getByRole('textbox', { name: 'Password' })
		.fill(TEST_USER_PASSWORD);
	await page.getByRole('button', { name: 'Sign in' }).click();
	await page.waitForURL('/dashboard');
	await page.context().storageState({ path: authFile });
});
