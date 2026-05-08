import { Navigate } from "react-router";
import { useAppState } from "../state/provider";

export default function Timer() {
	const state = useAppState();

	if (!state.isSessionActive || !state.sessionStartTime) {
		return <Navigate to="/" replace />;
	}

	return <div>Timer placeholder</div>;
}
