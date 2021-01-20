import {get_random_int as rand} from "./accessory_functions";
import Rectangle from "./rectangle";

import { MIN_LEAF_SIZE, MIN_ROOM_SIZE } from "../../../scenes/scene_taxi";

export default class Leaf{
 
    //let y:int, x:int, width:int, height:int; // положение и размер этого листа
/*
    let leftChild:Leaf; // левый дочерний Leaf нашего листа
    let rightChild:Leaf; // правый дочерний Leaf нашего листа
    let room:Rectangle; // комната, находящаяся внутри листа
    let halls:Vector.; // коридоры, соединяющие этот лист с другими листьями
*/
    //Leaf(X:int, Y:int, Width:int, Height:int)
    leftChild;
    rightChild;
    room;
    //halls;
    
    constructor(X, Y, Width, Height)
    {
    // инициализация листа
        this.x = X;
        this.y = Y;
        this.width = Width;
        this.height = Height;
        //this.halls = [];
    }

    split()
    {
        // начинаем разрезать лист на два дочерних листа
        if (this.leftChild != undefined || this.rightChild != undefined)
            return false; // мы уже его разрезали! прекращаем!

        // определяем направление разрезания
        // если ширина более чем на 25% больше высоты, то разрезаем вертикально
        // если высота более чем на 25% больше ширины, то разрезаем горизонтально
        // иначе выбираем направление разрезания случайным образом
        //let splitH = FlxG.random() > 0.5;
        let splitH = Math.random() > 0.5;
        if (this.width > this.height && this.width / this.height >= 1.25)
        {
            splitH = false;
        }
        else
        {
            if (this.height > this.width && this.height / this.width >= 1.25)
            {
                splitH = true;
            }
        }

        let max = (splitH ? this.height : this.width) - MIN_LEAF_SIZE; // определяем максимальную высоту или ширину
        if (max <= MIN_LEAF_SIZE)
        {
            return false; // область слишком мала, больше её делить нельзя...
        }

        // определяемся, где будем разрезать       

        let split = 2 * rand(MIN_LEAF_SIZE / 2, max / 2);

        // создаём левый и правый дочерние листы на основании направления разрезания
        if (splitH)
        {
            this.leftChild = new Leaf(this.x, this.y, this.width, split);
            this.rightChild = new Leaf(this.x, this.y + split, this.width, this.height - split);
        }
        else
        {
            this.leftChild = new Leaf(this.x, this.y, split, this.height);
            this.rightChild = new Leaf(this.x + split, this.y, this.width - split, this.height);
        }

        return true; // разрезание выполнено!
    }

    // часть 3: Создание комнат; Поэтому добавим в класс Leaf эту функцию:
    // добавил менно в класс, тут оставляю пометку об этом
    createRooms(roomsArray)
    {                
        // эта функция генерирует все комнаты и коридоры для этого листа и всех его дочерних листьев.
        if (this.leftChild != undefined || this.rightChild != undefined) // добавил везде this.
        {
            // этот лист был разрезан, поэтому переходим к его дочерним листьям
            if (this.leftChild != undefined)
            {
                this.leftChild.createRooms(roomsArray);
            }
            if (this.rightChild != null)
            {
                this.rightChild.createRooms(roomsArray);
            }
        }
        else
        {            
            // этот лист готов к созданию комнаты
            // размер комнаты может находиться в промежутке от 3 x 3 тайла до размера листа - 2.
            //roomSize = new Point(Registry.randomNumber(3, width - 2), Registry.randomNumber(3, height - 2)); // что за Point?
            let size_x = 2 * rand(MIN_ROOM_SIZE / 2, (this.width - 4) / 2);            
            let size_y = 2 * rand(MIN_ROOM_SIZE / 2, (this.height - 4) / 2);            
            // располагаем комнату внутри листа, но не помещаем её прямо
            // рядом со стороной листа (иначе комнаты сольются)
            //roomPos = new Point(Registry.randomNumber(1, width - roomSize.x - 1), Registry.randomNumber(1, height - roomSize.y - 1));
            let rectangle_corner_x = 2 * rand(1, (this.width - size_x - 2) / 2);
            let rectangle_corner_y = 2 * rand(1, (this.height - size_y - 2) / 2);            
            this.room = new Rectangle(this.x + rectangle_corner_x, this.y + rectangle_corner_y, size_x, size_y);
            roomsArray.push(this.room);
        }        
    }

    get_room()
    {
        if (this.room != undefined)
        {
            return this.room;
        }
        else
        {
            let left_room = this.leftChild.get_room();
            let right_room = this.rightChild.get_room();

            if (Math.random() >= 0.5)
            {
                return left_room;
            }
            else
            {
                return right_room;
            }
        }
    }
}






