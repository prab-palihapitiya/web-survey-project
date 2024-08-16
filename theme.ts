"use client";

import { Button, createTheme, Checkbox } from "@mantine/core";

export const theme = createTheme({
  components: {
    Button: Button.extend({
      styles: {
        inner: { fontWeight: 500 }
      }
    }),
    Checkbox: Checkbox.extend({
      styles: {
        input: { cursor: "pointer" },
        label: { cursor: "pointer" }
      }
    })
  },
});
