import { Button, Container } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return <main>
    <Container>
      <h1>Home</h1>
      <p>Welcome to the home page</p>
      <Link href={'/dashboard'}>
        <Button color="blue">Get Started <IconArrowRight size={16} /></Button>
      </Link>
    </Container>
  </main>;
}
