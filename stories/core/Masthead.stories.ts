import type { Meta, StoryObj } from "@storybook/react";
import { Masthead } from "../../packages/ui/src/components";

const meta = {
  title: "Components/Masthead",
  component: Masthead,
  tags: ["autodocs"],
} satisfies Meta<typeof Masthead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
