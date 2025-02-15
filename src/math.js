export var MathUtils;
(function (MathUtils) {
    const DEG_TO_RAD_COEFF = Math.PI / 180.0;
    MathUtils.degreesToRadians = (degrees) => degrees * DEG_TO_RAD_COEFF;
    function directionFromAngle(angleDegrees) {
        const angleRadians = MathUtils.degreesToRadians(angleDegrees);
        return {
            x: Math.cos(angleRadians),
            y: Math.sin(angleRadians),
        };
    }
    MathUtils.directionFromAngle = directionFromAngle;
    function maxFromArray(array) {
        if (array.length === 0)
            return NaN;
        let max = array[0];
        for (let n of array) {
            if (n > max)
                max = n;
        }
        return max;
    }
    MathUtils.maxFromArray = maxFromArray;
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    MathUtils.lerp = lerp;
    function lerpVector2(a, b, t) {
        return {
            x: lerp(a.x, b.x, t),
            y: lerp(a.y, b.y, t),
        };
    }
    MathUtils.lerpVector2 = lerpVector2;
})(MathUtils || (MathUtils = {}));
