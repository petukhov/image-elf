let _is10x = true;

export const set10X = (is10x: boolean) => {
    _is10x = is10x;
}

export const getMultiplier = () => {
    return _is10x ? 10 : 1;
}