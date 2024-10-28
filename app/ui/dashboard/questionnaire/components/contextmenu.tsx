import { Menu, rem, UnstyledButton } from "@mantine/core"
import { IconCopyPlus, IconDots, IconExternalLink, IconEye, IconPencil, IconSettings, IconShare3, IconTrash, IconUser } from "@tabler/icons-react"
import classes from "@/app/ui/dashboard/dashboard.module.css";

export const ContextMenu = ({ id }: { id: string }) => {
    const iconStyle = { width: rem(14), height: rem(14) };
    return (
        <Menu withArrow arrowPosition="side" position="right" arrowSize={10}
            styles={{
                itemLabel: { fontSize: 'var(--mantine-font-size-xs)' }
            }}
        >
            <Menu.Target>
                <UnstyledButton>
                    <IconDots size={16} className={classes.menu_icon} />
                </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconPencil style={iconStyle} />}
                >
                    Open
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconEye style={iconStyle} />}
                >
                    Preview
                </Menu.Item>

                <Menu.Item
                    leftSection={<IconExternalLink style={iconStyle} />}
                >
                    Open test link
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconShare3 style={iconStyle} />}
                >
                    Share link
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconCopyPlus style={iconStyle} />}
                >
                    Duplicate
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconUser style={iconStyle} />}
                >
                    Assign
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconSettings style={iconStyle} />}
                >
                    Settings
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                    color="red"
                    leftSection={<IconTrash style={iconStyle} />}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
