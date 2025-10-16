import { Server, Socket } from "socket.io";

const EXCHANGE_RATE_API = "https://api.frankfurter.app";

interface ConversionData {
	amount: string | number;
	from: string;
	to: string;
}

interface RateSubscription {
	from: string;
	to: string;
}

// Store active rate subscriptions per socket
const socketSubscriptions = new Map<string, RateSubscription[]>();

export function setupSocket(io: Server) {
	console.log("Setting up Socket.IO handlers...");

	io.on("connection", (socket: Socket) => {
		console.log("Client connected:", socket.id);
		socketSubscriptions.set(socket.id, []);

		// Handle currency conversion requests
		socket.on("convert-currency", async (data: ConversionData) => {
			try {
				const { amount, from, to } = data;
				console.log("Conversion request:", { amount, from, to });

				// Fetch conversion from Frankfurter API
				const response = await fetch(
					`${EXCHANGE_RATE_API}/latest?amount=${amount}&from=${from}&to=${to}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch conversion rate");
				}

				const result = await response.json();

				// Emit the conversion result back to the client
				socket.emit("conversion-result", {
					amount,
					from,
					to,
					rate: result.rates[to],
					convertedAmount: result.rates[to] * Number(amount),
					date: result.date,
					timestamp: new Date().toISOString(),
				});
			} catch (error) {
				console.error("Conversion error:", error);
				socket.emit("conversion-error", {
					message: "Failed to convert currency",
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		});

		// Handle real-time rate updates subscription
		socket.on("subscribe-rates", async (data: RateSubscription) => {
			try {
				const { from, to } = data;
				console.log("Client subscribed to rates:", {
					from,
					to,
					socketId: socket.id,
				});

				// Add to subscriptions
				const subscriptions = socketSubscriptions.get(socket.id) || [];
				const exists = subscriptions.some(
					(sub) => sub.from === from && sub.to === to
				);

				if (!exists) {
					subscriptions.push({ from, to });
					socketSubscriptions.set(socket.id, subscriptions);
				}

				// Send initial rate
				const response = await fetch(
					`${EXCHANGE_RATE_API}/latest?from=${from}&to=${to}`
				);

				if (response.ok) {
					const result = await response.json();
					socket.emit("rate-update", {
						from,
						to,
						rate: result.rates[to],
						date: result.date,
						timestamp: new Date().toISOString(),
					});
				}
			} catch (error) {
				console.error("Subscription error:", error);
				socket.emit("subscription-error", {
					message: "Failed to subscribe to rates",
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		});

		// Handle unsubscribe
		socket.on("unsubscribe-rates", (data: RateSubscription) => {
			const { from, to } = data;
			console.log("Client unsubscribed from rates:", { from, to });

			const subscriptions = socketSubscriptions.get(socket.id) || [];
			const filtered = subscriptions.filter(
				(sub) => !(sub.from === from && sub.to === to)
			);
			socketSubscriptions.set(socket.id, filtered);
		});

		// Handle historical data requests
		socket.on("get-historical-rates", async (data: RateSubscription) => {
			try {
				const { from, to } = data;
				console.log("Historical rates request:", { from, to });

				// Get historical rates for the past 30 days
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(startDate.getDate() - 30);

				const startDateStr = startDate.toISOString().split("T")[0];
				const endDateStr = endDate.toISOString().split("T")[0];

				const response = await fetch(
					`${EXCHANGE_RATE_API}/${startDateStr}..${endDateStr}?from=${from}&to=${to}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch historical rates");
				}

				const result = await response.json();

				socket.emit("historical-rates", {
					from,
					to,
					data: result,
					timestamp: new Date().toISOString(),
				});
			} catch (error) {
				console.error("Historical rates error:", error);
				socket.emit("historical-error", {
					message: "Failed to fetch historical rates",
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		});

		// Handle disconnection
		socket.on("disconnect", () => {
			console.log("Client disconnected:", socket.id);
			socketSubscriptions.delete(socket.id);
		});

		// Handle errors
		socket.on("error", (error) => {
			console.error("Socket error:", error);
		});
	});

	// Broadcast rate updates to all subscribed clients every 60 seconds
	setInterval(async () => {
		const allSubscriptions = new Map<string, Set<string>>();

		// Collect all unique currency pairs
		socketSubscriptions.forEach((subscriptions, socketId) => {
			subscriptions.forEach((sub) => {
				const key = `${sub.from}-${sub.to}`;
				if (!allSubscriptions.has(key)) {
					allSubscriptions.set(key, new Set());
				}
				allSubscriptions.get(key)?.add(socketId);
			});
		});

		// Fetch and broadcast updates for each unique pair
		for (const [pair, socketIds] of allSubscriptions.entries()) {
			const [from, to] = pair.split("-");

			try {
				const response = await fetch(
					`${EXCHANGE_RATE_API}/latest?from=${from}&to=${to}`
				);

				if (response.ok) {
					const result = await response.json();

					// Emit to each subscribed socket
					socketIds.forEach((socketId) => {
						const socket = io.sockets.sockets.get(socketId);
						if (socket) {
							socket.emit("rate-update", {
								from,
								to,
								rate: result.rates[to],
								date: result.date,
								timestamp: new Date().toISOString(),
							});
						}
					});
				}
			} catch (error) {
				console.error(`Failed to update rates for ${pair}:`, error);
			}
		}
	}, 60000); // Update every 60 seconds

	console.log("Socket.IO setup complete");
}
