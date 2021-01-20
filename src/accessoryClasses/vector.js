export default class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;        
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    substract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(number) {
        this.x *= number;
        this.y *= number;
    }

    setToZero() {
        this.x = 0;
        this.y = 0;
    }

    crossZCoordinate(vector) {
        return this.x * vector.y - vector.x * this.y;           
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let length = this.length();
        this.x /= length;
        this.y /= length;
    }
    angle() {
        let length = this.length();
        let normedX = this.x / length;        
        let arccosPhi = Math.acos(normedX);
        if (this.y < 0) {
            arccosPhi = - arccosPhi;
        }
        return arccosPhi;
    }    

    angleInDegrees() {
        return this.angle() * 360 / (2 * Math.PI);
    }

    rotateOnAngleInRadians(rotationAngle) {
        let newAngle = this.angle() + rotationAngle;        
        let length = this.length();        
        this.x = length * Math.cos(newAngle);        
        this.y = length * Math.sin(newAngle);
    }

    rotateOnAngleInDegrees(rotationAngle) {

        let angleInRadians = 2 * Math.PI * rotationAngle / 360;
        this.rotateOnAngleInRadians(angleInRadians);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    getNormalVector() {
        return new Vector(-this.y, this.x);
    }

}