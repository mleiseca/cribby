
function addIndices(items, indices) {
    // console.log("adding", indices);
    const result = [];
    for(let i = 0; i< indices.length; i++) {
        result.push(items[indices[i]])
    }
    return result;
}

function findIndexToChange(indices, size,n) {
    for(let i = size-1; i>=0; i--) {
        // console.log("checking", i, indices[i] , i + n - size)
        if (indices[i] != i + n - size) {
            return i
        // } else {
            // return null;
        }
    }
    return null;
}
export default function* combinations(items, size) {
    // 0123 ==> 012 013 023 123
    // def combinations(iterable, r):
    // pool = tuple(iterable)
    // n = len(pool)
    // if r > n:
    //     return
    // indices = list(range(r))
    // yield tuple(pool[i] for i in indices)
    // n = 4
    // r = 3
    // [0,1,2]
    // [0,1,3]
    // 
    // while True:
    //     for i in reversed(range(r)): [2,1,0]
    //         if indices[i] != i + n - r:
    //             break
    //     else:
    //         return
    //     indices[i] += 1
    //     for j in range(i+1, r):
    //         indices[j] = indices[j-1] + 1
    //     yield tuple(pool[i] for i in indices)

    const results = []
    const indices = []
    const n = items.length;
    for (let i = 0; i< size; i++) {
        indices.push(i)
    }
    yield addIndices(items, indices);

    // console.log("indices", indices);
    while(true) {
        // console.log()
        let indexToChange = findIndexToChange(indices, size, n)
        
        // console.log("indexToChange", indexToChange);
        if (indexToChange === null) {
            return;
        }
        indices[indexToChange] += 1;
        for (let j = indexToChange + 1; j < size; j++) {
            indices[j] = indices[j-1] + 1;
        }
        yield addIndices(items, indices);
        // return;
    }
    // results.push(items.slice(0,size));
    // for(let i = 0; i<size; i++){

    // }
    return;
}