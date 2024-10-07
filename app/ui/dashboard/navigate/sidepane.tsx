"use client";

import { useState } from "react";
import classes from "@/app/ui/dashboard/navigate/sidepane.module.css";
import { Avatar, Center, Stack, Tooltip, UnstyledButton, rem, Text } from "@mantine/core";
import {
  IconLogout,
  IconUser
} from "@tabler/icons-react";
import Link from "next/link";
import useQuestionnaireStore from "@/app/lib/state/questionnaire-store";
import { NavigationLinks } from "@/app/lib/config/navigation-config";
import { NavbarLinkProps } from "@/app/lib/types";

function NavbarLink({ icon: Icon, label, active, navigate, onClick }: NavbarLinkProps) {
  const questionnaireId = useQuestionnaireStore((state) => state.id);
  if (questionnaireId !== "") {
    navigate = `${navigate}?id=${questionnaireId}`;
  } else {
    navigate = `${navigate}`;
  }

  return (
    <Tooltip
      color="blue"
      label={<Text size="xs">{label}</Text>}
      position="right"
      transitionProps={{ duration: 0 }}
      withArrow
      style={{ boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)' }}
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

export default function SidePane() {
  const [active, setActive] = useState<number>(0);

  const handleClick = (index: number) => {
    setActive(index);
  }

  const links = NavigationLinks.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      navigate={link.href}
      onClick={() => handleClick(link.index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center><Link href={'/'}><Avatar src="/sr2.png" alt="surveyranch home" size={'lg'} /></Link></Center>

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
