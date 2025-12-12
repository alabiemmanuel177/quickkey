import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateRoomForm from "@/components/multiplayer/CreateRoomForm";
import JoinRoomForm from "@/components/multiplayer/JoinRoomForm";

export const metadata: Metadata = {
  title: "QuickKey - Multiplayer",
  description: "Challenge your friends to a typing race",
};

export default function MultiplayerPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Multiplayer</h1>
        <p className="text-muted-foreground mb-8">
          Challenge your friends to a typing race. Create a room or join an existing one.
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Race</CardTitle>
          <CardDescription>
            Create a new room or join an existing one using a room code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <CreateRoomForm />
            </TabsContent>
            
            <TabsContent value="join">
              <JoinRoomForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 