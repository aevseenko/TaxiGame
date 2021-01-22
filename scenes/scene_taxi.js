import buildLevel from "../src/utils/level_procedural_generator/level-builder";
import CharacterFactory from "../src/characters/character_factory";
import Union from "../src/ai/steerings/union"
import Group from "../src/characters/group";
import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'
import playerCar from '../assets/sprites/cars/playerCar.png';
import npcCar from '../assets/sprites/cars/npcCar.png';
import debugArrows from "../assets/streetTilesets/debugArrows/whiteArrows.png"
import Vector from "../src/accessoryClasses/vector";
import punkSpriteSheet from '../assets/sprites/characters/punk.png'
import blueSpriteSheet from '../assets/sprites/characters/blue.png'
import yellowSpriteSheet from '../assets/sprites/characters/yellow.png'
import greenSpriteSheet from '../assets/sprites/characters/green.png'
import slimeSpriteSheet from '../assets/sprites/characters/slime.png'
import streetTileSetSheet from "../assets/streetTilesets/asphalt.png";
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";

import switchGearSound from "../assets/audio/z_uk-motora-bolid-formuly-1_v8_cutted_v2_switch_gear.wav" //
import engineStartSound from "../assets/audio/Sound_18577_engine_start_v1.mp3"
import engineStopSound from "../assets/audio/stop_engine_v1.mp3"
import engineGear1Sound from "../assets/audio/4_engine_1_v2.mp3"
import engineGear2Sound from "../assets/audio/4_engine_2_v6.mp3"
import engineGear3Sound from "../assets/audio/4_engine_3_v2.mp3"
import engineGear4Sound from "../assets/audio/4_engine_4_v1.mp3"
import engineGear5Sound from "../assets/audio/4_engine_5.mp3"
import engineGear6Sound from "../assets/audio/4_engine_6.mp3"

import EffectsFactory from "../src/utils/effects-factory";
import tilemapPng from '../assets/tileset/Dungeon_Tileset.png';
import {createRoadMapSegments} from "../src/utils/evseenko_chukhin/roadSegmentsCreation";
import CellularAutomataMapGenerator from '../src/utils/automata_generator/map-generator';
import CellularAutomataLevelBuilder from '../src/utils/automata_generator/level-builder';
import { TILES } from '../src/utils/automata_generator/tiles';
import { getRoomMap, getFullRoadMapBasedOn } from "../src/utils/evseenko_chukhin/basicMap";
import { fillTilemapArray, extendTo } from"../src/utils/evseenko_chukhin/tilemapArray";
import { createSectorMap } from "../src/utils/evseenko_chukhin/sectorMapNew";
//import { createSectorMap } from "../src/utils/evseenko_chukhin/sectorMap";
import { get_random_int as rand, createBlank2DArray } from "../src/utils/evseenko_chukhin/accessory_functions";
import { createDebugHallMap } from "../src/utils/evseenko_chukhin/debugHallMap";
import {
        createSceneLayers, 
        settingWorld, 
        putTilesOnLayers, 
        createNPCCars,
        createPlayerCar, 
        setCameraParametersFor, 
        addDebugGraphicsFor
    } from "./scene_taxi_acessoryFunctions";

export const sectorTileSize = 4;        // !!! КРАТЕН 2 (sectorSize - количество тайлов одного сектора по ширине и высоте)
export const MAX_LEAF_SIZE = 20;           // !!! КРАТЕН 2 
export const MIN_LEAF_SIZE = 10;    // !!! КРАТЕН 2
export const MIN_ROOM_SIZE = 4;     // !!! КРАТЕН 2; меньше MIN_LEAF_SIZE на 4 (как минимум)
export const width = 54;                  // !!! КРАТЕН 2; width = ширина игрового поля + 4
export const height = 54;                 // !!! КРАТЕН 2; height = высота игрового поля + 4
export const tileSize = 32;             //Размер тайла
export const debugHallMapWillBeCreated = false;   //Создаётся или нет отладочная карта коридоров между комнатами (дорог)
export const debugArrowsWillBeDrawn = true;   //Будут нарисованы или нет отладочные стрелки направлений секторов
export const npcDistance = 6;

export const hallSize = 2;          // !!! ДРУГИЕ РАЗМЕРЫ НЕ ПРОВЕРЯЛИСЬ !!! КРАТЕН 2 (обозначает ширину дороги в секторах)  
                                                                                           

/*export const sectorTileSize = 4;        // !!! КРАТЕН 2 (sectorSize - количество тайлов одного сектора по ширине и высоте)
export const MAX_LEAF_SIZE = 20;           // !!! КРАТЕН 2 
export const MIN_LEAF_SIZE = 6;    // !!! КРАТЕН 2
export const MIN_ROOM_SIZE = 2;     // !!! КРАТЕН 2; меньше MIN_LEAF_SIZE на 4 (как минимум)
export const width = 54;                  // !!! КРАТЕН 2; width = ширина игрового поля + 4
export const height = 54;                 // !!! КРАТЕН 2; height = высота игрового поля + 4
export const tileSize = 32;             //Размер тайла*/


let scene_taxi = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function StartingScene() {
        Phaser.Scene.call(this, {key: 'scene_taxi'});
    },

    effectsFrameConfig: {frameWidth: 32, frameHeight: 32},
    streetTileSetFrameConfig: {frameWidth: tileSize, frameHeight: tileSize},
    characterFrameConfig: {frameWidth: 31, frameHeight: 31},    
    slimeFrameConfig: {frameWidth: 32, frameHeight: 32},

    preload: function () {
        //this.load.image("islands-tiles", tilemapPng);
        this.load.image("tiles", tilemapPng);
        //loading spitesheets
        //this.load.spritesheet('aurora', auroraSpriteSheet, this.characterFrameConfig);
        //this.load.spritesheet('aurora', small_car, this.small_car);
        this.load.image('playerCar', playerCar);
        this.load.image('npcCar', npcCar);  
        this.load.image('debugArrows', debugArrows);                       
        this.load.spritesheet("streetTileSet", streetTileSetSheet, this.streetTileSetFrameConfig);

        this.load.spritesheet('blue', blueSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('green', greenSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('yellow', yellowSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('punk', punkSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('slime', slimeSpriteSheet, this.slimeFrameConfig);
        this.load.audio('footsteps', Footsteps);
        this.load.audio('switchGearSound', switchGearSound);
        this.load.audio('engineStartSound', engineStartSound);
        this.load.audio('engineStopSound', engineStopSound);
        this.load.audio('engineGear1Sound', engineGear1Sound);
        this.load.audio('engineGear2Sound', engineGear2Sound);
        this.load.audio('engineGear3Sound', engineGear3Sound);
        this.load.audio('engineGear4Sound', engineGear4Sound);
        this.load.audio('engineGear5Sound', engineGear5Sound);
        this.load.audio('engineGear6Sound', engineGear6Sound);
        //this.effectsFactory = new EffectsFactory(this);
    },

    create: function () {
        this.gameObjects = [];
        this.characterFactory = new CharacterFactory(this);
        this.level++;
        this.tileSize = tileSize;
        //this.effectsFactory.loadAnimations();

        //this.player = this.characterFactory.buildCharacter('playerCar', 1200, 1200, {player: true}); // оказывается под картой

        let segments = createRoadMapSegments(this);
        //console.log(segments);
        let roomsArray = segments.roomRectangles;
        let roomMap = getRoomMap(roomsArray);
        let fullBasicRoadMap = getFullRoadMapBasedOn(roomMap, segments.hallRectangles);
        let tilemapArray = fillTilemapArray(fullBasicRoadMap);
        let sectorMap = createSectorMap(fullBasicRoadMap);        
        //let sectorMap = createSectorMap(segments, roomMap);    
        let debugHallMap = null;
        if (debugHallMapWillBeCreated) {
            debugHallMap = createDebugHallMap(segments.hallRectangles);
        }        
        let sceneLayers = createSceneLayers(this);       
        settingWorld(this, sceneLayers);
        putTilesOnLayers(sceneLayers, tilemapArray, debugHallMap, sectorMap);
        this.player = this.characterFactory.buildCharacter('playerCar', 1200, 1200, {player: true}); // пробуем после тайлов, но до npc
        createNPCCars(this, sectorMap)
        /*let sectorIX = roomsArray[roomNumber].corner_x;
        let sectorIY = roomsArray[roomNumber].corner_y + roomsArray[roomNumber].size_y / 2;        
        let sector = sectorMap[sectorIX][sectorIY];        
        let npcX = sector.center.x;
        let npcY = sector.center.y - sectorTileSize * tileSize / 2;
        //Подключит класс Vector
        let unitDirectionVector = new Vector(0, 1); 
        let npcCar = this.characterFactory.buildCharacter("npcCar", npcX, npcY, 
            { 
                unitDirectionVector : unitDirectionVector,
                targetSector : sector,
                sectorMap : sectorMap
             });       
        this.npcCars.push(npcCar);
        this.gameObjects.push(npcCar);*/

        /*let randomNumber = rand(0, roomsArray.length - 1);   
        let playerCarX = (rand(roomsArray[randomNumber].corner_x + 1, roomsArray[randomNumber].corner_x - 1 + roomsArray[randomNumber].size_x) - 0.5) * this.tile_size;
        let playerCarY = (rand(roomsArray[randomNumber].corner_y + 1,
        roomsArray[randomNumber].corner_y - 1 + roomsArray[randomNumber].size_y) - 0.5) * this.tile_size;*/
        //this.player = this.characterFactory.buildCharacter('playerCar', 800, 800, {player: true}); // original
        //this.player = createPlayerCar(this, roomsArray); // in original coomended, but works
        this.gameObjects.push(this.player);
        
        //console.log(this);

        /*
        scene.physics.add.collider(scene.player, groundLayer);
        scene.physics.add.collider(scene.player, stuffLayer);
        scene.physics.add.collider(scene.player, outsideLayer);
        */


        //this.physics.add.collider(this.player, this.NPCCar); // not collide
        //this.physics.add.collider(this.player, this.pedastrianAreaLayer); // not collide

        this.physics.add.collider(this.player, sceneLayers.pedastrianAreaLayer); // work!
        // но машина спавнится вне системы дорог

        //this.physics.add.collider(this.player, sceneLayers.pedastrianAreaLayer);

        setCameraParametersFor(this);        

        addDebugGraphicsFor(this);        
    },

    update: function () {
        if (this.gameObjects) {
            this.gameObjects.forEach( function(element) {
                element.update();
            });
        }
    },

    tileToPixels({ x, y }) {
        return { x: x * this.tileSize, y: y * this.tileSize };
    }   
});
 
export default scene_taxi;