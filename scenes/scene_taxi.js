import buildLevel from "../src/utils/level_procedural_generator/level-builder";
import CharacterFactory from "../src/characters/character_factory";
import Union from "../src/ai/steerings/union"
import Group from "../src/characters/group";
import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'
import playerCar from '../assets/sprites/cars/playerCar.png';
import punkSpriteSheet from '../assets/sprites/characters/punk.png'
import blueSpriteSheet from '../assets/sprites/characters/blue.png'
import yellowSpriteSheet from '../assets/sprites/characters/yellow.png'
import greenSpriteSheet from '../assets/sprites/characters/green.png'
import slimeSpriteSheet from '../assets/sprites/characters/slime.png'
import streetTileSetSheet from "../assets/streetTilesets/asphalt.png";
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";
import EffectsFactory from "../src/utils/effects-factory";
import tilemapPng from '../assets/tileset/Dungeon_Tileset.png';
import {createRoadMapSegments} from "../src/utils/evseenko_chukhin/roadSegmentsCreation";
import CellularAutomataMapGenerator from '../src/utils/automata_generator/map-generator';
import CellularAutomataLevelBuilder from '../src/utils/automata_generator/level-builder';
import { TILES } from '../src/utils/automata_generator/tiles';
import { fillRoadMap } from "../src/utils/evseenko_chukhin/roadMap";
import { fillTilemapArray } from"../src/utils/evseenko_chukhin/tilemapArray";
import { createSectorMapBasedOn } from "../src/utils/evseenko_chukhin/sectorMap";
import { get_random_int as rand } from "../src/utils/evseenko_chukhin/accessory_functions";
import {
        createSceneLayers, 
        settingWorld, 
        putTilesOnLayers, 
        createPlayerCar, 
        setCameraParametersFor, 
        addDebugGraphicsFor
    } from "./scene_taxi_acessoryFunctions";

export const sectorTileSize = 4;        // !!! КРАТЕН 2 (sectorSize - количество тайлов одного сектора по ширине и высоте)
export const MAX_LEAF_SIZE = 20;           // !!! КРАТЕН 2 
export const MIN_LEAF_SIZE = 6;    // !!! КРАТЕН 2
export const MIN_ROOM_SIZE = 2;     // !!! КРАТЕН 2; меньше MIN_LEAF_SIZE на 4 (как минимум)
export const width = 54;                  // !!! КРАТЕН 2; width = ширина игрового поля + 4
export const height = 54;                 // !!! КРАТЕН 2; height = высота игрового поля + 4
export const tileSize = 32;             //Размер тайла

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
        this.load.spritesheet("streetTileSet", streetTileSetSheet, this.streetTileSetFrameConfig);
        this.load.spritesheet('blue', blueSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('green', greenSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('yellow', yellowSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('punk', punkSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('slime', slimeSpriteSheet, this.slimeFrameConfig);
        this.load.audio('footsteps', Footsteps);
        //this.effectsFactory = new EffectsFactory(this);
    },

    create: function () {
        this.gameObjects = [];
        this.characterFactory = new CharacterFactory(this);
        this.level++;
        this.tileSize = tileSize;
        //this.effectsFactory.loadAnimations();

        let segments = createRoadMapSegments(this);
        //console.log(segments);
        let roomsArray = segments.roomRectangles;
        let roadMap = fillRoadMap(roomsArray);
        //console.log(roadMap);
        let sectorMap = createSectorMapBasedOn(roomsArray);
        //console.log(sectorMap);
        let tilemapArray = fillTilemapArray(roadMap);
        //console.log(tilemapArray);
        let sceneLayers = createSceneLayers(this);       
        settingWorld(this, sceneLayers);
        putTilesOnLayers(sceneLayers, tilemapArray);

        /*let randomNumber = rand(0, roomsArray.length - 1);   
        let playerCarX = (rand(roomsArray[randomNumber].corner_x + 1, roomsArray[randomNumber].corner_x - 1 + roomsArray[randomNumber].size_x) - 0.5) * this.tile_size;
        let playerCarY = (rand(roomsArray[randomNumber].corner_y + 1,
        roomsArray[randomNumber].corner_y - 1 + roomsArray[randomNumber].size_y) - 0.5) * this.tile_size;*/
        this.player = this.characterFactory.buildCharacter('playerCar', 200, 200, {player: true}); 
        //this.player = createPlayerCar(this, roomsArray);         
        this.gameObjects.push(this.player);
        
        //console.log(this);

        /*scene.physics.add.collider(scene.player, groundLayer);
        scene.physics.add.collider(scene.player, stuffLayer);
        scene.physics.add.collider(scene.player, outsideLayer);*/

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