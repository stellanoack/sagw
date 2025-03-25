import {
  expect,
  test,
} from '@playwright/test';
import { IndexEntry } from '@storybook/types';
import {
  filterStories,
  navigate,
} from 'testing-helpers';

import manifest from '../../storybook-static/index.json' with { type: 'json' };
import { componentsConfig } from './config';

const visualStories: IndexEntry[] = filterStories(Object.values(manifest.entries) as IndexEntry[]);

visualStories.forEach((story) => {
  test(story.id, async ({
    page,
  }, meta) => {
    await navigate(page, meta.title);

    const elem = await page.getByTestId(componentsConfig.testid);
    const clip = (await elem.boundingBox()) || undefined;
    const fileName = [
      componentsConfig.vrtSnapshotFolder,
      meta.title,
      `${meta.project.name}.png`,
    ];

    await expect(page)
      .toHaveScreenshot(fileName, {
        animations: 'disabled',
        caret: 'hide',
        clip,

        // if true, firefox screenshots will fail... /)
        // omitBackground: true,
      });
  });
});
