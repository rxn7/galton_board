export var MathUtils;
(function (MathUtils) {
    const DEG_TO_RAD_COEFF = Math.PI / 180.0;
    MathUtils.degreesToRadians = (degrees) => degrees * DEG_TO_RAD_COEFF;
    MathUtils.directionFromAngle = (angleDegrees) => {
        const angleRadians = MathUtils.degreesToRadians(angleDegrees);
        return {
            x: Math.cos(angleRadians),
            y: Math.sin(angleRadians)
        };
    };
})(MathUtils || (MathUtils = {}));
