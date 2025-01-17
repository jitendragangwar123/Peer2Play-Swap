import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { hederaTestnet,sepolia, mainnet } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID not defined!");

const metadata = {
    name: "P2P swap",
    description: "P2P swap built with love",
    url: "",
    icons: ["https://avatars.githubusercontent.com/u/37784886"]
}

const chains = [hederaTestnet,sepolia, mainnet] as const;

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    auth: {
        email: true,
        socials: ["google", "x", "github", "discord", "apple"],
        showWallets: true,
        walletFeatures: true
    },
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    }),
})