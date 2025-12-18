import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <Container className="py-8">
      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Requests</CardTitle>
        </CardHeader>
        <CardContent>UI shu yerdan boshlanadi.</CardContent>
      </Card>
    </Container>
  );
}
