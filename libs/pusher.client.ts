"use client";

import PusherClient from "pusher-js";

type PusherClientConstructor = typeof PusherClient;
type BunPusherClientModule = {
  Pusher?: PusherClientConstructor;
};

let pusherClient: PusherClient | null = null;

function getPusherClientConstructor(): PusherClientConstructor {
  const pusherModule = PusherClient as unknown as BunPusherClientModule;

  return pusherModule.Pusher ?? PusherClient;
}

export function getPusherClient(): PusherClient {
  if (pusherClient) {
    return pusherClient;
  }

  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    throw new Error(
      "Missing NEXT_PUBLIC_PUSHER_APP_KEY or NEXT_PUBLIC_PUSHER_CLUSTER"
    );
  }

  const PusherClientConstructor = getPusherClientConstructor();
  pusherClient = new PusherClientConstructor(key, {
    channelAuthorization: {
      endpoint: "/api/pusher/auth",
      transport: "ajax",
    },
    cluster,
  });

  return pusherClient;
}
