import type {
  Meta,
  StoryObj,
} from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';

const meta = {
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
  args: {
    onClick: fn(),
  },
  component: Button,
  parameters: {/* layout: 'centered', */},
  tags: ['autodocs'],
  title: 'Components/Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Large: Story = {
  args: {
    label: 'Button',
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    label: 'Button',
    size: 'small',
  },
};
