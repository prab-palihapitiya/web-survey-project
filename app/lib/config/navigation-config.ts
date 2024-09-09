import {
    IconRoute,
    IconClipboardList,
    IconDeviceDesktopAnalytics,
    IconEye,
    IconGauge,
    IconSettings,
} from "@tabler/icons-react";

export const NavigationLinks = [
    { icon: IconGauge, label: "Dashboard", href: "/dashboard", index: 0 },
    { icon: IconClipboardList, label: "Questionnaire", href: "/dashboard/questionnaire", index: 1 },
    { icon: IconRoute, label: "Logic", href: "/dashboard/logic", index: 2 },
    { icon: IconEye, label: "Preview", href: "/dashboard/preview", index: 3 },
    { icon: IconDeviceDesktopAnalytics, label: "Analytics", href: "/dashboard/analytics", index: 4 },
    { icon: IconSettings, label: "Settings", href: "/dashboard/settings", index: 5 }
];
