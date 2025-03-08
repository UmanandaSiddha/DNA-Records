import { useSelector } from "react-redux";
import HiveAuth from "../components/keychain-login";
import { RootState } from "../redux/store";
import FileUpload from "../components/file-upload";
import UpdateProfile from "../components/update-profile";

const HomePage = () => {

    const { user } = useSelector(
        (state: RootState) => state.userReducer
    );

    return (
        <div>
            Home Page
            {user ? (
                <>
                    <UpdateProfile />
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