import { useSelector } from "react-redux";
import HiveAuth from "../components/keychain-login";
import { RootState } from "../redux/store";
import FileUpload from "../components/file-upload";

const HomePage = () => {

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    return (
        <div>
            Home Page
            {user ? (
                <>
                    <p>Welcome {user.hiveUser}</p>
                    {!user?.firstName && (
                        <input type="text" />
                    )}
                    {user.dnaFile ? (
                        <p>file: {user.dnaFile}</p>
                    ) : (
                        <FileUpload />
                    )}
                </>
            ) : (
                <HiveAuth />
            )}
        </div>
    )
}

export default HomePage;