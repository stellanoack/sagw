import {
  expect,
  test,
} from '@playwright/experimental-ct-react';

import { Button } from './Button';

test('should navigate to the about page', async ({
  mount,
}) => {
  const component = await mount(<Button label='Playwright test' />);

  await expect(component)
    .toContainText('Playwright test');
});
