import {rollDice, getTotal} from "./core"

export type attackOutcome = {
 attacker: number
 attackerDamage: number
 defender: number
 defenderDamage: number
 winner: string 
}

export function attack (attacker:number, defender:number) {
   

    // Roll the dice for Attacker
    const attackerDice: number[] = rollDice(attacker)
    attackerDice.sort()

    const attackerTotal: number = getTotal(attackerDice)
    const maxAttackerDice: number = attackerDice[attacker-1]
    const minAttackerDice: number = attackerDice[0]

     log('attack: '+attackerTotal+'  '+minAttackerDice+' '+maxAttackerDice)

    // Roll the dice for Defender
    const defenderDice: number[] = rollDice(defender)
    defenderDice.sort()

    const defenderTotal: number = getTotal(defenderDice)
    const maxDefenderDice: number = defenderDice[defender-1]
    const minDefenderDice: number = defenderDice[0]

     log('def: '+defenderTotal+'  '+minDefenderDice+' '+maxDefenderDice)

    const results:attackOutcome = {attacker:0,attackerDamage:0, defender: 0,defenderDamage:0,winner:''}

    if (attackerTotal>defenderTotal){
        // log('attacker wins')

        //determine damage
        let damage: number = 0
        
        for (let i = 0; i < attackerDice.length; i++){
            if (attackerDice[i]<minDefenderDice)
            damage++
        }
        let remaining: number = attacker - damage

        results.attacker = remaining
        results.attackerDamage = damage
        results.defenderDamage = defenderDice.length
        results.defender = 0
        results.winner = 'attacker'
        // log('attack strength '+attacker +' damage dealt '+damage +' remaining '+remaining)
        
    } else {
        // log('defender wins')
        //determine damage
        let damage: number = 0
                
        for (let i = 0; i < defenderDice.length; i++){
            if (defenderDice[i]<=minAttackerDice)
            damage++
        }
        let remaining: number = defender - damage

        results.attacker = 0
        results.attackerDamage = attackerDice.length
        results.defenderDamage = damage
        results.defender = remaining
        results.winner = 'defender'

    }
            
    return results
    
  }

