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
            return 0;
        let max = array[0];
        array.forEach(n => {
            if (n > max)
                max = n;
        });
        return max;
    }
    MathUtils.maxFromArray = maxFromArray;
})(MathUtils || (MathUtils = {}));
