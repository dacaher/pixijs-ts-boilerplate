declare global {
    interface Math {
        /**
         * Returns the Greatest Common Divisor of given numbers.
         * @param {number} n
         * @param {number} m
         * @returns {number} Greatest Common Divisor
         */
        gcd(n: number, m: number): number;
    }
}

export {};
