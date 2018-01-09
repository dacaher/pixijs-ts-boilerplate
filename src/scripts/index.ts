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
         * @returns {number} Greatest Common Divisor
         */
        gcd(n: number, m: number): number;
    }
}

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
import "styles/style.css"; // Required to bundle styles!

/*
 * YOUR CODE HERE
 */
import {SampleApp} from "app/sample-app";
const sampleApp = new SampleApp();
sampleApp.drawScreenBorder();
