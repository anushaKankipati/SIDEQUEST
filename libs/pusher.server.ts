import PusherServer from "pusher";

let pusherServer: PusherServer | null = null;

export function getPusherServer(): PusherServer {
  if (pusherServer) {
    return pusherServer;
  }

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    throw new Error("Missing required Pusher server environment variables");
  }

  pusherServer = new PusherServer({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });

  return pusherServer;
}
