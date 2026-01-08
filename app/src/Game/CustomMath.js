export default class CustomMath {
    //Conversion d'angles Degrées to Radians
    static degToRad(degValue) {
        return degValue * (Math.PI / 180);
    }

    //Conversion d'angles Radians to Degrées 
    static radToDeg(degValue) {
        return radValue * (180 / Math.PI);
    }
}