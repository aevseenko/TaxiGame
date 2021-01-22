//import { PhaserMath } from "phaser";
import Mine from "./mine";
import Vector from "../accessoryClasses/vector.js"
import Car from "./car";

//export default class PlayerCar extends Phaser.Physics.Arcade.Sprite{
export default class PlayerCar extends Car {
    constructor(scene, x, y, name, frame, params, unitDirectionVector) {
        //super(scene, x, y, name, frame); // original
        super(scene, x, y, name, frame, unitDirectionVector);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        //this.setScale(0.25);
        this.setCarHalfSizes();

        this.currentSpeed = 0;
        this.acceleration = 100;

        this.leftVector = new Vector(-1, 0);
        this.upVector = new Vector(0, -1);
        this.rightVector = new Vector(1, 0);
        this.downVector = new Vector(0, 1);
        //????????????????????????????
        //this.unitDirectionVector = unitDirectionVector;
        //this.angle = this.unitDirectionVector.angleInDegrees();
        this.buttonLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.buttonUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.buttonRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.buttonDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        this.gearUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.gearDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.gearUpIsReadyForSwitch = true;
        this.gearDownIsReadyForSwitch = true;
        this.gearCount = 0;
    }

    setCarHalfSizes() {
        let size1 = this.displayWidth;
        let size2 = this.displayHeight;
        this.carHalfLength = Math.max(size1, size2) / 2;
        this.carHalfWidth = Math.min(size1, size2) / 2;
    }

    update() {
        const body = this.body;

        if (!this.engineGear1Sound.isPlaying) // вооот так норм
        {
            this.engineGear1Sound.play();
            this.engineGear1Sound.pause();
        }
        else this.engineGear1Sound.pause();

        if (!this.engineGear2Sound.isPlaying) // вооот так норм
        {
            this.engineGear2Sound.play();
            this.engineGear2Sound.pause();
        }
        else this.engineGear2Sound.pause();

        if (!this.engineGear3Sound.isPlaying) // вооот так хорошо
        {
            this.engineGear3Sound.play();
            this.engineGear3Sound.pause();
        }
        else this.engineGear3Sound.pause();

        if (!this.engineGear4Sound.isPlaying) // вооот так хорошо
        {
            this.engineGear4Sound.play();
            this.engineGear4Sound.pause();
        }
        else this.engineGear4Sound.pause();

        if (!this.engineGear5Sound.isPlaying) // вооот так хорошо
        {
            this.engineGear5Sound.play();
            this.engineGear5Sound.pause();
        }
        else this.engineGear5Sound.pause();

        if (!this.engineGear6Sound.isPlaying) // вооот так хорошо
        {
            this.engineGear6Sound.play();
            this.engineGear6Sound.pause();
        }
        else this.engineGear6Sound.pause();

        //this.engineGear2Sound.pause();
        //this.currentSpeed = this.updateSpeed(); // works
        //this.currentSpeed = this.updateSpeed(gearCount);
        this.currentSpeed = this.updateSpeed();
        let cursorResultVector = this.updateDirection();
        let crossZCoordinate = cursorResultVector.crossZCoordinate(this.unitDirectionVector);

        let rotationDirection = -1;
        if (this.currentSpeed < 0) {
            rotationDirection = 1;
        }
        this.unitDirectionVector.rotateOnAngleInDegrees(rotationDirection * crossZCoordinate * 5);
        this.angle = this.unitDirectionVector.angleInDegrees();
        body.velocity.x = this.currentSpeed * this.unitDirectionVector.x;
        body.velocity.y = this.currentSpeed * this.unitDirectionVector.y;

        this.updateBodyBoundingSizes();
        /*if (this.abilities.includes('mines'))
        {
            if (cursors.space.isDown && this.scene.time.now - this.lastMineTime > 1000) {
                this.lastMineTime = this.scene.time.now;
                this.scene.characterFactory.buildMine(this.body.x, this.body.y);
            }
        }*/
        //this.body.setAcceleration()

        /*if (cursors.left.isDown) {
            body.velocity.x -= speed;
        } else if (cursors.right.isDown) {
            body.velocity.x += speed;
        }

        // Vertical movement
        if (cursors.up.isDown) {
            body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            body.setVelocityY(speed);
        }*/
        //this.updateAnimation();
    };

    updateDirection() {
        let result = new Vector(0, 0);
        if (this.currentSpeed != 0) {
            if (this.buttonLeft.isDown) {
                result.add(this.leftVector);
            }

            if (this.buttonUp.isDown) {
                result.add(this.upVector);
            }

            if (this.buttonRight.isDown) {
                result.add(this.rightVector);
            }

            if (this.buttonDown.isDown) {
                result.add(this.downVector);
            }

            /* // плохая идея, звук так себе
            if (!this.turnSound.isPlaying && (this.buttonLeft.isDown ||
                this.buttonUp.isDown || this.buttonRight.isDown || this.buttonDown.isDown))
            {
                this.turnSound.play();
            }

             */
        }

        return result;
    }

    updateBodyBoundingSizes() {
        let vd = this.unitDirectionVector.copy();
        vd.multiply(this.carHalfLength);
        let minus_vd = vd.copy();
        minus_vd.multiply(-1);

        let vn = this.unitDirectionVector.getNormalVector();
        vn.multiply(this.carHalfWidth);
        let minus_vn = vn.copy();
        minus_vn.multiply(-1);


        let c1 = vd.copy();
        c1.add(vn);

        let c2 = vd.copy();
        c2.add(minus_vn);

        let c3 = minus_vd.copy();
        c3.add(vn);

        let c4 = minus_vd.copy();
        c4.add(minus_vn);

        let sizes = this.getBoundingBoxWidthAndHeight([c1, c2, c3, c4]);
        this.body.setSize(sizes.width / this.scale, sizes.height / this.scale);
    }

    getBoundingBoxWidthAndHeight(vectorArray) {
        let minX = vectorArray[0].x;
        let maxX = vectorArray[0].x;

        let minY = vectorArray[0].y;
        let maxY = vectorArray[0].y;

        for (let i = 1; i < vectorArray.length; i++) {
            if (vectorArray[i].x < minX) {
                minX = vectorArray[i].x;
            }

            if (vectorArray[i].x > maxX) {
                maxX = vectorArray[i].x;
            }

            if (vectorArray[i].y < minY) {
                minY = vectorArray[i].y;
            }

            if (vectorArray[i].y > maxY) {
                maxY = vectorArray[i].y;
            }
        }

        return {width : Math.abs(minX) + Math.abs(maxX),
            height : Math.abs(minY) + Math.abs(maxY)};
    }

    updateSpeed() {
        let newSpeed = this.currentSpeed;
        let isGearPlaying = this.switchGearSound.isPlaying;
        let isEngineStartPlaying = this.engineStartSound.isPlaying;
        let isEngineStopPlaying = this.engineStopSound.isPlaying;
        let newGearCount = this.gearCount;

///*
        let engineSound = this.engineGear1Sound;
        //engineSound.play();
        //engineSound.pause();
        //this.engineGear2Sound.play();
        //this.engineGear2Sound.pause();

        switch (newGearCount) {
            //case 0:                         // при нуле стоим
            //this.game.sound.stopAll();  // проверить сработает ли 1 - no
            //this.scene.sound.stopAll(); // проверить сработает ли 2 - yes
            //break;

            case 1:
                //engineSound.stop();
                engineSound = this.engineGear1Sound;
                engineSound.resume();
                break;

            case 2:
                //engineSound.stop();
                engineSound = this.engineGear2Sound;
                engineSound.resume();
                break;

            case 3:
                //engineSound.stop();
                engineSound = this.engineGear3Sound;
                engineSound.resume();
                break;

            case 4:
                //engineSound.stop();
                engineSound = this.engineGear4Sound;
                engineSound.resume();
                break;

            case 5:
                //engineSound.stop();
                engineSound = this.engineGear5Sound;
                engineSound.resume();
                break;

            case 6:
                //engineSound.stop();
                engineSound = this.engineGear6Sound;
                engineSound.resume();
                break;

            default:
                //this.game.sound.stopAll();  // проверить сработает ли 1 - no
                //this.scene.sound.stopAll(); // проверить сработает ли 2 - yes
                break;
        }
//*/
        //console.log("isEngineStartPlaying before if", isEngineStartPlaying);
        if (this.gearUpIsReadyForSwitch && this.gearUp.isDown && this.currentSpeed < this.maxSpeed)
        {
            newSpeed += this.acceleration;
            //gearCount++;
            newGearCount++;
            console.log("gearCount in ++ update = ", newGearCount);
            //if (!isGearPlaying)
            if(this.currentSpeed == 0 && newSpeed >= this.currentSpeed) // проверка состояния старта
            {
                //if(this.currentSpeed == 0 && newSpeed >= this.currentSpeed) // проверка состояния старта
                if (!isEngineStartPlaying)
                {
                    this.engineStartSound.play();
                    //console.log("isEngineStartPlaying after .play()", isEngineStartPlaying);
                    //this.engineGear1Sound.play(); // что-то там щелкает в обоих версиях, хз как обрезать
                }
            }
            if (!isGearPlaying && !isEngineStartPlaying && this.currentSpeed >= this.acceleration)
            {
                //console.log("isEngineStartPlaying in switchGear if", isEngineStartPlaying);
                this.switchGearSound.play();
                //console.log('gear switched');
            }
        }

        this.gearUpIsReadyForSwitch = this.gearUp.isUp;

        if (this.gearDownIsReadyForSwitch && this.gearDown.isDown && this.currentSpeed > this.minSpeed)
        {
            newSpeed -= this.acceleration;
            //gearCount--;
            newGearCount--;
            if (!isGearPlaying)
            {
                this.switchGearSound.play();
                //console.log('gear switched');
                if (newSpeed == 0)
                {
                    // звук выключения двигателя
                    this.engineStopSound.play();
                }
            }
        }

        this.gearDownIsReadyForSwitch = this.gearDown.isUp;

        if (this.newSpeed !== 0) // двигатель не выключен
        {
            //engineSound.resume();
        }
        this.gearCount = newGearCount;
        //console.log("gearCount in end of update = ", this.gearCount);
        return newSpeed;
        //return [newSpeed, gearCount];
    }

    /*updateAnimation() {
        const animations = this.animationSets.get('Walk');
        const animsController = this.anims;
        const x = this.body.velocity.x;
        const y = this.body.velocity.y;
        if (x!==0 || y !== 0 && this.footstepsMusic.isPaused)
        {
            this.footstepsMusic.resume();
        }
        if (x < 0) {
            animsController.play(animations[0], true);
        } else if (x > 0) {
            animsController.play(animations[1], true);
        } else if (y < 0) {
            animsController.play(animations[2], true);
        } else if (y > 0) {
            animsController.play(animations[3], true);
        } else {
            this.footstepsMusic.pause();
            const currentAnimation = animsController.currentAnim;
            if (currentAnimation) {
                const frame = currentAnimation.getLastFrame();
                this.setTexture(frame.textureKey, frame.textureFrame);
            }
        }*/
}
