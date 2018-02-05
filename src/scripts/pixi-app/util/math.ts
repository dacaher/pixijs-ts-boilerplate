if (!Math.gcd) {
    Math.gcd = (n: number, m: number) => {
        let r = 0;

        while (n !== 0) {
            r = m % n;
            m = n;
            n = r;
        }

        return m;
    };
}
