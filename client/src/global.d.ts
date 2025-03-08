export {};

declare global {
    interface Window {
        hive_keychain?: {
            // ✅ Signing messages
            requestSignBuffer: (
                username: string,
                message: string,
                keyType: "Posting" | "Active" | "Memo",
                callback: (response: {
                    success: boolean;
                    data?: {
                        username: string;
                        message?: string;
                    };
                    publicKey: string;
                    error?: string;
                }) => void
            ) => void;

            // ✅ Custom JSON Broadcast
            requestCustomJson: (
                username: string,
                id: string,
                keyType: "Posting" | "Active",
                json: string,
                displayName: string,
                callback: (response: {
                    success: boolean;
                    data?: any;
                    error?: string;
                }) => void
            ) => void;

            // ✅ Hive Token Transfer
            requestTransfer: (
                username: string,
                to: string,
                amount: string, // Example: "0.000 HIVE" or "0.000 HBD"
                memo: string,
                keyType: "Active",
                callback: (response: {
                    success: boolean;
                    data?: any;
                    error?: string;
                }) => void
            ) => void;

            // ✅ Broadcast Transaction
            requestBroadcast: (
                username: string,
                operations: any[],
                keyType: "Posting" | "Active",
                callback: (response: {
                    success: boolean;
                    data?: any;
                    error?: string;
                }) => void
            ) => void;
        };
    }
}
