import { sectorTileSize, width, height, tileSize, hallSize } from "../../../scenes/scene_taxi";
import { Sector } from "./sector";
import { createBlank2DArray, assignToAllElementsOfArray } from "../evseenko_chukhin/accessory_functions";

export function createSectorMap(segments, roomMap) {
    let sectorMap = createBlank2DArray(width);
    assignToAllElementsOfArray(sectorMap, null, width, height);    
    processRooms(sectorMap, segments.roomRectangles);
    processHalls(sectorMap, segments.hallRectangles, roomMap)
    return sectorMap;
}

function processRooms(sectorMap, roomRectangles) {
    for (let room of roomRectangles) {        
        for (let dx = 0; dx < room.size_x - 1; dx++) {   

            // Нижняя часть                     
            let bottomPartX = room.corner_x + dx;            
            let bottomPartY = room.corner_y + room.size_y - 1;
            sectorMap[bottomPartX][bottomPartY] = new Sector(bottomPartX, bottomPartY, "right");                   

            //Верхняя часть
            let topPartX = bottomPartX + 1;            
            let topPartY = room.corner_y;
            sectorMap[topPartX][topPartY] = new Sector(topPartX, topPartY, "left");            
        }
        
        for (let dy = 0; dy < room.size_y - 1; dy++) {   

            //Левая часть                        
            let leftPartX = room.corner_x;
            let leftPartY = room.corner_y + dy;
            sectorMap[leftPartX][leftPartY] = new Sector(leftPartX, leftPartY, "down");            

            //Правая часть
            let rightPartX = room.corner_x + room.size_x - 1;            
            let rightPartY = leftPartY + 1;
            sectorMap[rightPartX][rightPartY] = new Sector(rightPartX, rightPartY, "up");            
        }        
    }    
}

function processHalls(sectorMap, hallRectangles, roomMap) {    
    for (let hall of hallRectangles) {
        if (hall.size_y == hallSize) {
            let topY = hall.corner_y;
            let bottomY = hall.corner_y + hallSize - 1;               
            let lastIndex = hall.corner_x + hall.size_x - 1;
            for (let x = hall.corner_x; x <= lastIndex; x++) {
                if (x != lastIndex) {
                    addSectorTo(sectorMap, x, bottomY, "right", roomMap);
                }
                
                if (x != hall.corner_x) {
                    addSectorTo(sectorMap, x, topY, "left", roomMap);
                }                
            }
        } 
        else {
            let leftX = hall.corner_x;
            let rightX = hall.corner_x + hallSize - 1;               
            let lastIndex = hall.corner_y + hall.size_y - 1;
            for (let y = hall.corner_y; y <= lastIndex; y++) {
                if (y != lastIndex) {
                    addSectorTo(sectorMap, leftX, y, "down", roomMap);
                }
                
                if (y != hall.corner_y) {
                    addSectorTo(sectorMap, rightX, y, "up", roomMap);
                }                
            }
        }    
    }
}

const checkLeftDirection = {
    x : -1,
    y : 0
}

const checkUpDirection = {
    x : 0,
    y : -1
}

const checkRightDirection = {
    x : 1,
    y : 0
}

const checkDownDirection = {
    x : 0,
    y : 1
}

const delta = { 
    left : checkLeftDirection,
    up : checkUpDirection,
    right : checkRightDirection,
    down : checkDownDirection
}

/*const change = {
    left : "up",
    up : "right",
    right : "down",
    down : "left"
}*/

function addSectorTo(sectorMap, x, y, direction, roomMap) {

    let thisSectorIsInRoom = roomMap[x][y] == 1;
    let dx = delta[direction].x;
    let dy = delta[direction].y;
    let nextSectorIsInRoom = roomMap[x + dx][y + dy] == 1;

    if (!thisSectorIsInRoom 
        || thisSectorIsInRoom && !nextSectorIsInRoom) {
        sectorMap[x][y] = new Sector(x, y, direction);
        return;
    }   
}
