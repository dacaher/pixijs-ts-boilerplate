// TODO move global declarations to a proper place
/**
 * Add some global func.
 */
declare global {
    interface Math {
        /**
         * Returns the Greatest Common Divisor of given numbers.
         * @param {number} n
         * @param {number} m
         * @returns {number}
         */
        gcd(n: number, m: number): number;
    }
}

/**
 * Calcs Greatest Common Divisor of given numbers.
 * @param {number} n - Number 1
 * @param {number} m - Number 2
 * @returns {number} Greatest Common Divisor
 */
Math.gcd = (n: number, m: number) => {
    let r = 0;

    while (n !== 0) {
        r = m % n;
        m = n;
        n = r;
    }

    return m;
};

/**
 * App bundle entry point.
 */
import "../styles/style.css"; // Required to bundle styles!

/*
 * YOUR CODE HERE
 */
import {TestApp} from "./test-app/test-app";
const testApp = new TestApp();
testApp.drawScreenBorder();
