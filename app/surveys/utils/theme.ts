import { Button, Checkbox, createTheme, NumberInput, Progress, Radio, Textarea, TextInput } from "@mantine/core";

export const getStyle = () => {
    return createTheme({
        // primaryColor: color,
        fontFamily: 'Arial, sans-serif',
        components: {
            Button: Button.extend({
                styles: (theme) => ({
                    root: {
                        borderRadius: theme.radius.sm,
                    },
                }),
                defaultProps: {
                    // color: color,
                    variant: 'outline',
                    size: 'sm',
                },
            }),
            Radio: Radio.extend({
                styles: (theme) => ({
                    label: {
                        fontSize: theme.fontSizes.sm,
                    },
                }),
                defaultProps: {
                    size: 'sm',
                },
            }),
            Checkbox: Checkbox.extend({
                styles: (theme) => ({
                    label: {
                        fontSize: theme.fontSizes.sm,
                    },
                }),
                defaultProps: {
                    size: 'sm',
                },
            }),
            TextInput: TextInput.extend({
                styles: (theme) => ({
                    input: {
                        borderRadius: theme.radius.sm,
                    },
                }),
                defaultProps: {
                    size: 'sm',
                    variant: 'default',
                },
            }),
            Textarea: Textarea.extend({
                styles: (theme) => ({
                    input: {
                        borderRadius: theme.radius.sm,
                    },
                }),
                defaultProps: {
                    size: 'sm',
                    variant: 'default',
                },
            }),
            NumberInput: NumberInput.extend({
                styles: (theme) => ({
                    input: {
                        borderRadius: theme.radius.sm,
                    },
                }),
                defaultProps: {
                    size: 'sm',
                    variant: 'default',
                },
            }),
            Progress: Progress.extend({
                defaultProps: {
                    // color: color,
                    mt: 'md',
                    radius: 'xs',
                    size: 'lg',
                    animated: true,
                }
            })
        }
    });
}
