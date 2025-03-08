export {};

declare global {
    interface Window {
        hive_keychain?: {
            requestSignBuffer: (
                username: string,
                message: string,
                keyType: "Posting" | "Active" | "Memo",
                callback: (response: {
                    success: boolean;
                    data: {
                        username: string;
                    };
                    publicKey: string;
                    error?: string;
                }) => void
            ) => void;

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
        };
    }
}
