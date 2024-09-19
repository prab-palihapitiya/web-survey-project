import { Button, createTheme } from "@mantine/core";

export const getStyle = (color: string) => {
    return createTheme({
        primaryColor: color,
        fontFamily: 'Arial, sans-serif',
        components: {
            Button: Button.extend({
                styles: (theme) => ({
                    root: {
                        borderRadius: theme.radius.sm,
                    },
                }),
                defaultProps: {
                    color: color,
                    variant: 'outline',
                    size: 'sm',
                },
            }),
        }
    });
}
