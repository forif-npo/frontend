import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";
import { Tag } from "../../packages/ui/src/components/server";

const meta = {
  title: "Components/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    onDelete: { action: "clicked" },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Primary",
    onClick: fn(),
    onDelete: fn(),
  },
};

export const Small: Story = {
  args: {
    label: "Small",
    size: "small",
    onClick: fn(),
    onDelete: fn(),
  },
};

export const Medium: Story = {
  args: {
    label: "Medium",
    size: "medium",
    onClick: fn(),
    onDelete: fn(),
  },
};

export const Large: Story = {
  args: {
    label: "Large",
    size: "large",
    onClick: fn(),
    onDelete: fn(),
  },
};

export const NoDelete: Story = {
  args: {
    label: "No Delete",
    onClick: fn(),
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    disabled: true,
    onClick: fn(),
    onDelete: fn(),
  },
};
