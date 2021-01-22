import { sectorTileSize, tileSize, width, height } from "../../../scenes/scene_taxi";

export class Sector {
    constructor(sectorIndexX, sectorIndexY, directionName) {
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

        this.directions[directionName] = true;
    }

    directionsCoinside(sector2) {
        let c1 = this.directions.left == sector2.directions.left;
        let c2 = this.directions.up == sector2.directions.up;
        let c3 = this.directions.right == sector2.directions.right;
        let c4 = this.directions.down == sector2.directions.down;
        return c1 && c2 && c3 && c4;
    }
}