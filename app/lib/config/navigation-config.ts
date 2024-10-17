import {
    IconRoute,
    IconClipboardList,
    IconDeviceDesktopAnalytics,
    IconEye,
    IconGauge,
    IconSettings,
    IconPalette
} from "@tabler/icons-react";

export const NavigationLinks = [
    { icon: IconGauge, label: "Dashboard", href: "/dashboard", index: 0 },
    { icon: IconClipboardList, label: "Questionnaire", href: "/dashboard/questionnaire", index: 1 },
    { icon: IconRoute, label: "Logic", href: "/dashboard/logic", index: 2 },
    { icon: IconPalette, label: "Design", href: "/dashboard/design", index: 3 },
    { icon: IconEye, label: "Preview", href: "/dashboard/preview", index: 4 },
    { icon: IconDeviceDesktopAnalytics, label: "Analytics", href: "/dashboard/analytics", index: 5 },
    { icon: IconSettings, label: "Settings", href: "/dashboard/settings", index: 6 }
];
