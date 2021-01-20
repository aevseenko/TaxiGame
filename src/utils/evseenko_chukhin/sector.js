import { sectorTileSize, tileSize, width, height } from "../../../scenes/scene_taxi";

export class Sector {
    constructor(sectorIndexX, sectorIndexY) {
        this.indexesInSectorMap = {
            x : sectorIndexX,
            y : sectorIndexY
        }
        
        this.center = { 
            x : ((sectorIndexX + 0.5) * sectorTileSize) * tileSize,
            y : ((sectorIndexY + 0.5) * sectorTileSize) * tileSize
        }

        this.directions = {
            left : false,
            up : false,
            right : false,
            down : false
        }
    }
}