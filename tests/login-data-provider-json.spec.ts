import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';
import * as path from 'path';

type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'failure';
};

const jsonPath = path.join(process.cwd(), 'test-data', 'login.json');
const loginCases = JSON.parse(readFileSync(jsonPath, 'utf8')) as LoginCase[];

for (const loginCase of loginCases) {
  test(`login case: ${loginCase.name}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/auth/login');
    await page.getByLabel('Email address').fill(loginCase.email);
    await page.locator('[data-test="password"]').fill(loginCase.password);
    await page.getByRole('button', { name: 'Login' }).click();

    if (loginCase.expectedResult === 'success') {
      await expect(page).toHaveURL(/\/account/);
    } else {
      await expect(page.getByText('Invalid email or password')).toBeVisible();
    }
  });
}