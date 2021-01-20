import Vector from "../accessoryClasses/vector.js";
import Car from "./car.js";
import { distanceBetweenPoints } from "../utils/evseenko_chukhin/accessory_functions.js";

export default class NPCCar extends Car {    
    constructor(scene, x, y, name, frame, parameters) {
        super(scene, x, y, name, frame, parameters.unitDirectionVector);        
        //this.acceleration = 100;
        this.currentSpeed = 100;
        this.targetSector = parameters.targetSector;        
        this.sectorMap = parameters.sectorMap;
        /*this.leftVector = new Vector(-1, 0);
        this.upVector = new Vector(0, -1);
        this.rightVector = new Vector(1, 0);
        this.downVector = new Vector(0, 1);        */
    }

    update() {
        let distance = distanceBetweenPoints(this.x, this.y, this.targetSector.center.x, this.targetSector.center.y);        
        if (distance <= 30) {
            this.updateTargetSector();
        }
        
        let targetDirectionVector = this.updateDirection();        
        this.updateCarParameters(this.currentSpeed, targetDirectionVector);   
    }

    updateTargetSector() {        
        let indexX = this.targetSector.indexesInSectorMap.x;
        let indexY = this.targetSector.indexesInSectorMap.y;
        if (this.targetSector.directions.left) {
            this.targetSector = this.sectorMap[indexX - 1][indexY];
            return;
        }

        if (this.targetSector.directions.up) {
            this.targetSector = this.sectorMap[indexX][indexY - 1];
            return;
        }

        if (this.targetSector.directions.right) {
            this.targetSector = this.sectorMap[indexX + 1][indexY];
            return;
        }

        if (this.targetSector.directions.down) {
            this.targetSector = this.sectorMap[indexX][indexY + 1];
            return;
        }     
           
    }

    updateDirection() {     
        let newVX =this.targetSector.center.x - this.x;
        let newVY =this.targetSector.center.y - this.y;
        let result = new Vector(newVX, newVY); 
        result.normalize(); 
        return result;                
    }
}