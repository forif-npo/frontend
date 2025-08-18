import type { Meta, StoryObj } from "@storybook/nextjs";
import { Checkbox } from "../../packages/ui/src/components/client";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultChecked: { control: { type: "boolean" } },
    indeterminate: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
    size: { control: { type: "select", options: ["md", "lg"] } },
    onChange: { action: "changed" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: { defaultChecked: true, label: "CheckBox", id: "cb-1" },
};

export const Unchecked: Story = {
  args: { defaultChecked: false, label: "CheckBox", id: "cb-2" },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "CheckBox", id: "cb-3" },
};

export const Disabled: Story = {
  args: { defaultChecked: true, label: "CheckBox", disabled: true, id: "cb-4" },
};

export const DisabledUnchecked: Story = {
  args: {
    defaultChecked: false,
    label: "CheckBox",
    disabled: true,
    id: "cb-5",
  },
};

export const DisabledIndeterminate: Story = {
  args: { indeterminate: true, label: "CheckBox", disabled: true, id: "cb-6" },
};

export const NoLabel: Story = { args: { defaultChecked: true, id: "cb-7" } };

export const NoLabelDisabled: Story = {
  args: { defaultChecked: true, disabled: true, id: "cb-8" },
};

export const MediumCheckbox: Story = {
  args: { defaultChecked: true, label: "CheckBox", size: "md", id: "cb-10" },
};

export const LargeCheckbox: Story = {
  args: { defaultChecked: true, label: "CheckBox", size: "lg", id: "cb-11" },
};
