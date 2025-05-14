import type { Meta, StoryObj } from "@storybook/react";
import { Disclosure } from "../../packages/ui/src/components";

const meta = {
  title: "Components/Disclosure",
  component: Disclosure,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: {
        type: "text",
      },
    },
    children: {
      control: {
        type: "object",
      },
    },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Disclosure Title",
    children:
      "Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content Disclosure Content",
  },
};
