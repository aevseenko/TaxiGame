import { width, height } from "../../../scenes/scene_taxi";
import { Sector } from "./sector";
import { createBlank2DArray, assignToAllElementsOfArray } from "../evseenko_chukhin/accessory_functions";

const outterToLeft = [
                        [-1,     0,     -1], 
                        [-1,     1,      0], 
                        [-1,    -1,     -1]];
const innerToLeft = [
                        [ 0,     1,     -1], 
                        [ 1,     1,     -1], 
                        [-1,    -1,     -1]];    
//------------------------------------------------
const outterToUp = [
                        [-1,    -1,     -1], 
                        [-1,     1,      0], 
                        [-1,     0,     -1]];
const innerToUp = [
                        [-1,     1,      0], 
                        [-1,     1,      1], 
                        [-1,    -1,     -1]];    
//------------------------------------------------
const outterToRight = [
                        [-1,    -1,     -1], 
                        [ 0,     1,     -1], 
                        [-1,     0,     -1]];
const innerToRight = [
                        [-1,    -1,     -1], 
                        [-1,     1,      1], 
                        [-1,     1,      0]];    
//------------------------------------------------
const outterToDown = [
                        [-1,     0,     -1], 
                        [ 0,     1,     -1], 
                        [-1,    -1,     -1]];
const innerToDown = [
                        [-1,    -1,     -1], 
                        [ 1,     1,     -1], 
                        [ 0,     1,     -1]];    
//------------------------------------------------

const directions = {
    left : [outterToLeft, innerToLeft],
    up : [outterToUp, innerToUp],
    right : [outterToRight, innerToRight],
    down : [outterToDown, innerToDown]
}

const delta = {
    left    : {x : -1, y : 0},
    up      : {x :  0, y :-1},
    right   : {x :  1, y : 0},
    down    : {x :  0, y : 1},
}

export function createSectorMap(fullBasicRoadMap) {
    let sectorMap = createBlank2DArray(width);    
    assignToAllElementsOfArray(sectorMap, null, width, height);       
    putCornerSectorsOnMap(sectorMap, fullBasicRoadMap);    
    fillMap(sectorMap);    
    return sectorMap;
}

function putCornerSectorsOnMap(sectorMap, fullBasicRoadMap) {
    for (let x = 1; x < width - 1; x++) {        
        for (let y = 1; y < height - 1; y++) {            
            let direction = getDirection(fullBasicRoadMap, x, y);            
            if (direction != null) {
                sectorMap[x][y] = new Sector(x, y, direction);
                //console.log(direction);
            }                        
        }    
    }
}

function getDirection(fullBasicRoadMap, x, y) {
    for (let direction in directions) {
        //console.log(direction);
        for (let mask of directions[direction]) {
            //console.log(mask);
            let checkWasSuccessful = true;
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {                    
                    if (mask[1 + dy][1 + dx] != -1 && fullBasicRoadMap[x + dx][y + dy] != mask[1 + dy][1 + dx]) {
                        checkWasSuccessful = false;
                    }                            
                }   
            }
            if (checkWasSuccessful) {
                //console.log(direction);
                return direction;
            }
        }
    }

    return null;
}

function fillMap(sectorMap) {
    for (let x = 1; x < width - 1; x++) {
        for (let y = 1; y < height - 1; y++) {
            if (sectorMap[x][y] != null) {                
                let directionName;                
                for (directionName in sectorMap[x][y].directions) {                    
                    if (sectorMap[x][y].directions[directionName] == true) {                        
                        break;
                    }
                } 
                let newX = x + delta[directionName].x;
                let newY = y + delta[directionName].y;
                console.log("newX = " + newX + "; newY = " + newY);
                while (sectorMap[newX][newY] == null) {
                    sectorMap[newX][newY] = new Sector(newX, newY, directionName);
                    newX += delta[directionName].x;
                    newY += delta[directionName].y;
                }
            }                       
        }    
    }
}


