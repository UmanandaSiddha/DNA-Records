import { useSelector } from "react-redux";
import HiveAuth from "../components/keychain-login";
import { RootState } from "../redux/store";

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
                </>
            ) : (
                <HiveAuth />
            )}
        </div>
    )
}

export default HomePage;