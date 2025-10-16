"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowUpDown,
	Star,
	Search,
	TrendingUp,
	Sun,
	Moon,
	Palette,
	RotateCcw,
	Heart,
} from "lucide-react";
import { useCurrencyConverter } from "@/hooks/use-currency-converter";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import {
	getCurrencyByCode,
	searchCurrencies,
	currencies,
} from "@/data/currencies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Theme } from "@/types/currency";

export function CurrencyConverter() {
	const {
		amount,
		setAmount,
		fromCurrency,
		setFromCurrency,
		toCurrency,
		setToCurrency,
		convertedAmount,
		isLoading,
		error,
		historicalRates,
		favorites,
		theme,
		setTheme,
		swapCurrencies,
		addToFavorites,
		removeFromFavorites,
		selectFavoriteConversion,
	} = useCurrencyConverter();

	const [searchQuery, setSearchQuery] = useState("");
	const [showFromDropdown, setShowFromDropdown] = useState(false);
	const [showToDropdown, setShowToDropdown] = useState(false);

	// Keyboard shortcuts
	useKeyboardShortcuts([
		{
			key: "Escape",
			action: () => {
				setShowFromDropdown(false);
				setShowToDropdown(false);
				setSearchQuery("");
			},
		},
	]);

	const fromCurrencyData = getCurrencyByCode(fromCurrency);
	const toCurrencyData = getCurrencyByCode(toCurrency);

	const isFavorite = favorites.some(
		(fav) => fav.from === fromCurrency && fav.to === toCurrency
	);

	const getThemeClasses = () => {
		switch (theme) {
			case "dark":
				return {
					bg: "bg-gray-900",
					card: "bg-gray-800/50 backdrop-blur-xl border-gray-700",
					input:
						"bg-gray-700/50 border-gray-600 text-white placeholder-gray-400",
					select: "bg-gray-700/50 border-gray-600 text-white",
					text: "text-white",
					subtext: "text-gray-300",
					accent: "bg-blue-600",
					hover: "hover:bg-gray-700",
				};
			case "blue":
				return {
					bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
					card: "bg-white/60 backdrop-blur-xl border-blue-200 shadow-blue-100",
					input:
						"bg-blue-50/50 border-blue-200 text-blue-900 placeholder-blue-400",
					select: "bg-blue-50/50 border-blue-200 text-blue-900",
					text: "text-blue-900",
					subtext: "text-blue-700",
					accent: "bg-blue-600",
					hover: "hover:bg-blue-100",
				};
			default:
				return {
					bg: "bg-gradient-to-br from-gray-50 to-gray-100",
					card: "bg-white/60 backdrop-blur-xl border-gray-200 shadow-gray-100",
					input:
						"bg-gray-50/50 border-gray-200 text-gray-900 placeholder-gray-500",
					select: "bg-gray-50/50 border-gray-200 text-gray-900",
					text: "text-gray-900",
					subtext: "text-gray-600",
					accent: "bg-gray-900",
					hover: "hover:bg-gray-100",
				};
		}
	};

	const themeClasses = getThemeClasses();

	const CurrencySelect = ({
		value,
		onChange,
		isOpen,
		onOpenChange,
	}: {
		value: string;
		onChange: (value: string) => void;
		isOpen: boolean;
		onOpenChange: (open: boolean) => void;
	}) => {
		const currency = getCurrencyByCode(value);

		return (
			<div className="relative">
				<Button
					variant="outline"
					onClick={() => onOpenChange(!isOpen)}
					className={`w-full justify-between ${themeClasses.input} ${themeClasses.hover} transition-all duration-200`}
				>
					<div className="flex items-center gap-2">
						<span className="text-xl">{currency?.flag}</span>
						<div className="text-left">
							<div className={`font-semibold ${themeClasses.text}`}>
								{value}
							</div>
							<div className={`text-xs ${themeClasses.subtext}`}>
								{currency?.name}
							</div>
						</div>
					</div>
					<Search className="w-4 h-4" />
				</Button>

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className={`absolute top-full left-0 right-0 z-[9999] mt-2 ${themeClasses.card} rounded-2xl border shadow-2xl overflow-hidden`}
						>
							<div className="p-3">
								<Input
									ref={(input) => {
										if (input && isOpen) {
											setTimeout(() => input.focus(), 100);
										}
									}}
									placeholder="Search currency..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className={`${themeClasses.input} ${themeClasses.hover}`}
								/>
							</div>
							<ScrollArea className="h-64">
								<div className="p-2">
									{searchQuery
										? searchCurrencies(searchQuery)
												.slice(0, 20)
												.map((currency) => (
													<Button
														key={currency.code}
														variant="ghost"
														onClick={() => {
															onChange(currency.code);
															onOpenChange(false);
															setSearchQuery("");
														}}
														className={`w-full justify-start ${themeClasses.hover} transition-all duration-200`}
													>
														<span className="text-xl mr-3">
															{currency.flag}
														</span>
														<div className="text-left">
															<div
																className={`font-semibold ${themeClasses.text}`}
															>
																{currency.code}
															</div>
															<div
																className={`text-xs ${themeClasses.subtext}`}
															>
																{currency.name}
															</div>
														</div>
													</Button>
												))
										: currencies.slice(0, 20).map((currency) => (
												<Button
													key={currency.code}
													variant="ghost"
													onClick={() => {
														onChange(currency.code);
														onOpenChange(false);
														setSearchQuery("");
													}}
													className={`w-full justify-start ${themeClasses.hover} transition-all duration-200`}
												>
													<span className="text-xl mr-3">{currency.flag}</span>
													<div className="text-left">
														<div
															className={`font-semibold ${themeClasses.text}`}
														>
															{currency.code}
														</div>
														<div className={`text-xs ${themeClasses.subtext}`}>
															{currency.name}
														</div>
													</div>
												</Button>
										  ))}
								</div>
							</ScrollArea>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		);
	};

	return (
		<main
			className={`min-h-screen ${themeClasses.bg} transition-all duration-500`}
			role="main"
		>
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<h1
						className={`text-4xl font-bold mb-2 ${themeClasses.text}`}
						role="heading"
						aria-level={1}
					>
						Currency Converter
					</h1>
					<p className={`${themeClasses.subtext}`} role="doc-subtitle">
						Real-time exchange rates
					</p>

					{/* Theme Toggle */}
					<div className="flex justify-center gap-2 mt-4">
						<Button
							variant={theme === "light" ? "default" : "outline"}
							size="sm"
							onClick={() => setTheme("light")}
							className={
								theme === "light" ? themeClasses.accent : themeClasses.hover
							}
							title="Press 1"
						>
							<Sun className="w-4 h-4 mr-1" />
							Light
						</Button>
						<Button
							variant={theme === "dark" ? "default" : "outline"}
							size="sm"
							onClick={() => setTheme("dark")}
							className={
								theme === "dark" ? themeClasses.accent : themeClasses.hover
							}
							title="Press 2"
						>
							<Moon className="w-4 h-4 mr-1" />
							Dark
						</Button>
						<Button
							variant={theme === "blue" ? "default" : "outline"}
							size="sm"
							onClick={() => setTheme("blue")}
							className={
								theme === "blue" ? themeClasses.accent : themeClasses.hover
							}
							title="Press 3"
						>
							<Palette className="w-4 h-4 mr-1" />
							Blue
						</Button>
					</div>
				</motion.div>

				{/* Main Converter Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1 }}
				>
					<Card className={`${themeClasses.card} rounded-3xl p-8 shadow-2xl`}>
						<CardContent className="space-y-6">
							{/* Amount Input */}
							<div className="space-y-2">
								<label
									htmlFor="amount-input"
									className={`text-sm font-medium ${themeClasses.subtext}`}
								>
									Amount
								</label>
								<Input
									id="amount-input"
									type="number"
									inputMode="decimal"
									pattern="[0-9]*"
									value={amount}
									onChange={(e) => {
										const value = e.target.value;
										// Only allow numbers and decimal point
										if (value === "" || /^\d*\.?\d*$/.test(value)) {
											setAmount(value);
										}
									}}
									placeholder="Enter amount"
									className={`text-2xl font-bold ${themeClasses.input} ${themeClasses.hover} transition-all duration-200`}
									aria-label="Enter amount to convert"
									aria-describedby="amount-description"
								/>
								<p
									id="amount-description"
									className={`text-xs ${themeClasses.subtext} sr-only`}
								>
									Enter the amount you want to convert from the selected
									currency
								</p>
							</div>

							{/* Currency Selection */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
								<div className="space-y-2">
									<label
										className={`text-sm font-medium ${themeClasses.subtext}`}
									>
										From
									</label>
									<CurrencySelect
										value={fromCurrency}
										onChange={setFromCurrency}
										isOpen={showFromDropdown}
										onOpenChange={setShowFromDropdown}
									/>
								</div>

								<div className="flex justify-center">
									<Button
										onClick={swapCurrencies}
										variant="outline"
										size="icon"
										className={`${themeClasses.hover} transition-all duration-200 hover:scale-110`}
										title="Swap currencies (⌘+R)"
									>
										<ArrowUpDown className="w-4 h-4" />
									</Button>
								</div>

								<div className="space-y-2">
									<label
										className={`text-sm font-medium ${themeClasses.subtext}`}
									>
										To
									</label>
									<CurrencySelect
										value={toCurrency}
										onChange={setToCurrency}
										isOpen={showToDropdown}
										onOpenChange={setShowToDropdown}
									/>
								</div>
							</div>

							{/* Conversion Result */}
							<div role="status" aria-live="polite" aria-atomic="true">
								<AnimatePresence mode="wait">
									{convertedAmount !== null && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											className={`text-center p-6 rounded-2xl ${themeClasses.input} ${themeClasses.hover}`}
										>
											<div className={`text-sm ${themeClasses.subtext} mb-2`}>
												{amount} {fromCurrencyData?.symbol} =
											</div>
											<div
												className={`text-4xl font-bold ${themeClasses.text} mb-2`}
											>
												{convertedAmount.toFixed(2)} {toCurrencyData?.symbol}
											</div>
											<div className={`text-sm ${themeClasses.subtext}`}>
												{toCurrencyData?.name}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{error && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									role="alert"
									aria-live="assertive"
									className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-xl"
								>
									{error}
								</motion.div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 justify-center">
								<Button
									onClick={addToFavorites}
									disabled={isFavorite}
									variant={isFavorite ? "secondary" : "default"}
									className={`${
										isFavorite
											? "bg-gray-200 hover:bg-gray-300 text-gray-700"
											: themeClasses.accent
									} transition-all duration-200`}
									title={
										isFavorite ? "Already favorited" : "Add to favorites (⌘+F)"
									}
								>
									<Star
										className={`w-4 h-4 mr-2 ${
											isFavorite ? "fill-current" : ""
										}`}
									/>
									{isFavorite ? "Favorited" : "Add to Favorites"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Favorites */}
				{favorites.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="mt-8"
					>
						<h2 className={`text-xl font-semibold mb-4 ${themeClasses.text}`}>
							Quick Access
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{favorites.map((favorite) => {
								const from = getCurrencyByCode(favorite.from);
								const to = getCurrencyByCode(favorite.to);
								return (
									<motion.div
										key={favorite.id}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button
											variant="outline"
											onClick={() => selectFavoriteConversion(favorite)}
											className={`w-full ${themeClasses.card} ${themeClasses.hover} transition-all duration-200`}
										>
											<div className="flex items-center gap-2">
												<span>{from?.flag}</span>
												<span className={themeClasses.text}>
													{favorite.from}
												</span>
												<span className={themeClasses.subtext}>→</span>
												<span>{to?.flag}</span>
												<span className={themeClasses.text}>{favorite.to}</span>
											</div>
										</Button>
									</motion.div>
								);
							})}
						</div>
					</motion.div>
				)}

				{/* Historical Chart */}
				{historicalRates.length > 0 ? (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mt-8"
					>
						<Card className={`${themeClasses.card} rounded-3xl p-6 shadow-2xl`}>
							<div className="flex items-center gap-2 mb-4">
								<TrendingUp className="w-5 h-5" />
								<h2 className={`text-xl font-semibold ${themeClasses.text}`}>
									30-Day Exchange Rate History
								</h2>
							</div>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={historicalRates}>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
										/>
										<XAxis
											dataKey="date"
											stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
											tick={{ fontSize: 12 }}
										/>
										<YAxis
											stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
											tick={{ fontSize: 12 }}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor:
													theme === "dark" ? "#1f2937" : "#ffffff",
												border: `1px solid ${
													theme === "dark" ? "#374151" : "#e5e7eb"
												}`,
												borderRadius: "12px",
											}}
											labelStyle={{
												color: theme === "dark" ? "#f3f4f6" : "#111827",
											}}
										/>
										<Line
											type="monotone"
											dataKey="rate"
											stroke={
												theme === "blue"
													? "#3b82f6"
													: theme === "dark"
													? "#60a5fa"
													: "#3b82f6"
											}
											strokeWidth={2}
											dot={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</Card>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mt-8"
					>
						<Card className={`${themeClasses.card} rounded-3xl p-6 shadow-2xl`}>
							<div className="flex items-center gap-2 mb-4">
								<TrendingUp className="w-5 h-5" />
								<h2 className={`text-xl font-semibold ${themeClasses.text}`}>
									Exchange Rate Information
								</h2>
							</div>
							<div className={`text-center ${themeClasses.subtext}`}>
								<p>Historical rate data is currently loading or unavailable.</p>
								<p className="text-sm mt-2">
									Current exchange rates are updated in real-time.
								</p>
							</div>
						</Card>
					</motion.div>
				)}
			</div>
		</main>
	);
}
