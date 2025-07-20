import type { Meta, StoryObj } from "@storybook/nextjs";
import { Accordion } from "../../packages/ui/src/components/client";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: {
        type: "object",
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        title: "Accordion Item 1",
        children: "Accordion Item 1 Content",
      },
      {
        title: "Accordion Item 2",
        children: "Accordion Item 2 Content",
      },
      {
        title: "Accordion Item 3",
        children: "Accordion Item 3 Content",
      },
    ],
  },
};
