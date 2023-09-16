// custom.d.ts
import { JsonRpcProvider } from "@ethersproject/providers";

declare global {
    interface Window {
        ethereum?: {
            isMetaMask?: boolean;
            request?: (args: { method: string; params?: any[] }) => Promise<any>;
            on?: (eventName: string, callback: () => void) => void;
            removeListener?: (eventName: string, callback: () => void) => void;
            // Add other properties/methods as needed
        };
    }
}

export { };