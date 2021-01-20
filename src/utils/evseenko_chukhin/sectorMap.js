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

        let topPartY = room.corner_y;
        let bottomPartY = room.corner_y + room.size_y - 1;
        let leftPartX = room.corner_x;
        let rightPartX = room.corner_x + room.size_x - 1;
        for (let x = room.corner_x; x < rightPartX; x++) {   

            // Нижняя часть                     
            let bottomPartX = x;            
            sectorMap[bottomPartX][bottomPartY] = new Sector(bottomPartX, bottomPartY);
            sectorMap[bottomPartX][bottomPartY].directions.right = true;

            //Верхняя часть
            let topPartX = rightPartX - x;
            sectorMap[topPartX][topPartY] = new Sector(topPartX, topPartY);
            sectorMap[topPartX][topPartY].directions.left = true;           
        }
        
        for (let y = room.corner_y; y < bottomPartY; y++) {            

            //Левая часть                        
            let leftPartY = y;
            sectorMap[leftPartX][leftPartY] = new Sector(leftPartX, leftPartY);
            sectorMap[leftPartX][leftPartY].directions.down = true;

            //Правая часть
            let rightPartY = bottomPartY - y;            
            sectorMap[rightPartX][rightPartY] = new Sector(rightPartX, rightPartY);
            sectorMap[rightPartX][rightPartY].directions.up = true;    
        }
    }
}