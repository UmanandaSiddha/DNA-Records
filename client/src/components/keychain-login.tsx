import { useState, useEffect } from "react";

declare global {
    interface Window {
        hive_keychain?: {
            requestSignBuffer: (
                username: string,
                message: string,
                keyType: "Posting" | "Active" | "Memo",
                callback: (response: { success: boolean; error?: string }) => void
            ) => void;
        };
    }
}

// --------------- YOUR ACCOUNT -------------
// Username: shivaji2428
// Password: uEvDAhzzaTUmNopgTR4QuEvjMovWYfpg

// ------------------------ PRIVATE KEYS ----------------------
// Owner:   5HszwAQbv7KrR3QQAkDSX1DjTxwx3Q7tmiPCXLZcRsxFBWJRDRm
// Active:  5JRive5QAps8FBHrKuyf8hsvVbRVGdcZM1rYDEYRvWcba2cZSKN
// Posting: 5KCbFaTECFJZ884sgKguAeiX1etL5SL3LcmZ2hzqtarpGgj2Lso
// Memo:    5JoMtaby6QkPw7rSMt657z4ZXwBnzH8bMgdaZvRBkew943Rr1zS

// -------------------------- KEY DESCRIPTION -----------------------
// Owner:   Change Password, Change Keys, Recover Account
// Active:  Transfer Funds, Power up/down, Voting Witnesses/Proposals
// Posting: Post, Comment, Vote, Reblog, Follow, Profile
// Memo:    Send/View encrypted messages on transfers

// ---------------------- WHERE TO USE YOUR KEYS --------------------
// Hive Keychain and Hive Signer should allow you to do transactions
// on all Hive sites and applications.

// PeakD.com allows your own browser to store Posting key via
// "PeakLock" login method (an alternative for mobile).

// Be very careful directly using your keys on any other website or application.

// --------------- YOUR ACCOUNT -------------
// Username: shivaji9407
// Password: 6LBfJtUrT5Yw9mWTHnmoERweS2B2pTWK

// ------------------------ PRIVATE KEYS ----------------------
// Owner:   5JpUFbxqnJgd9hb2RVeVruGQDexWmGyxdM96h15NiuBJAQzLVfY
// Active:  5KFLvYAhHRC2PmNGbdaAR1XwJGoHjqfUxVQLaWREtKMiVLcqf4o
// Posting: 5KgQHNMgk3HviNFYshrGcywXRYeMXfYQYsn527RzwjwmYxLyoFR
// Memo:    5JpdYbAsDJurSaGkBHkNwnskiHVH6S53zKtozLb4SxDdof7C8rY

// -------------------------- KEY DESCRIPTION -----------------------
// Owner:   Change Password, Change Keys, Recover Account
// Active:  Transfer Funds, Power up/down, Voting Witnesses/Proposals
// Posting: Post, Comment, Vote, Reblog, Follow, Profile
// Memo:    Send/View encrypted messages on transfers

// ---------------------- WHERE TO USE YOUR KEYS --------------------
// Hive Keychain and Hive Signer should allow you to do transactions
// on all Hive sites and applications.

// PeakD.com allows your own browser to store Posting key via
// "PeakLock" login method (an alternative for mobile).

// Be very careful directly using your keys on any other website or application.

const getKeychainDownloadLink = (): string => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("chrome") || userAgent.includes("brave")) {
        return "https://chromewebstore.google.com/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep?hl=en";
    }
    if (userAgent.includes("firefox")) {
        return "https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/";
    }
    if (userAgent.includes("android")) {
        return "https://play.google.com/store/apps/details?id=com.mobilekeychain&pli=1";
    }
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
        return "https://apps.apple.com/us/app/hive-keychain/id1552190010";
    }
    return "https://hive-keychain.com/";
};

// {
//     "username": "siddha2428"
//     "password": "a201aa0e8065855e5a08d18d649cb3e0",
//     "owner": "5JAoohXkWEVkpMMepgfxKcDTF8rEeGxWUct2vKpvSSCSqihJuXd",
//     "active": "5J5k1yC7yisU3oeUaAja9gUirMv5ExeQB97Q8BzbHMiTyXYS2LQ",
//     "posting": "5KcM1dvMRpJUr1dcFwQk3xw82yibUDD338LkQ4Le8Rheu94jvVC",
//     "memo": "5JjKmtPVPS1Zb3wsXyCWgrwaCBCZgMDqdSBfRg36eips25qDev4"
// }

export default function HiveAuth() {
    const [username, setUsername] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [keychainAvailable, setKeychainAvailable] = useState<boolean>(false);
    const [downloadLink, setDownloadLink] = useState<string>("");

    useEffect(() => {
        setDownloadLink(getKeychainDownloadLink());
    }, []);

    // Retry detecting Hive Keychain
    useEffect(() => {
        const checkKeychain = () => {
            if (typeof window !== "undefined" && window.hive_keychain) {
                setKeychainAvailable(true);
            } else {
                setTimeout(checkKeychain, 1000); // Retry after 1 second
            }
        };
        checkKeychain();
    }, []);

    const loginWithHive = (): void => {
        if (!window.hive_keychain) {
            setMessage("Hive Keychain is not installed!");
            return;
        }

        const challenge = `Login to DNA dApp at ${new Date().toISOString()}`;

        window.hive_keychain.requestSignBuffer(
            username,
            challenge,
            "Posting",
            (response) => {
                console.log(response)
                if (response.success) {
                    localStorage.setItem("hive_user", username);
                    setMessage("Login Successful!");
                    setLoggedIn(true);
                } else {
                    setMessage("Login Failed!");
                }
            }
        );
    };

    const logout = (): void => {
        localStorage.removeItem("hive_user");
        setLoggedIn(false);
        setMessage("Logged out!");
    };

    return (
        <div>
            <h2>Hive Authentication</h2>

            {!keychainAvailable && (
                <p>
                    <strong>Hive Keychain is not installed.</strong>{" "}
                    {/* <a href="https://hive-keychain.com/" target="_blank" rel="noopener noreferrer">
                        Download Hive Keychain
                    </a> */}
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer">
                        Download Hive Keychain
                    </a>
                </p>
            )}

            <input
                type="text"
                placeholder="Hive Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={loginWithHive} disabled={!keychainAvailable}>
                Login with Hive
            </button>

            {loggedIn && <button onClick={logout}>Logout</button>}

            <p>{message}</p>

            <p>
                Don't have a Hive account?{" "}
                <a href="https://hiveonboard.com/" target="_blank" rel="noopener noreferrer">
                    Create an Account
                </a>
            </p>
        </div>
    );
}