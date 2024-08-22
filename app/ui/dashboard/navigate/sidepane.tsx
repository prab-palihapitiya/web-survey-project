"use client";

import classes from "@/app/ui/dashboard/navigate/sidepane.module.css";
import { use, useEffect, useState } from "react";

import { Center, Stack, Tooltip, UnstyledButton, rem } from "@mantine/core";
import {
  IconBinaryTree,
  IconDeviceDesktopAnalytics,
  IconEye,
  IconFilePencil,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  navigate?: string;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, navigate, onClick }: NavbarLinkProps) {
  const questionnaireId = useQuestionnaireStore((state) => state.id);
  if (questionnaireId !== "") {
    navigate = `${navigate}?id=${questionnaireId}`;
  } else {
    navigate = `${navigate}`;
  }

  return (
    <Tooltip
      label={label}
      position="right"
      transitionProps={{ duration: 0 }}
    >
      <Link href={`${navigate}`}>
        <UnstyledButton
          onClick={onClick}
          className={classes.link}
          data-active={active || undefined}
        >
          <Icon
            style={{ width: rem(20), height: rem(20) }}
            stroke={1.5}
          />
        </UnstyledButton>
      </Link>

    </Tooltip>
  );
}

const mockdata = [
  { icon: IconGauge, label: "Dashboard", href: "/dashboard" },
  { icon: IconFilePencil, label: "Questionnaire", href: "/dashboard/questionnaire" },
  { icon: IconBinaryTree, label: "Logic", href: "/dashboard/logic" },
  { icon: IconEye, label: "Preview", href: "/dashboard/preview" },
  { icon: IconDeviceDesktopAnalytics, label: "Analytics", href: "/dashboard/analytics" },
  { icon: IconSettings, label: "Settings", href: "/dashboard/settings" }
];

export default function SidePane() {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      navigate={link.href}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      {/* <Center>{<MantineLogo type="mark" inverted size={30} />}</Center> */}

      <div className={classes.navbarMain}>
        <Stack
          justify="center"
          gap={0}
        >
          {links}
        </Stack>
      </div>

      <Stack
        justify="center"
        gap={0}
      >
        <NavbarLink
          icon={IconUser}
          label="Account"
        />
        <NavbarLink
          icon={IconLogout}
          label="Logout"
        />
      </Stack>
    </nav>
  );
}
