import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react";
import { ReactRenderer } from "@storybook/react";
import "../apps/web/src/app/globals.css";
const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: "",
        "high-contrast": "high-contrast",
      },
      defaultTheme: "light",
      attributeName: "data-theme",
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disabled: true,
    },
  },
};

export default preview;
