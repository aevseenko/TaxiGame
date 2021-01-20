import { sectorTileSize, width, height } from "./scene_taxi";
import { get_random_int as rand } from "../src/utils/evseenko_chukhin/accessory_functions";

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
    PEDASTRIAN_AREA : [12, 12, 12, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19]
}

const LEVEL_TO_STREET_TILESET ={
    0: STREET_TILESET_MAPPING.GRASS,
    1: STREET_TILESET_MAPPING.ASPHALT
}

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
    return { 
        grassLayer : grassLayer, 
        roadsLayer : roadsLayer, 
        pedastrianAreaLayer : pedastrianAreaLayer, 
        roofLayer : roofLayer
    }
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

export function putTilesOnLayers(sceneLayers, map_matrix) {
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

export function createPlayerCar(scene, roomsArray) {
    let randomNumber = rand(0, roomsArray.length - 1);   
    let auroraX = (rand(roomsArray[randomNumber].corner_x + 1,
        roomsArray[randomNumber].corner_x - 1 + roomsArray[randomNumber].size_x) - 0.5) * scene.tile_size;
    let auroraY = (rand(roomsArray[randomNumber].corner_y + 1,
        roomsArray[randomNumber].corner_y - 1 + roomsArray[randomNumber].size_y) - 0.5) * scene.tile_size;
    return scene.characterFactory.buildCharacter('playerCar', 200, 200, {player: true});    
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
