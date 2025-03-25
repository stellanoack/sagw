import {
  expect,
  Page,
  test,
} from '@playwright/test';

import type { IndexEntry } from '@storybook/types';
import manifest from '../../storybook-static/index.json' with { type: 'json' };
import { componentsConfig } from './config';

const getStoryUrl = (id: string): string => {
  const params = new URLSearchParams({
    id,
    nav: '0',
    viewMode: 'story',
  });

  return `${componentsConfig.vrtBaseUrl}?${params.toString()}`;
};

const filterStories = (stories: IndexEntry[]): IndexEntry[] => stories.filter((story) => {
  const hasVisualCheck = story?.tags?.includes('visual:check');
  const isDocs = story.type === 'docs';

  return hasVisualCheck && !isDocs;
});

const navigate = async (
  page: Page,
  id: string,
): Promise<void> => {
  try {
    const url = getStoryUrl(id);

    await page.goto(url);

    // TODO: why not working?
    // await page.waitForLoadState('networkidle');
    await page.waitForSelector(`#${componentsConfig.storybookRootDivId}`);
  } catch (error) {
    console.log('error, navigating to storybook page:');
    console.log(error);
  }
};

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
