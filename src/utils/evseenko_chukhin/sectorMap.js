import { sectorTileSize, width, height, tileSize } from "../../../scenes/scene_taxi";
import { Sector } from "./sector";

export function createSectorMapBasedOn(roomsArray) {
    let sectorMap = createArray();
    fill(sectorMap, roomsArray);
    return sectorMap;
}

function createArray() {
    let sectorMap = new Array();
    for (let w = 0; w < width; w++)
    {
        sectorMap[w] = new Array();
        for (let h = 0; h < height; h++)
        {
            sectorMap[w][h] = null;
        }
    }    

    return sectorMap;
}

function fill(sectorMap, roomsArray) {
    for (let room of roomsArray) {        
        for (let dx = 0; dx < room.size_x - 1; dx++) {   

            // Нижняя часть                     
            let bottomPartX = room.corner_x + dx;            
            let bottomPartY = room.corner_y + room.size_y - 1;
            sectorMap[bottomPartX][bottomPartY] = new Sector(bottomPartX, bottomPartY);
            sectorMap[bottomPartX][bottomPartY].directions.right = true;            

            //Верхняя часть
            let topPartX = bottomPartX + 1;            
            let topPartY = room.corner_y;
            sectorMap[topPartX][topPartY] = new Sector(topPartX, topPartY);
            sectorMap[topPartX][topPartY].directions.left = true; 
        }
        
        for (let dy = 0; dy < room.size_y - 1; dy++) {   

            //Левая часть                        
            let leftPartX = room.corner_x;
            let leftPartY = room.corner_y + dy;
            sectorMap[leftPartX][leftPartY] = new Sector(leftPartX, leftPartY);
            sectorMap[leftPartX][leftPartY].directions.down = true;

            //Правая часть
            let rightPartX = room.corner_x + room.size_x - 1;            
            let rightPartY = leftPartY + 1;
            sectorMap[rightPartX][rightPartY] = new Sector(rightPartX, rightPartY);
            sectorMap[rightPartX][rightPartY].directions.up = true;   
        }        
    }
}