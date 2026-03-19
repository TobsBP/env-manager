import { expect, test } from '@playwright/test';

test('carrega o dashboard após login', async ({ page }) => {
	await page.goto('/dashboard');
	await expect(page).toHaveURL('/dashboard');
	await expect(page.getByRole('heading')).toBeVisible();
});

test('exibe lista de projetos', async ({ page }) => {
	await page.goto('/dashboard');
	// Aguarda conteúdo carregar (Firebase query)
	await expect(
		page
			.locator('[data-testid="project-list"]')
			.or(page.getByText(/no projects/i)),
	).toBeVisible({ timeout: 10000 });
});
