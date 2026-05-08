import WelcomeDialog from "~/components/welcome-dialog";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "PomoExchange" },
		{
			name: "description",
			content: "Focus, earn points, and redeem rewards with PomoExchange.",
		},
	];
}

export default function Home() {
	return (
		<div>
			<div>Home placeholder</div>
			<WelcomeDialog />
		</div>
	);
}
