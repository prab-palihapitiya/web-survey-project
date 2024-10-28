"use client";

import { Button, createTheme, Checkbox, TextInput, Select, Textarea, ActionIcon, Table, MultiSelect, Paper, NumberInput, Radio, Fieldset, ColorInput } from "@mantine/core";

export const theme = createTheme({
  components: {
    Paper: Paper.extend({
      styles: {
        root: {
          // borderRadius: 0,
        }
      }
    }),
    Fieldset: Fieldset.extend({
      styles: {
        legend: {
          fontSize: 'var(--mantine-font-size-xs)',
          fontWeight: 500,
        },
        root: {
          // borderRadius: 0,
        }
      }
    }),
    Button: Button.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        root: {
          // borderRadius: 0,
          fontWeight: 500
        },
        inner: { fontWeight: 500 }
      }
    }),
    ActionIcon: ActionIcon.extend({
      styles: {
        root: {
          // borderRadius: 0,
        }
      }
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          cursor: "pointer",
          // borderRadius: 0
        },
        label: { cursor: "pointer" }
      }
    }),
    Radio: Radio.extend({
      defaultProps: {
        size: "xs",
      }
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0
        },
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0
        },
      },
    }),
    ColorInput: ColorInput.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0
        },
      },
    }),

    Textarea: Textarea.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0
        },
        dropdown: {
          // borderRadius: 0
        },
        option: {
          // borderRadius: 0
        }
      },
    }),
    Table: Table.extend({
      styles: {
        table: { borderCollapse: "collapse", fontSize: 'var(--mantine-font-size-xs)' },
        th: { fontWeight: 500 },
        td: {
          paddingBlock: 5
        }
      }
    }),
    FileInput: {
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0,
        }
      }
    },
    MultiSelect: {
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderRadius: 0,
        }
      }

    }
  },
});
