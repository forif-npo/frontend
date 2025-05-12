import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../../packages/ui/src/components";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: {
        type: "select",
        options: ["primary", "success", "warning", "error"],
      },
    },
    size: {
      control: {
        type: "select",
        options: ["medium", "large"],
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "primary",
    variant: "primary",
  },
};

export const Success: Story = {
  args: {
    label: "success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    label: "warning",
    variant: "warning",
  },
};

export const Error: Story = {
  args: {
    label: "danger",
    variant: "danger",
  },
};

export const Medium: Story = {
  args: {
    label: "medium",
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    label: "large",
    size: "large",
  },
};

export const Fill: Story = {
  args: {
    label: "fill",
    appearance: "fill",
  },
};

export const Outline: Story = {
  args: {
    label: "outline",
    appearance: "outline",
  },
};

export const SolidPastel: Story = {
  args: {
    label: "solid-pastel",
    appearance: "solid-pastel",
  },
};
