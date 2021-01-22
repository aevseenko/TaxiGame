import { sectorTileSize, width, height, debugHallMapWillBeCreated, debugArrowsWillBeDrawn, npcDistance, tileSize } from "./scene_taxi";
import { get_random_int as rand } from "../src/utils/evseenko_chukhin/accessory_functions";
import Vector from "../src/accessoryClasses/vector";

const TILE_MAPPING = {
    BLANK: 17,
    FLOOR: 95
}

const LEVEL_TO_TILE ={
    0: TILE_MAPPING.BLANK,
    1: TILE_MAPPING.FLOOR
}

const STREET_TILESET_MAPPING = {
    ASPHALT: [0, 1, 2, 3],
    GRASS : [4, 5, 6, 7],
    ROOF : [8, 9, 10, 11],
    PEDASTRIAN_AREA : [12, 12, 12, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19],
    HALL : [20, 21]
}

const delta = 1;

const ARROW_TILESET_MAPPING = {    
    left : { dx : delta, dy : delta, tileNumbers : [0, 1, 2, 3] },
    up : { dx : delta, dy : delta, tileNumbers : [4, 5, 6, 7] },
    right : { dx : delta, dy : delta, tileNumbers : [8, 9, 10, 11] },
    down : { dx : delta, dy : delta, tileNumbers : [12, 13, 14, 15] },
}



/*const LEVEL_TO_STREET_TILESET ={
    0: STREET_TILESET_MAPPING.GRASS,
    1: STREET_TILESET_MAPPING.ASPHALT
}*/

export function createSceneLayers(scene) {
    let tile_size = scene.tileSize; 

    scene.map = scene.make.tilemap({tileWidth: tile_size,
        tileHeight: tile_size,
        width: sectorTileSize * width,
        height: sectorTileSize * height});

    //let tileSet = scene.map.addTilesetImage("tiles", null, tile_size, tile_size);   
    let streetTileSet = scene.map.addTilesetImage("streetTileSet", null, tile_size, tile_size);    
    let grassLayer = scene.map.createBlankDynamicLayer("Grass", streetTileSet);    
    let roadsLayer  = scene.map.createBlankDynamicLayer("Roads", streetTileSet);
    let pedastrianAreaLayer = scene.map.createBlankDynamicLayer("Pedastrian Area", streetTileSet);
    let roofLayer  = scene.map.createBlankDynamicLayer("Roofs", streetTileSet);
    let result = { 
        grassLayer : grassLayer, 
        roadsLayer : roadsLayer, 
        pedastrianAreaLayer : pedastrianAreaLayer, 
        roofLayer : roofLayer        
    }

    if (debugHallMapWillBeCreated) {
        let hallLayer  = scene.map.createBlankDynamicLayer("Halls", streetTileSet);        
        result.hallLayer = hallLayer;
    }

    if (debugArrowsWillBeDrawn) {
        let debugArrowsTileSet = scene.map.addTilesetImage("debugArrows", null, tile_size, tile_size);  
        let debugArrowLayer  = scene.map.createBlankDynamicLayer("Debug arrows", debugArrowsTileSet);        
        result.debugArrowLayer = debugArrowLayer;
    }
   
    return result;
}

export function settingWorld(scene, sceneLayers)
{
    /*scene.physics.add.collider(scene, outsideLayer);
    scene.physics.add.collider(scene, groundLayer);
    scene.physics.add.collider(scene, stuffLayer);*/
    scene.physics.world.setBounds(0,0, scene.map.widthInPixels,
        scene.map.heightInPixels, true);
    for (let name in sceneLayers) {
        sceneLayers[name].setCollisionBetween(1, 500);
    }
    /*groundLayer.
    //stuffLayer.setDepth(10);
    //outsideLayer.setDepth(9999);
    outsideLayer.setCollisionBetween(1, 500);*/
}

export function putTilesOnLayers(sceneLayers, map_matrix, debugHallMap, sectorMap) {
    let randomTileNumer = 0;
        for (let x = 0; x < sectorTileSize * width; x++)
        {
            for (let y = 0; y < sectorTileSize * height; y++)
            {
                switch(map_matrix[x][y]) {
                    case 0:  
                        randomTileNumer = rand(0, STREET_TILESET_MAPPING.GRASS.length - 1);
                        sceneLayers.grassLayer.putTileAt(STREET_TILESET_MAPPING.GRASS[randomTileNumer], x, y);
                        break;
                    case 1: 
                        randomTileNumer = rand(0, STREET_TILESET_MAPPING.ASPHALT.length - 1);
                        sceneLayers.roadsLayer.putTileAt(STREET_TILESET_MAPPING.ASPHALT[randomTileNumer], x, y);
                        break;
                    case 2:
                        randomTileNumer = rand(0, STREET_TILESET_MAPPING.PEDASTRIAN_AREA.length - 1);
                        sceneLayers.pedastrianAreaLayer.putTileAt(STREET_TILESET_MAPPING.PEDASTRIAN_AREA[randomTileNumer], x, y);
                        break;
                    case 3:                    
                        sceneLayers.roofLayer.putTileAt(STREET_TILESET_MAPPING.ROOF[0], x, y);       
                        sceneLayers.roofLayer.putTileAt(STREET_TILESET_MAPPING.ROOF[1], x + 1, y);       
                        sceneLayers.roofLayer.putTileAt(STREET_TILESET_MAPPING.ROOF[2], x, y + 1);       
                        sceneLayers.roofLayer.putTileAt(STREET_TILESET_MAPPING.ROOF[3], x + 1, y + 1);                           
                        
                        map_matrix[x + 1][y] = -1;
                        map_matrix[x][y + 1] = -1;
                        map_matrix[x + 1][y + 1] = -1;
                        
                        break;
                    case 4:
                        randomTileNumer = rand(0, STREET_TILESET_MAPPING.GRASS.length - 1);
                        sceneLayers.grassLayer.putTileAt(STREET_TILESET_MAPPING.GRASS[randomTileNumer], x, y);
                        break;
                }            
            }
        }

        if (debugHallMapWillBeCreated) {
            for (let x = 0; x < sectorTileSize * width; x++) {
                for (let y = 0; y < sectorTileSize * height; y++) {
                    if (debugHallMap[x][y] == 5) {
                        sceneLayers.hallLayer.putTileAt(STREET_TILESET_MAPPING.HALL[0], x, y);
                    }                
                }
            }
        }

        if (debugArrowsWillBeDrawn) {
            putArrowsOnDebugArrowLayer(sceneLayers.debugArrowLayer, sectorMap);
        }


        
        /*for (let x = 1; x < width - 1; x++)
        {
            for (let y = 1; y < height - 1; y++)
            {
                if (map_matrix[x][y] == 0 
                    && map_matrix[x - 1][y] == 0 && map_matrix[x][y - 1] == 0 && map_matrix[x + 1][y] == 0 && map_matrix[x][y + 1] == 0
                    && map_matrix[x - 1][y - 1] == 0 && map_matrix[x + 1][y - 1] == 0 && map_matrix[x + 1][y + 1] == 0 && map_matrix[x - 1][y + 1] == 0)
                {                
                    roofLayer.putTileAt(STREET_TILESET_MAPPING.ROOF, x, y);
                    map_matrix[x][y] == 3;
                }            
            }
        }*/
}

function putArrowsOnDebugArrowLayer(debugArrowLayer, sectorMap) {
    for (let sx = 0; sx < sectorMap.length; sx++) {
        for (let sy = 0; sy < sectorMap[0].length; sy++) {
            if (sectorMap[sx][sy] != null) {
                for (let name in sectorMap[sx][sy].directions) {                    
                    if (sectorMap[sx][sy].directions[name]) {
                        let arrowParameters = ARROW_TILESET_MAPPING[name];
                        let baseX = sx * sectorTileSize + arrowParameters.dx;                        
                        let baseY = sy * sectorTileSize + arrowParameters.dy;
                        debugArrowLayer.putTileAt(arrowParameters.tileNumbers[0], baseX, baseY);
                        debugArrowLayer.putTileAt(arrowParameters.tileNumbers[1], baseX + 1, baseY);
                        debugArrowLayer.putTileAt(arrowParameters.tileNumbers[2], baseX, baseY + 1);
                        debugArrowLayer.putTileAt(arrowParameters.tileNumbers[3], baseX + 1, baseY + 1);
                    }
                }
            }            
        }
    }
}

export function createNPCCars(scene, sectorMap) {
    for (let x = 0; x < width; x += npcDistance) {
        for (let y = 0; y < height; y++) {
            if (sectorMap[x][y] != null) {                
                if (sectorMap[x + 1][y] != null && sectorMap[x][y].directionsCoinside(sectorMap[x + 1][y])) {
                    let sector;
                    let npcX;
                    let npcY = sectorMap[x + 1][y].center.y;
                    let unitDirectionVector; 
                    if (sectorMap[x + 1][y].directions.right) {      
                        npcX = sectorMap[x + 1][y].center.x - sectorTileSize * tileSize / 2;  
                        unitDirectionVector = new Vector(1, 0);    
                        sector = sectorMap[x + 1][y];
                    }

                    if (sectorMap[x][y].directions.left) {      
                        npcX = sectorMap[x][y].center.x + sectorTileSize * tileSize / 2;   
                        unitDirectionVector = new Vector(-1, 0);    
                        sector = sectorMap[x][y];     
                    }
                    
                    addNPC(scene, npcX, npcY, unitDirectionVector, sector, sectorMap);  
                }               
            }
        }    
    }

    for (let y = 0; y < height; y += npcDistance) {
        for (let x = 0; x < width; x++)  {
            if (sectorMap[x][y] != null) {   
                if (sectorMap[x][y + 1] != null && sectorMap[x][y].directionsCoinside(sectorMap[x][y + 1])) {
                    let sector;
                    let npcX = sectorMap[x][y + 1].center.x;
                    let npcY;
                    let unitDirectionVector; 
                    if (sectorMap[x][y + 1].directions.down) {      
                        npcY = sectorMap[x][y + 1].center.y - sectorTileSize * tileSize / 2;  
                        unitDirectionVector = new Vector(0, 1);   
                        sector = sectorMap[x][y + 1];    
                    }

                    if (sectorMap[x][y].directions.up) {      
                        npcY = sectorMap[x][y].center.y + sectorTileSize * tileSize / 2;   
                        unitDirectionVector = new Vector(0, -1); 
                        sector = sectorMap[x][y];         
                    }
                    
                    addNPC(scene, npcX, npcY, unitDirectionVector, sector, sectorMap);                                     
                }                             
            }
        }    
    }
}

function addNPC(scene, npcX, npcY, unitDirectionVector, sector, sectorMap) {    
    let npcCar = scene.characterFactory.buildCharacter("npcCar", npcX, npcY, 
        { 
            unitDirectionVector : unitDirectionVector,
            targetSector : sector,
            sectorMap : sectorMap
        });       
    scene.gameObjects.push(npcCar);
}
    

export function createPlayerCar(scene, roomsArray) {
    let randomNumber = rand(0, roomsArray.length - 1);   
    let auroraX = (rand(roomsArray[randomNumber].corner_x + 1,
        roomsArray[randomNumber].corner_x - 1 + roomsArray[randomNumber].size_x) - 0.5) * scene.tile_size;
    let auroraY = (rand(roomsArray[randomNumber].corner_y + 1,
        roomsArray[randomNumber].corner_y - 1 + roomsArray[randomNumber].size_y) - 0.5) * scene.tile_size;
    //return scene.characterFactory.buildCharacter('playerCar', 200, 200, {player: true});
    return scene.characterFactory.buildCharacter('playerCar', 800, 800, {player: true});
}

export function setCameraParametersFor(scene) {
    const camera = scene.cameras.main;
    //camera.setZoom(1);
    camera.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);
    camera.startFollow(scene.player);
    camera.roundPixels = true;
}

export function addDebugGraphicsFor(scene) {
    scene.input.keyboard.once("keydown_D", event => {
        // Turn on physics debugging to show player's hitbox
        scene.physics.world.createDebugGraphic();

        const graphics = scene.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20);
    });    
}
