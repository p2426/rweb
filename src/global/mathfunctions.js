export class MathFunctions {
    static lerp(a, b, v) {
        return a + (b - a) * v;
    }

    static clamp(min, max, v) {
        return v <= min ? min : v >= max ? max : v;
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomRangeFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getTanFromDegrees(degrees) {
        return Math.tan(degrees * Math.PI / 180);
    }

    static invert(v) {
        return v - (v * 2);
    }
}