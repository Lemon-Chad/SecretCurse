
function createMutex() {
    return [0];
}

function lock(mutex) {
    while (mutex[0] == 1)
        continue;
    mutex[0] = 1;
}

function unlock(mutex) {
    mutex[0] = 0;
}

export default {
    createMutex,
    lock,
    unlock,
}
