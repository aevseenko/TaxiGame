import {width, height} from "../../../scenes/scene_taxi";
import {createBlank2DArray, assignToAllElementsOfArray, copy2DArray } from "./accessory_functions";

export function getRoomMap(roomsArray) {
    let roomMap = createBlank2DArray(width);
    assignToAllElementsOfArray(roomMap, 0, width, height);
    addRectanglesOnMap(roomMap, roomsArray);    
    return  roomMap;
}

function addRectanglesOnMap(roadMap, rectangleArray) {
    for (let currentRectangle of rectangleArray)
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

export function getFullRoadMapBasedOn(roomMap, hallRectangles) {
    let result = copy2DArray(roomMap);    
    addRectanglesOnMap(result, hallRectangles);
    return result;
}