const delaySecond = (seconds) => new Promise((res, rej) => setTimeout(() => res(), 1000 * seconds));
const random = (min, max) => Math.floor(Math.random() * max) + min;

export {
    delaySecond,
    random
};
