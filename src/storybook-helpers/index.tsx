import { PartialStoryFn } from '@storybook/types';
import { ReactElement } from 'react';
import { componentsConfig } from '@/components/config';

export const defaultDecorator = (Story: PartialStoryFn): ReactElement => (
  <div
    style={{
      display: 'inline-block',
      padding: '3em',
    }}
    data-testid={componentsConfig.testid}
  >
    <Story />
  </div>
);
