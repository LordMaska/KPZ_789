import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
			<div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
					Комп'ютерний клуб
				</h1>
				<p className="text-gray-600 text-center mb-8">
					Система управління клієнтами, комп'ютерами та сеансами
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Clients Card */}
					<Link
						to="/clients"
						className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
					>
						<div className="flex flex-col items-center text-center">
							<svg
								className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
							<h2 className="text-2xl font-bold mb-2">Клієнти</h2>
							<p className="text-blue-100 text-sm">
								Перегляд та управління базою клієнтів
							</p>
						</div>
					</Link>

					{/* PCs Card */}
					<Link
						to="/pcs"
						className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
					>
						<div className="flex flex-col items-center text-center">
							<svg
								className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<h2 className="text-2xl font-bold mb-2">Комп'ютери</h2>
							<p className="text-purple-100 text-sm">
								Управління парком комп'ютерів
							</p>
						</div>
					</Link>

					{/* Sessions Card */}
					<Link
						to="/sessions"
						className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-white"
					>
						<div className="flex flex-col items-center text-center">
							<svg
								className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<h2 className="text-2xl font-bold mb-2">Сеанси</h2>
							<p className="text-green-100 text-sm">
								Відстеження активних та завершених сеансів
							</p>
						</div>
					</Link>
				</div>

				<div className="mt-8 text-center text-gray-500 text-sm">
					Оберіть розділ для продовження роботи
				</div>
			</div>
		</div>
	);
};
