import {
  expect,
  test,
} from '@playwright/test';
import { navigate } from '@/testing-helpers';

test('button should be visible', async ({
  page,
}) => {
  // Put the story name in here. Get it from the url in storybook...
  await navigate(page, 'components-__nameLowerCase__--storyname');

  const elem = await page.getByRole('button');

  await expect(elem)
    .toBeVisible();
});
