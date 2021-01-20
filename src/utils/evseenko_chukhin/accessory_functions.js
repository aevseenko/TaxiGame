export function get_random_int(min, max)
{
    return min + Math.floor(Math.random() * (max + 1 - min)); //Максимум не включается, минимум включается
}

export function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}