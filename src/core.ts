import {getRandomInt} from "./modules/random"

export function rollDice (n:number) {
    const diceRolls:number[] = []

    for (let i = 0; i < n; i++) {
     diceRolls.push(getRandomInt(1, 6))   

    }

    return diceRolls
  }

export function getTotal (n:number[]) {

    let total = 0
    for (let i = 0; i < n.length; i++) {
        total = total + n[i]

    }
    return total
}