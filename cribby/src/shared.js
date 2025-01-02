import combinations from "./combinations.js";

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

export const Deck = class {
    constructor() {
        const result = []
        for (let i =0; i < SUITS.length; i++) {
            for (let j = 0; j < 13; j++){
                result.push(new Card(SUITS[i], j+1))
            }
        }
    
        this.cards = result;
    }

    deal(handSize) {
        const hand = []
        shuffleArray(this.cards);

        for(let j = 0; j< handSize; j++) {
            hand.push(this.cards.pop());
        }
        return hand;
    }
}

function containsCard(cards, card) {
    for(const c of cards) {
        if (c.number === card.number && c.suit === card.suit) {
            return true;
        }
    }
    return false
}

export const Hand = class {
    constructor(cards) {
        this.cards = cards;
    }


    discard() {
        const d = new Deck();

        let keepScores = [];
        for(const rump of combinations(this.cards, 4)) {
            let total = 0
            let cardCount = 0

            let scoringHands = []
            let baseScore = score(rump)
            for(const revealed of d.cards) {
                if(containsCard(this.cards, revealed)) {
                    continue;
                }
                const incScore = score([...rump, revealed])

                if (incScore > baseScore) {
                    scoringHands.push([revealed, incScore])
                //     console.log(incScore)
                //     // console.log(incScore, [...rump, revealed])
                }
                total += incScore
                cardCount += 1
            }
            keepScores.push([rump, total / cardCount, scoringHands])
        }
        keepScores = keepScores.sort(function (a, b) {
            // console.log(a[1])
            return b[1] - a[1]
        })
        console.log(keepScores[0][1], keepScores[0][0])
        console.log(keepScores[1][1], keepScores[1][0])

        // console.log(keepScores[0][1], keepScores[0][0], keepScores[0][2])
        // console.log(keepScores[1][1], keepScores[1][0], keepScores[1][2])

        for(let i = this.cards.length - 1; i>=0; i--) {
            if(!containsCard(keepScores[0][0], this.cards[i])) {
                this.cards.splice(i, 1);
            }
        }

    }
}

export const Hands = class {
    constructor(playerCount) {
        const hands = []
        const cardCount = 4;
        const deck = new Deck();

        for(let i = 0; i< playerCount; i++) {
            const playerHand = deck.deal(cardCount)
    
            hands.push(new Hand(playerHand));
        }
        this.hands = hands;
    }

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


function findBestHand() {
    const deck = createDeck();
    let scores = []

    let count = 0;
    for (const hand of combinations(deck, 5)){
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
}

let deck = new Deck();
let hand = new Hand(deck.deal(6))
// console.log(hand)
// hand.discard();
// console.log(score(hand.cards))

// let hand = new Hand([
//           new Card('C',1 ),
//           new Card('D',1 ),
//           new Card('D', 4 ),
//           new Card('S', 6 ),
//           new Card('D', 6 ),
//           new Card('S',8 )
// ])

console.log(hand.cards);
hand.discard();

console.log(hand.cards);
