export const Card = class {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    
    }

}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

export const SUITS = ["H", "D", "S", "C"]
export function createDeck() {
    const result = []
    for (let i =0; i < SUITS.length; i++) {
        for (let j = 0; j < 13; j++){
            result.push(new Card(SUITS[i], j+1))
        }
    }

    shuffleArray(result);
    return result;
}



export const Hand = class {
    constructor(cards) {
        this.cards = cards;
    }
}

export const Hands = class {
    constructor(playerCount) {
        const hands = []
        const cardCount = 4;
        const deck = createDeck();

        for(let i = 0; i< playerCount; i++) {
            const playerHand = []
            for(let j = 0; j< cardCount; j++) {
                playerHand.push(deck.pop());

            }
            hands.push(new Hand(playerHand));
        }
        this.hands = hands;
    }
}

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
function* combinations(items, size) {
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

function scoreFifteen(cards) {
    const sum = cards.reduce(
        (accumulator, card) => accumulator + Math.min(10, card.number),
    0);
    if (sum === 15) {
        // console.log("15:", cards)
        return 2;
    }
    return 0;
}

function scoreRun(cards) {
    let numbers = cards.map((card) => card.number);
    numbers = numbers.sort(function(a, b) {
        return a - b;
      });


    const sortedSets = []
    let current = [numbers[0]]
    sortedSets.push(current)
    for(let i=1; i< cards.length; i++){
        if (current[current.length - 1] +1 === numbers[i]) {
            current.push(numbers[i])
        } else {
            current = [numbers[i]]
            sortedSets.push(current)
        }
    }

    const runLength = sortedSets.reduce(
        (accumulator, sublist) => Math.max(accumulator, sublist.length),
    0);

    if (runLength < 3) {
        return 0;
    }else{
        // console.log("run:", runLength)
        return runLength;
    }
}

export function score(cards) {
    // console.log(cards);
    let total = 0;
    for (let comboLength = 0; comboLength < cards.length; comboLength++) {
        for(const combo of combinations(cards, comboLength) ) {
            total += scoreFifteen(combo)
            if (comboLength === 2) {
                if (combo[0].number === combo[1].number) {
                    // pair
                    total += 2;
                }
            }
        }
    }
    total += scoreRun(cards)
    return total
    // console.log(combinations(cards, 1));
    // console.log();

}


// let hand = new Hands(2);

// console.log(score(hand.hands[0].cards));

const deck = createDeck();
let scores = []

let count = 0;
for (const hand of combinations(deck, 6)){
    count +=1;
    let s = score(hand);
    if (s > 10){
        scores.push([hand, s])
    }
    if (count % 1000000 === 0) {
        console.log(`... ${count}`)
    }
}
console.log("count:", count)
scores = scores.sort(function (a, b) {
    // console.log(a[1])
    return b[1] - a[1]
})
// console.log("hands", hands.length)
// console.log(scores)
// console.log(scores[0][1],scores[0][0])
console.log(scores[0][1], scores[0][0])
