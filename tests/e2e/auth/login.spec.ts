import { expect, test } from '@playwright/test';

// Esse spec roda sem storageState
test.use({ storageState: { cookies: [], origins: [] } });

test('exibe formulário de login', async ({ page }) => {
	await page.goto('/login');
	await expect(
		page.getByRole('textbox', { name: 'Email address' }),
	).toBeVisible();
	await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
});

test('redireciona para /login quando não autenticado', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL(/login/);
});

test('exibe erro com credenciais inválidas', async ({ page }) => {
	await page.goto('/login');
	await page
		.getByRole('textbox', { name: 'Email address' })
		.fill('invalido@test.com');
	await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
	await page.getByRole('button', { name: /sign in/i }).click();
	await expect(page.getByRole('alert')).toBeVisible();
});
