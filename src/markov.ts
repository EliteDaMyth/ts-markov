/**
 * As per Wikipedia, A Markov chain is a stochastic model describing a sequence of possible events in which the probability of each event depends only on the state attained in the previous event.
 * This is a simple implementation of a Markov Chain in Typescript.
 *
 * @export
 * @class Markov
 */
export default class Markov {
	/**
	 * The array of "states" in the model.
	 *
	 * @type {string[]}
	 * @memberof Markov
	 */
	states: string[];
	/**
	 * The array of possible sentence/Word startings.
	 *
	 * @type {string[]}
	 * @memberof Markov
	 */
	start: string[];
	/**
	 * An Object, to store all the various possibilities.
	 *
	 * @type {{ [key: string]: string[] }}
	 * @memberof Markov
	 */
	possibilities: { [key: string]: string[] };
	/**
	 * The order of the model.
	 *
	 * @type {number}
	 * @memberof Markov
	 */
	order: number;

	/**
	 * Creates an instance of Markov.
	 * @memberof Markov
	 */
	constructor() {
		this.states = [];
		this.start = [];
		this.possibilities = {};
		this.order = 3;
	}

	/**
	 * Add a state to the array of states. Takes either an Array of states, or just 1 state.
	 *
	 * @param {(string | string[])} state
	 * @memberof Markov
	 */
	addState(state: string | string[]) {
		if (Array.isArray(state)) {
			this.states.push(...state);
		} else {
			this.states.push(state);
		}
	}

	/**
	 * Completely Clear the markov chain.
	 *
	 * @memberof Markov
	 */
	clear() {
		this.states = [];
		this.start = [];
		this.possibilities = {};
		this.order = 3;
	}

	/**
	 * Returns the states.
	 *
	 * @return {string[]}
	 * @memberof Markov
	 */
	getStates(): string[] {
		return this.states;
	}

	/**
	 * Sets the order of the model.
	 *
	 * @param {number} [order=3]
	 * @memberof Markov
	 */
	setOrder(order: number = 3) {
		if (order <= 0 || typeof order != "number") {
			this.order = 3;
			console.warn(
				"Order can only be a positive Integer. Order is set to the default 3."
			);
		}
		this.order = order;
	}

	/**
	 * Returns the order of the model
	 *
	 * @return {*}  {number}
	 * @memberof Markov
	 */
	getOrder(): number {
		return this.order;
	}

	/**
	 *Returns the Possibilities, based on the given input, if no input is given, returns all possible possibilities.
	 *
	 * @param {string} [possibility]
	 * @return {*}  {({} | string[])}
	 * @memberof Markov
	 */
	getPossibility(possibility?: string): {} | string[] {
		if (possibility) {
			if (this.possibilities[possibility] != undefined) {
				return this.possibilities[possibility];
			} else {
				throw new Error("No such possibility exists.");
			}
		} else {
			return this.possibilities;
		}
	}

	/**
	 * Clears all possibilites.
	 *
	 * @memberof Markov
	 */
	clearPossibilities() {
		this.possibilities = {};
	}

	/**
	 * Train the Markov Chain and populate the Possibilites.
	 *
	 * @param {number} [order]
	 * @memberof Markov
	 */
	train(order?: number) {
		this.clearPossibilities();

		if (order) {
			this.setOrder(order);
		}

		for (let i = 0; i < this.states.length; i++) {
			this.start.push(this.states[i].substring(0, this.order));

			for (let j = 0; j <= this.states[i].length - this.order; j++) {
				let gram = this.states[i].substring(j, j + this.order);

				if (!this.possibilities[gram]) {
					this.possibilities[gram] = [];
				}

				this.possibilities[gram].push(this.states[i].charAt(j + this.order));
			}
		}
	}

	/**
	 * Return an generated Output, based on the Trained data.
	 *
	 * @param {number} [chars=30]
	 * @return {*}
	 * @memberof Markov
	 */
	generate(chars: number = 30) {
		let startingState = this.random(this.start, "array");
		let result = startingState;
		let current = startingState;
		let next = "";

		for (let i = 0; i < chars - this.order; i++) {
			next = this.random(this.possibilities[current], "array");

			if (!next) break;

			result += next;
			current = result.substring(result.length - this.order, result.length);
		}

		return result;
	}

	/**
	 * Get a random Element/Item from Array/Object, based on type.
	 *
	 * @param {({} | any[])} obj
	 * @param {string} type
	 * @return {*}
	 * @memberof Markov
	 */
	random(obj: {} | any[], type: string) {
		if (Array.isArray(obj) && type === "array") {
			const index = Math.floor(Math.random() * obj.length);

			return obj[index];
		}

		if (typeof obj === "object" && type === "object") {
			const keys = Object.keys(obj);
			const index = Math.floor(Math.random() * keys.length);

			return keys[index];
		}
	}
}
