export function get_random_int(min, max)
{
    return min + Math.floor(Math.random() * (max + 1 - min)); //Максимум не включается, минимум включается
}

export function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

export function createBlank2DArray(width) {
    let result = new Array();
    for (let x = 0; x < width; x++) {
        result[x] = new Array();
    }

    return result;
}

export function asignZeroToAllElements(array, width, height) {    
    for (let w = 0; w < width; w++) {        
        for (let h = 0; h < height; h++) {
            array[w][h] = 0;
        }
    }    
}

export function copy2DArray(originalArray) {
    let result = createBlank2DArray(originalArray.length);
    for (let w = 0; w < originalArray.length; w++) {        
        for (let h = 0; h < originalArray[0].length; h++) {
            result[w][h] = originalArray[w][h];
        }
    }    

    return result;
}