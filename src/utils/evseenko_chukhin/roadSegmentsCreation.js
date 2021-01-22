import Leaf from "./leaf";
import { get_random_int as rand } from "./accessory_functions";
import Rectangle from "./rectangle";
import { hallSize } from "../../../scenes/scene_taxi";
import { MAX_LEAF_SIZE, width, height } from "../../../scenes/scene_taxi";

export function createRoadMapSegments(scene) {  

    //Делим игровое поле на зоны 
    //(создаём дерево, листами которого являются данные об отдельной области, в каждую из которых будет помещаться комната)
    let root = new Leaf(2, 2, width - 4, height - 4); 
    let leafs = generateLeafs(root);  

    //Создаём комнаты в листах
    let roomsArray = [];
    root.createRooms(roomsArray);

    //Строим дороги    
    let hallsArray = [];
    create_halls(hallsArray, leafs);

    let result = {
        roomRectangles : roomsArray,
        hallRectangles : hallsArray        
    }

    console.log(result);
    return result;    
}

function generateLeafs(root) {
    let leafs = [];     
    leafs.push(root);
    let did_split = true;
    // циклически снова и снова проходим по каждому листу в нашем leafs, пока больше не останется листьев, которые можно разрезать.
    while (did_split) {
        did_split = false;
        for (let current_leaf of leafs) 
        {            
            if (current_leaf.leftChild == undefined && current_leaf.rightChild == undefined) // если лист ещё не разрезан...
            {
                // если этот лист слишком велик, или есть вероятность 75%...
                if (current_leaf.width > MAX_LEAF_SIZE || current_leaf.height > MAX_LEAF_SIZE || Math.random() > 0.25) {
                    if (current_leaf.split()) // разрезаем лист!
                    {
                        // если мы выполнили разрезание, передаём дочерние листья в Vector, чтобы в дальнейшем можно было в цикле обойти и их
                        leafs.push(current_leaf.leftChild);
                        leafs.push(current_leaf.rightChild);
                        did_split = true;
                    }
                }
            }
        }
    }

    return leafs;
}

function create_halls(hallsArray, leafs) {
    for (let current_leaf of leafs)
    {
        if (current_leaf.leftChild != undefined && current_leaf.rightChild != undefined)
        {
            let room1 = current_leaf.leftChild.get_room();
            let room2 = current_leaf.rightChild.get_room();
            let x1 = 2 * rand((room1.corner_x + hallSize) / 2, (room1.corner_x + room1.size_x) / 2);
            let y1 = 2 * rand((room1.corner_y + hallSize) / 2, (room1.corner_y + room1.size_y) / 2);
            let x2 = 2 * rand((room2.corner_x + hallSize) / 2, (room2.corner_x + room2.size_x) / 2);
            let y2 = 2 * rand((room2.corner_y + hallSize) / 2, (room2.corner_y + room2.size_y) / 2);
            let minX = Math.min(x1, x2) - hallSize;
            let minY = Math.min(y1, y2) - hallSize;
            let maxX = Math.max(x1, x2) - hallSize;
            let maxY = Math.max(y1, y2) - hallSize;
            let width = x1 - x2;
            let height = y1 - y2;
            let mainDiag = width * height >= 0;
            let choise = Math.random() >= 0.5;

            //TODO: Убрать 2
            width = Math.abs(width) + hallSize;
            height = Math.abs(height) + hallSize;
            let horX, horY, vertX, vertY;
            if (choise)
            {
                horX = minX;
                horY = minY;
            }
            else
            {
                horX = minX;
                horY = maxY;
            }
            if (choise && mainDiag || !choise && !mainDiag)
            {
                vertX = maxX;
                vertY = minY;
            }
            else
            {
                vertX = minX;
                vertY = minY;
            }
            
            if (height > hallSize)
            {
                let rectangle = new Rectangle(vertX, vertY, hallSize, height);
                hallsArray.push(rectangle);

            }
            if (width > hallSize)
            {
                let rectangle = new Rectangle(horX, horY, width, hallSize);
                hallsArray.push(rectangle);
            }
        }
    }
}

/*function create_halls(hallsArray, leafs)
{
    for (let current_leaf of leafs)
    {
        if (current_leaf.leftChild != undefined && current_leaf.rightChild != undefined)
        {
            let room1 = current_leaf.leftChild.get_room();
            let room2 = current_leaf.rightChild.get_room();
            let x1 = rand(room1.corner_x + hallSize, room1.corner_x + room1.size_x - hallSize);
            let y1 = rand(room1.corner_y + hallSize, room1.corner_y + room1.size_y - hallSize);
            let x2 = rand(room2.corner_x + hallSize, room2.corner_x + room2.size_x - hallSize);
            let y2 = rand(room2.corner_y + hallSize, room2.corner_y + room2.size_y - hallSize);
            let minX = Math.min(x1, x2) - hallSize;
            let minY = Math.min(y1, y2) - hallSize;
            let maxX = Math.max(x1, x2) - hallSize;
            let maxY = Math.max(y1, y2) - hallSize;
            let width = x1 - x2;
            let height = y1 - y2;
            let mainDiag = width * height >= 0;
            let choise = Math.random() >= 0.5;
            width = Math.abs(width) + 2 * hallSize;
            height = Math.abs(height) + 2 * hallSize;
            let horX, horY, vertX, vertY;
            if (choise)
            {
                horX = minX;
                horY = minY;
            }
            else
            {
                horX = minX;
                horY = maxY;
            }
            if (choise && mainDiag || !choise && !mainDiag)
            {
                vertX = maxX;
                vertY = minY;
            }
            else
            {
                vertX = minX;
                vertY = minY;
            }
            if (height > hallSize)
            {
                let rectangle = new Rectangle(vertX, vertY, 2 * hallSize, height);
                rectangleArray.push(rectangle);

            }
            if (width > hallSize)
            {
                let rectangle = new Rectangle(horX, horY, width, 2 * hallSize);
                rectangleArray.push(rectangle);
            }
        }
    }
}*/