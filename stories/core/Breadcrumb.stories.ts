import type { Meta, StoryObj } from "@storybook/nextjs";
import { Breadcrumb } from "../../packages/ui/src/components/server";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "홈", onClick: () => console.log("홈") },
      { label: "문서", onClick: () => console.log("문서") },
      { label: "서적", onClick: () => console.log("서적") },
      {
        label: "Effective Typescript",
        onClick: () => console.log("Effective Typescript"),
      },
    ],
  },
};

export const MaxItems: Story = {
  args: {
    items: [
      { label: "홈", onClick: () => console.log("홈") },
      { label: "문서", onClick: () => console.log("문서") },
      { label: "서적", onClick: () => console.log("서적") },
      {
        label: "Effective Typescript",
        onClick: () => console.log("Effective Typescript"),
      },
    ],
    maxLength: 2,
  },
};

export const WithoutEllipsis: Story = {
  args: {
    items: [
      { label: "홈", onClick: () => console.log("홈") },
      { label: "문서", onClick: () => console.log("문서") },
      { label: "서적", onClick: () => console.log("서적") },
      {
        label: "Effective Typescript",
        onClick: () => console.log("Effective Typescript"),
      },
    ],
    maxLength: 5,
  },
};

export const maxLengthIsLessThan2: Story = {
  args: {
    items: [
      { label: "홈", onClick: () => console.log("홈") },
      { label: "문서", onClick: () => console.log("문서") },
      { label: "서적", onClick: () => console.log("서적") },
      {
        label: "Effective Typescript",
        onClick: () => console.log("Effective Typescript"),
      },
    ],
    maxLength: 1,
  },
};
