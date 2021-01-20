import {width, height} from "../../../scenes/scene_taxi";

export function fillRoadMap(roomsArray)
{    
    let roadMap = new Array();  
    addGrassTo(roadMap);  
    addRoomsTo(roadMap, roomsArray);    
    return  roadMap;
}

function addGrassTo(roadMap) {    
    for (let w = 0; w < width; w++)
    {
        roadMap[w] = new Array();
        for (let h = 0; h < height; h++)
        {
            roadMap[w][h] = 0;
        }
    }    
}

function addRoomsTo(roadMap, roomsArray) {
    for (let currentRectangle of roomsArray)
    {      
        let firstCornerX = currentRectangle.corner_x;
        let firstCornerY = currentRectangle.corner_y;
        let secondCornerX = currentRectangle.corner_x + currentRectangle.size_x;
        let secondCornerY = currentRectangle.corner_y + currentRectangle.size_y;
        for (let w = firstCornerX; w < secondCornerX; w++)
        {
            for (let h = firstCornerY; h < secondCornerY; h++)
            {
                roadMap[w][h] = 1;
            }
        }
    }
}