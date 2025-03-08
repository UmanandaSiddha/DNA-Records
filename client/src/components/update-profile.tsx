import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import API from "../config/apiConfig";
import { userExist } from "../redux/reducer/user.reducer";

const UpdateProfile = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put("/user/update-profile", {
                firstName,
                lastName,
                email,
            });
            dispatch(userExist(data.user));
        } catch (error) {
            console.error("Profile update error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-profile-container">
            <h2>Update Profile</h2>
            <p>Welcome, {user?.hiveUser || user?._id}</p>

            <form onSubmit={handleUpdate}>
                <input 
                    type="text" 
                    placeholder="Enter First Name" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Enter Last Name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Enter Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;