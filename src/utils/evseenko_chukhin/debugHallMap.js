import { createBlank2DArray, assignToAllElementsOfArray } from "./accessory_functions";
import { sectorTileSize, width, height } from "../../../scenes/scene_taxi";

export function createDebugHallMap(hallRectangles) {
    let debugWidth = width * sectorTileSize;
    let debugHeight = height * sectorTileSize;
    let debugHallMap = createBlank2DArray(debugWidth);
    assignToAllElementsOfArray(debugHallMap, 0, debugWidth, debugHeight);
    addHallsTo(debugHallMap, hallRectangles)   
    return debugHallMap;
}

function addHallsTo(debugHallMap, hallRectangles) {
    for (let currentRectangle of hallRectangles) {      
        let firstCornerX = currentRectangle.corner_x;
        let firstCornerY = currentRectangle.corner_y;
        let secondCornerX = currentRectangle.corner_x + currentRectangle.size_x;
        let secondCornerY = currentRectangle.corner_y + currentRectangle.size_y;
        for (let w = firstCornerX; w < secondCornerX; w++) {
            for (let h = firstCornerY; h < secondCornerY; h++) {
                let x = w * sectorTileSize;
                let y = h * sectorTileSize;
                for (let dx = 0; dx < sectorTileSize; dx++) {
                    for (let dy = 0; dy < sectorTileSize; dy++) {
                        debugHallMap[x + dx][y + dy] = 5;
                    }
                }                
            }
        }
    }
}