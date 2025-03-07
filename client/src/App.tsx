import { Route, Routes } from "react-router-dom"
import ErrorBoundary from "./components/error-boundary"
import HomePage from "./pages/home"
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/user.reducer";
import { userProfile } from "./services/user.services";
import { RootState } from "./redux/store";
import { useEffect } from "react";
import NotFound from "./pages/not-found";

const App = () => {

	const dispatch = useDispatch();

	// const { user, loading } = useSelector(
	// 	(state: RootState) => state.userReducer
	// );

	const fetchUser = async () => {
		try {
			const data = await userProfile();
			dispatch(userExist(data.user));
		} catch (error: any) {
			dispatch(userNotExist());
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	return (
		<ErrorBoundary>
			<Routes>
				<Route path="/" element={<HomePage />} />

				{/* <Route path="/login" element={user === null ? <Login /> : <Navigate to={user?.account.isVerified ? "/profile" : "/verify"} />} /> */}

				{/* <Route
					element={loading ? (
						<Loader />
					) : (
						<ProtectedRoute isAuthenticated={!!user} redirect="/login" />
					)}
				>
					<Route path="/view-custom" element={<ViewCustom />} />
				</Route> */}

				<Route path="*" element={<NotFound />} />
			</Routes>
		</ErrorBoundary>
	)
}

export default App