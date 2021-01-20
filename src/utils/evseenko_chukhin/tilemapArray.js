import { get_random_int as rand } from "./accessory_functions";
import { sectorTileSize, width, height } from "../../../scenes/scene_taxi";

export function fillTilemapArray(roadMap) {
    let tilemapArray = new Array();  
    for (let w = 0; w < width * sectorTileSize; w++) {
        tilemapArray[w] = new Array(); 
    }
    extendTo(tilemapArray, roadMap)
    addPedastrianAreaTo(tilemapArray);
    return tilemapArray;
}

function extendTo(tilemapArray, roadMap) {      
    for (let w = 0; w < width; w++) {        
        for (let h = 0; h < height; h++) {
            for (let i = sectorTileSize * w; i < sectorTileSize * (w + 1); i++) {                
                for (let j = sectorTileSize * h; j < sectorTileSize * (h + 1); j++) {
                    tilemapArray[i][j] = roadMap[w][h];                    
                }
            }            
        }
    }    
}

function addPedastrianAreaTo(tilemapArray) {
    for (let x = 1; x < tilemapArray.length - 1; x++) {
        for (let y = 1; y < tilemapArray[0].length- 1; y++) {
            if (tilemapArray[x][y] == 0 && (tilemapArray[x - 1][y] == 1 || tilemapArray[x + 1][y] == 1 || tilemapArray[x][y - 1] == 1 || tilemapArray[x][y + 1] == 1
                                        || tilemapArray[x - 1][y - 1] == 1 || tilemapArray[x + 1][y - 1] == 1 || tilemapArray[x - 1][y + 1] == 1 || tilemapArray[x + 1][y + 1] == 1)){
                tilemapArray[x][y] = 2;
            }
        }
    }

    /*for (let x = 1; x < tilemapArray.length - 1; x++) {        
        if (tilemapArray[x][1] == 1){
            tilemapArray[x][1] = 2;        
        }

        if (mapArray[x][mapArray[0].length - 2] == 1){
            mapArray[x][mapArray[0].length - 2] = 2;  
        }      
    }    

    
    for (let y = 1; y < mapArray[0].length- 1; y++) {
        if (mapArray[1][y] == 1) {
            mapArray[1][y] = 2;
        }

        if (mapArray[mapArray.length - 2][y] == 1) {
            mapArray[mapArray.length - 2][y] = 2;
        }
    }*/     
}
/*
function addHouses(mapArray) {
    let houseArea = 7
    for (let x = 2; x < mapArray.length - 2 - houseArea; x++) {
        for (let y = 2; y < mapArray[0].length - 2 - houseArea; y++) {
            let placeIsHere = true;
            for (let xi = x; xi < x + houseArea; xi ++) {
                for (let yi = y; yi < y + houseArea; yi ++) {
                    if (mapArray[xi][yi] != 0) {
                        placeIsHere = false;
                        break;
                    }
                }        
            }        

            if (placeIsHere) {                
                for (let xi = x; xi < x + houseArea; xi ++) {
                    for (let yi = y; yi < y + houseArea; yi ++) {
                        mapArray[xi][yi] = 4;
                    }        
                }        

                let randomTileNumberX = rand(x, x + houseArea - 2);
                let randomTileNumberY = rand(y, y + houseArea - 2);
                mapArray[randomTileNumberX][randomTileNumberY] = 3;
                mapArray[randomTileNumberX + 1][randomTileNumberY] = 3;
                mapArray[randomTileNumberX][randomTileNumberY + 1] = 3;
                mapArray[randomTileNumberX + 1][randomTileNumberY + 1] = 3;
            }
        } 
    }

    return mapArray;
}*/