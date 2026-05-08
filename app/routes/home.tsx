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
	return <div>Home placeholder</div>;
}
