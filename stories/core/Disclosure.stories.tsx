import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Body, Disclosure } from "../../packages/ui/src/components";

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
    children: (
      <Body className="text-text-basic">
        Disclosure Body Disclosure BodyDisclosure BodyDisclosure BodyDisclosure
        BodyDisclosure BodyDisclosure BodyDisclosure BodyDisclosure Body
      </Body>
    ),
  },
};
