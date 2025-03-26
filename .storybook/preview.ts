import type { Preview } from '@storybook/react';
import '@/styles/_global.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?<temp1>background|color)$/iu,
        date: /Date$/iu,
      },
    },
  },
};

export default preview;
