"use client";

import { Button, createTheme, Checkbox, TextInput, Select, Textarea, ActionIcon, Table, MultiSelect, Paper, NumberInput, Radio } from "@mantine/core";

export const theme = createTheme({
  components: {
    Paper: Paper.extend({
      styles: {
        root: {
          borderRadius: 0,
        }
      }
    }),
    Button: Button.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        root: {
          borderRadius: 0,
          // borderWidth: 2,
          fontWeight: 500
        },
        inner: { fontWeight: 500 }
      }
    }),
    ActionIcon: ActionIcon.extend({
      // defaultProps: {
      //   size: "xs",
      // },
      styles: {
        root: {
          borderRadius: 0,
          // borderWidth: 2,
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
          // borderWidth: 2,
          borderRadius: 0
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
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        },
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        },
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        },
        dropdown: {
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        },
        option: {
          // borderColor: "grey",
          // borderWidth: 2,
          borderRadius: 0
        }
      },
    }),
    Table: Table.extend({
      styles: {
        table: { borderCollapse: "collapse", borderColor: "#228be6", fontSize: 'var(--mantine-font-size-xs)' },
        thead: { backgroundColor: "#228be6", color: "white" },
        th: { fontWeight: 500, borderColor: "#228be6" },
        td: { borderColor: "#228be6", paddingBlock: 0 },
        tr: { borderColor: "#228be6" },
      }
    }),
    FileInput: {
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderWidth: 2,
          borderRadius: 0,
        }
      }
    },
    MultiSelect: {
      defaultProps: {
        size: "xs",
      },
      styles: {
        input: {
          // borderWidth: 2,
          borderRadius: 0,
        }
      }

    }
  },
});
