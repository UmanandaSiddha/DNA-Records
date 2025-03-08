import { useState, useEffect } from "react";
import { signInUser } from "../services/user.services";
import { userExist } from "../redux/reducer/user.reducer";
import { useDispatch } from "react-redux";

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

export default function HiveAuth() {
    const [username, setUsername] = useState<string>(window.localStorage.getItem("hive_user") || "");
    const [message, setMessage] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [keychainAvailable, setKeychainAvailable] = useState<boolean>(false);
    const [downloadLink, setDownloadLink] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        setDownloadLink(getKeychainDownloadLink());
    }, []);

    // Retry detecting Hive Keychain
    useEffect(() => {
        const checkKeychain = () => {
            if (typeof window !== "undefined" && window.hive_keychain) {
                setKeychainAvailable(true);
            } else {
                setTimeout(checkKeychain, 1000);
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
            async (response) => {
                if (response.success) {
                    localStorage.setItem("hive_user", username);
                    const data = await signInUser(response.data.username, response.publicKey);
                    dispatch(userExist(data.user));
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