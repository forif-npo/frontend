import { Button } from "@repo/ui/components/client";
import { Badge } from "@repo/ui/components/server";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Badge variant="warning" label="하이" />
      <Button variant="primary">하이</Button>
      <Button variant="secondary">하이</Button>
      <Button variant="tertiary">하이</Button>
      <Button variant="text">하이</Button>
      <div className="flex-col gap-2"></div>
    </div>
  );
}
