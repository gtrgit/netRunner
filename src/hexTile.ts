import resources from './resources'
import { HexSelector } from './hexSelector' 
import { Dash_AnimationQueue, Dash_Ease, } from "dcldash"
import { DashAnim } from './dash_anim'
import {attack} from './attack'
// import { PlayerFlags } from './board'

@Component("playerFlag")
export class PlayerFlag {}


// @Component("playerFlags")
// export class PlayerFlags {
//   playerTile: string = ''
//   aiTile: string = ''
//   neturalTile: string = ''
//   aetheriaTile: string = ''
// }




 export type tileAttributes = {
  tileId: string,
  tileTransform: Vector3
  tileOwner: string
  icePoints: number
}

export type attackSelector = {
  northEastId: string,
  northWestId: string,
  eastId: string,
  westId: string,
  southEastId: string,
  southWestId: string
}

export type moveSelector = {
  northEastId: string,
  northWestId: string,
  eastId: string,
  westId: string,
  southEastId: string,
  southWestId: string
}


export type attackOutcome = {
  attacker: number
  attackerDamage: number
  defender: number
  defenderDamage: number
  winner: string
 }

@Component("tileInfo")
export class TileInfo  {
  tileId: string = ''
  tileTransform: Vector3 = new Vector3
  tileOwner: string = ''
  icePoints: number = 0
}

@Component("icePoints")
export class IcePoints {
  icePoints: number = 0
  icePointTextId: string = ''

}
export class HexTile extends Entity {

   
    private physicsCast: PhysicsCast =  PhysicsCast.instance

    // private playerTiles = engine.getComponentGroup(PlayerFlag)
    // // private playerFlags: PlayerFlags = new PlayerFlags()

    private initialTile: GLTFShape = resources.models.hexBlue
    private blueTile:GLTFShape= resources.models.hexBlue
    private greenTile:GLTFShape= resources.models.hexGreen
    private redTile:GLTFShape= resources.models.hexRed
    private orangeTile:GLTFShape= resources.models.hexOrange
    
    private icePointTextEntity: Entity = new Entity('iceValue')
    private icePointText: TextShape = new TextShape('')
    private icePointTextTransform: Transform = new Transform({position: new Vector3(0,.3,0),rotation: Quaternion.Euler(90,0,0)})

    private currentColour = Color3.Yellow()
    private selectedTransform: Transform = new Transform({position: new Vector3(1,.3,1),rotation: Quaternion.Euler(90,0,0),scale: new Vector3(1,1,1)})
   
    private selectedTileId: string = ''
   
    private attackResults:attackOutcome = {attacker:0,attackerDamage:0,defender: 0,defenderDamage:0,winner:''}
    // private attackerStrength: number = 0
    // private attackerDamage: number = 0
    // private defenderStrength: number = 0
    // private defenderDamage: number = 0
    
    private tileAttributes: tileAttributes = {tileId:'',tileTransform: new Vector3(0,0,0),tileOwner:'',icePoints:0}
    // private attackResult:Attack =  attack
    constructor(
        
        transform: TranformConstructorArgs,
        parentId: string,
        tileAttributes: tileAttributes,
        playerSelectedTileId: string,
        enemySelectedTileId: string,
        attackSelector: attackSelector,
        moveSelector:moveSelector
      ) {
        super()
        engine.addEntity(this)
        
        //Tile initial shape
        this.addComponent(this.initialTile)
        this.addComponent(new Transform(transform))

        this.tileAttributes = tileAttributes

        this.addComponent(new TileInfo())
        
        this.getComponent(TileInfo).tileTransform = tileAttributes.tileTransform
        this.getComponent(TileInfo).tileOwner = tileAttributes.tileOwner
        this.getComponent(TileInfo).tileId = this.uuid
        this.getComponent(TileInfo).icePoints = tileAttributes.icePoints
        

        this.addComponent(new IcePoints).icePoints = tileAttributes.icePoints
       


        //Change initial tile shape if player or enemy
        if(tileAttributes.tileOwner=='player'){
          engine.entities[this.uuid].removeComponent(GLTFShape)
          let ownerPlayer = this.greenTile
          this.addComponentOrReplace(ownerPlayer)
          tileAttributes.tileOwner = 'player'
        }

        if(tileAttributes.tileOwner=='enemy'){
          engine.entities[this.uuid].removeComponent(GLTFShape)
          let ownerPlayer = this.redTile
          this.addComponentOrReplace(ownerPlayer)
          tileAttributes.tileOwner = 'enemy'
        }

        if(tileAttributes.tileOwner=='aetheria'){
          engine.entities[this.uuid].removeComponent(GLTFShape)
          let ownerPlayer = this.orangeTile
          this.addComponentOrReplace(ownerPlayer)
          tileAttributes.tileOwner = 'aetheria'
        }


        this.getComponent(IcePoints).icePointTextId = this.icePointTextEntity.uuid
        this.icePointTextEntity.setParent(this)
        this.icePointTextEntity.addComponent(this.icePointText)
        this.icePointTextEntity.addComponent(this.icePointTextTransform)
        this.icePointTextEntity.addComponent(new Billboard)
        
        this.icePointText.value = this.getComponent(IcePoints).icePoints.toString() //tileAttributes.icePoints.toString()
        this.icePointText.fontSize = 2
        this.icePointText.outlineColor = Color3.Black()
        this.icePointText.outlineWidth = .2
        
        
        tileAttributes.tileId = this.uuid
        // todo: determi

        const parentPos: Vector3 = engine.entities[parentId].getComponent(Transform).position
        const localRayOrigin: Vector3 = this.getComponent(Transform).position
        const globalRayOrigin: Vector3 = Vector3.Add(parentPos, localRayOrigin)

        const localNorthRayDir: Vector3 = new Vector3(globalRayOrigin.x, globalRayOrigin.y, globalRayOrigin.z+1)
        // log('global '+globalRayOrigin)
        // log('local '+localRayOrigin)
        
        let northEastDirection = new Vector3(1,0,1)
        let northWestDirection = new Vector3(-1,0,1)
        let eastDirection = new Vector3(1,0,0)
        let westDirection = new Vector3(-1,0,0)
        
        let southEastDirection = new Vector3(1,0,-1)
        let southWestDirection = new Vector3(-1,0,-1)

        
        const northWestRay: Ray = {origin: globalRayOrigin, direction: northWestDirection, distance: 1}
        const northEastRay: Ray = {origin: globalRayOrigin, direction: northEastDirection, distance: 1}
        const eastRay: Ray = {origin: globalRayOrigin, direction: eastDirection, distance: 1}
        const westRay: Ray = {origin: globalRayOrigin, direction: westDirection, distance: 1}
        const southEastRay: Ray = {origin: globalRayOrigin, direction: southEastDirection, distance: 1}
        const southWestRay: Ray = {origin: globalRayOrigin, direction: southWestDirection, distance: 1}
        
        // this.growHex(this.uuid)

        new DashAnim(this.uuid,0,.99,3)

        this.addComponent(new OnPointerDown(
            (e)=>{
              log('-----'+playerSelectedTileId+
              '----- this.uuid '+this.uuid+
              ' --icePoints '+this.tileAttributes.icePoints +
               ' tileId '+tileAttributes.tileId+
               ' owner '+tileAttributes.tileOwner)
              
               /////////////////////////////////////////////////
              //Test if NPC is being attacked by player
              //TODO need to test if attack icon is this tile to avoid unselected npc tiles == true (false positive)
              if (tileAttributes.tileOwner == 'npc' || tileAttributes.tileOwner == 'enemy'){

                // rays and get the this.selectedTile != Null

                log('playerSelectedTileId '+this.getSelectedPlayerTile() + '   npc tile '+this.uuid)
                //ne
                this.physicsCast.hitFirst(
                  northEastRay,
                    (e) => {

                      
                        if (e.didHit) {
                           if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                            log('attacked by player')
                                  
                            let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                            let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                            let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                            if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                           
                                  this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                  let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                  this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                  this.getComponent(IcePoints).icePoints = iceVal 
                                  this.getComponent(TileInfo).tileOwner = 'player'
                            } 

                           }
                          }
                        },
                            0
                        )

                this.physicsCast.hitFirst(
                  northWestRay,
                    (e) => {

                      
                        if (e.didHit) {
                                if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                                  log('attacked by player')
                                  
                                  let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                  let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                                  let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                                  if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                                 
                                      this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                      let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                      this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                      this.getComponent(IcePoints).icePoints = iceVal 
                                      this.getComponent(TileInfo).tileOwner = 'player'

                                }
                              }
                            }
                          },
                          1
                        )
                        this.physicsCast.hitFirst(
                          eastRay,
                            (e) => {
        
                              
                                if (e.didHit) {
                                        if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                                          log('attacked by player')
                                          
                                          let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                          let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                                          let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                                          if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                                         
                                            this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                            let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                            this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                            this.getComponent(IcePoints).icePoints = iceVal 
                                            this.getComponent(TileInfo).tileOwner = 'player'
                                        }
                                      } else {
                                        engine.entities[attackSelector.eastId].getComponent(Transform).scale.setAll(0)
                                      }
                                    }
                                  },
                                  2
                                )
                    this.physicsCast.hitFirst(
                      westRay,
                        (e) => {
    
                          
                            if (e.didHit) {
                                    if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                                      log('attacked by player')
                               
                                      let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                      let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                                      let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                                      if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                                     
                                      this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                      let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                      this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                      this.getComponent(IcePoints).icePoints = iceVal 
                                      this.getComponent(TileInfo).tileOwner = 'player'
                             
                                    }
                                  } else {
                                    engine.entities[attackSelector.westId].getComponent(Transform).scale.setAll(0)
                                  }
                                }
                              },
                              3
                            )
      
                  this.physicsCast.hitFirst(
                    southEastRay,
                      (e) => {
  
                        
                          if (e.didHit) {
                            log('southEastRay hit')
                                  if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){

                                    let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                    let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                                    let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                                    if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                                     
                                  
                                    log('attacked by player'+engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints+'  '+this.getComponent(TileInfo).icePoints)
                                    this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                    let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                    this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                    this.getComponent(IcePoints).icePoints = iceVal 
                                    this.getComponent(TileInfo).tileOwner = 'player'
                           

                                  }
                                } else {
                                  engine.entities[attackSelector.southEastId].getComponent(Transform).scale.setAll(0)
                                }
                              }
                            },
                            4
                          )

                this.physicsCast.hitFirst(
                  southWestRay,
                    (e) => {

                      
                        if (e.didHit) {
                          log('southWest hit')
                                if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                                  
                                  let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                 
                                 //Ensure only the attacking (the one selected one with the circle) is affected
                                  let selectorX:number  =engine.entities[playerSelectedTileId].getComponent(Transform).position.x 
                                  let selectorZ:number =engine.entities[playerSelectedTileId].getComponent(Transform).position.z
                                  if (selectorX ==  selectedGlobalPos.x && selectorZ ==  selectedGlobalPos.z) { 
                                   
                                
                                  
                              
                               
                                  // if(engine.entities[playerSelectedTileId].getComponent(Transform).position == engine.entities[e.entity.entityId].getComponent(Transform).position){
                                    // log('------- ')
                                  
                                     log('----- : '+engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints)
                                  this.attackResults = attack(engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints,this.getComponent(TileInfo).icePoints)
                                  
                                  // log('------attack results attacker:'+this.attackResults.attacker+' ad:'+this.attackResults.attackerDamage+' def'+this.attackResults.defender+' def dmg'+this.attackResults.defenderDamage)
                                  //   log('tile owner '+this.getComponent(TileInfo).tileOwner)
                                  // log('calling update with the folloiwng: '+e.entity.entityId+' attk ice '+this.attackResults.attacker+' attk dmg '+this.attackResults.attackerDamage+'  this uuid '+this.uuid+' def dmg '+this.attackResults.defenderDamage+'  '+this.attackResults.winner+' curr ice '+this.tileAttributes.icePoints)
                                  // log('----- : '+engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints)
                                  // let attackerIce:number =engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                  
                                  
                                 let iceVal:any =  this.newIceUpdate(this.attackResults.winner, e.entity.entityId, this.uuid,this.attackResults.attacker, this.attackResults.attackerDamage, this.attackResults.defender,this.attackResults.defenderDamage)
                                  
                                  // let winnerId = this.updateIce(e.entity.entityId,attackerIce,this.attackResults.attackerDamage,this.uuid,this.attackResults.defenderDamage,this.attackResults.winner)
                                  log('ice value '+iceVal)
                                    this.getComponent(TileInfo).icePoints = iceVal //engine.entities[e.entity.entityId].getComponent(TileInfo).icePoints
                                   this.getComponent(IcePoints).icePoints = iceVal 
                                  //change owner if defeder is defeated
                                //   if(this.attackResults.winner == 'attacker'){
                                //     log('change owner')
                                //     this.changeOwner('player',this.uuid)
                                     this.getComponent(TileInfo).tileOwner = 'player'
                                //     this.icePointText.value = engine.entities[e.entity.entityId].getComponent(IcePoints).icePoints.toString()
                                //  }
                                  // log('sw entity id '+e.entity.entityId)
                                  // engine.entities[e.entity.entityId].getComponent(IcePoints).icePoints = 0
                                  //   engine.entities[e.entity.entityId].getComponent(IcePoints).icePointTextId = '0'
                                    
                                // }
                                  }
                                }
                              } else {
                                engine.entities[attackSelector.southWestId].getComponent(Transform).scale.setAll(0)
                              }
                          },
                          5
                        )


              }

              /////////////////////////////////////////////////
              //Player hit test
              if (tileAttributes.tileOwner == 'player')
              {

                this.setSelectedPlayerTile(this.uuid)
                
                 log('selectedTileId '+ this.selectedTileId)
                  let selectedGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,this.getComponent(Transform).position)
                   engine.entities[playerSelectedTileId].getComponent(Transform).position = selectedGlobalPos
                  engine.entities[playerSelectedTileId].getComponent(Transform).position.y = .2
                  engine.entities[playerSelectedTileId].getComponent(Transform).scale.setAll(.7)


                //ne
                this.physicsCast.hitFirst(
                  northEastRay,
                    (e) => {

                      
                        if (e.didHit) {
                          if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy'){
                           
                          let neGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)

                          engine.entities[attackSelector.northEastId].getComponent(Transform).position = neGlobalPos
                          engine.entities[attackSelector.northEastId].getComponent(Transform).position.y = .2
                          engine.entities[attackSelector.northEastId].getComponent(Transform).scale.setAll(1)
                          } else {
                            engine.entities[attackSelector.northEastId].getComponent(Transform).scale.setAll(0)

                          }
                        } else {
                          engine.entities[attackSelector.northEastId].getComponent(Transform).scale.setAll(0)
                        }

                          },
                            0
                        )

                this.physicsCast.hitFirst(
                  northWestRay,
                    (e) => {

                      
                        if (e.didHit) {
                                if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy'){
                                  // log('npc nw hit')
                                let nwGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)

                                engine.entities[attackSelector.northWestId].getComponent(Transform).position = nwGlobalPos
                                engine.entities[attackSelector.northWestId].getComponent(Transform).position.y = .2
                                engine.entities[attackSelector.northWestId].getComponent(Transform).scale.setAll(1)
                                } else {
                                  engine.entities[attackSelector.northWestId].getComponent(Transform).scale.setAll(0)

                                }
                              }
                          },
                          1
                        )
                        this.physicsCast.hitFirst(
                          eastRay,
                            (e) => {
        
                              
                                if (e.didHit) {
                                        if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy'){
                                          // log('npc nw hit')
                                        let eGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
        
                                        engine.entities[attackSelector.eastId].getComponent(Transform).position = eGlobalPos
                                        engine.entities[attackSelector.eastId].getComponent(Transform).position.y = .2
                                        engine.entities[attackSelector.eastId].getComponent(Transform).scale.setAll(1)
                                        } else {
                                          engine.entities[attackSelector.eastId].getComponent(Transform).scale.setAll(0)
        
                                        }
                                      } else {
                                        engine.entities[attackSelector.eastId].getComponent(Transform).scale.setAll(0)
                                      }
                                  },
                                  2
                                )
                    this.physicsCast.hitFirst(
                      westRay,
                        (e) => {
    
                          
                            if (e.didHit) {
                                    if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy'){
                                      // log('npc nw hit')
                                    let eGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
    
                                    engine.entities[attackSelector.westId].getComponent(Transform).position = eGlobalPos
                                    engine.entities[attackSelector.westId].getComponent(Transform).position.y = .2
                                    engine.entities[attackSelector.westId].getComponent(Transform).scale.setAll(1)
                                    } else {
                                      engine.entities[attackSelector.westId].getComponent(Transform).scale.setAll(0)
    
                                    }
                                  } else {
                                    engine.entities[attackSelector.westId].getComponent(Transform).scale.setAll(0)
                                  }
                              },
                              3
                            )
      
                  this.physicsCast.hitFirst(
                    southEastRay,
                      (e) => {
  
                        
                          if (e.didHit) {
                                  if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy' ){
                                    // log('npc nw hit')
                                  let seGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
  
                                  engine.entities[attackSelector.southEastId].getComponent(Transform).position = seGlobalPos
                                  engine.entities[attackSelector.southEastId].getComponent(Transform).position.y = .2
                                  engine.entities[attackSelector.southEastId].getComponent(Transform).scale.setAll(1)
                                  } else {
                                    engine.entities[attackSelector.southEastId].getComponent(Transform).scale.setAll(0)
  
                                  }
                                } else {
                                  engine.entities[attackSelector.southEastId].getComponent(Transform).scale.setAll(0)
                                }
                            },
                            4
                          )

                this.physicsCast.hitFirst(
                  southWestRay,
                    (e) => {

                      log('south west hit')
                      
                        if (e.didHit) {
                                if (engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'npc' || engine.entities[e.entity.entityId].getComponent(TileInfo).tileOwner == 'enemy'){
                                  // log('npc nw hit')
                                let swGlobalPos:Vector3 = Vector3.Add(engine.entities[parentId].getComponent(Transform).position,engine.entities[e.entity.entityId].getComponent(Transform).position)
                                
                                engine.entities[attackSelector.southWestId].getComponent(Transform).position = swGlobalPos
                                engine.entities[attackSelector.southWestId].getComponent(Transform).position.y = .2
                                engine.entities[attackSelector.southWestId].getComponent(Transform).scale.setAll(1)
                                } else {
                                  engine.entities[attackSelector.southWestId].getComponent(Transform).scale.setAll(0)

                                }
                              } else {
                                engine.entities[attackSelector.southWestId].getComponent(Transform).scale.setAll(0)
                              }
                          },
                          5
                        )

              }
            },{
                button: ActionButton.POINTER,
                showFeedback: false, 
            }
        )
        )

      }
    
    growHex(hexId: string){
      let startScale = 0
      let endScale = .99
      Dash_AnimationQueue.add({
          duration: 2,
          data: { someval: 'foo' }, // optionally pass along some data that is accessible every frame
          onFrame: (progress, data) => {
              const enemyTransform = engine.entities[hexId].getComponent(Transform)
              // const easeValue = Scalar.Lerp(startScale, endScale, Dash_Ease.easeInOutQuad(progress))
              const easeValue = Scalar.Lerp(startScale, endScale, Dash_Ease.easeOutQuint(progress))
              
             
              enemyTransform.scale.setAll(easeValue)
              
      
          },
          onComplete: () => {
              // this.slashFade()
              
              log('Animation Done!')
          }
      })
    }

   

    // listPlayerOwned(){
    //   for (let entity of this.playerTiles.entities) {
    //     const position = entity.uuid
      
    //    log('north uuid '+position)
    //   return true
    //   }
    // }

    changeOwner(newOwner:string,tileId:string){

      if (newOwner == 'player'){
        log('changeOwner '+ tileId)
        this.tileAttributes.tileOwner = newOwner
        let newTile:GLTFShape = this.greenTile
        this.addComponentOrReplace(newTile)
      }
      //TODO remove old entity and add new owner colour entity

    }
    setSelectedPlayerTile(ptId:string){
      this.selectedTileId = ptId

      return this.selectedTileId
    }
    getSelectedPlayerTile(){
      return this.selectedTileId
    }

    

    getChildSelector(selectorType:Entity){
     
      //Attack NorthWest
      //  let selectorId:string = ''
      //  debugger
      //  for (const key in selectorType.children) {
        
      //    if (Object.prototype.hasOwnProperty.call(selectorType.children, key)) {
      //      const element = selectorType.children[key];
      //      //log(element.uuid)
           
      //      selectorId = element.uuid
      //    }
      //  }
      //  return selectorId
   }

   newIceUpdate(winner:string,atkId:string, defId:string,atkIce:number, atkDmg:number,defIce:number, defDmg:number){
    log('winner '+winner+ ' atkId '+atkId+' defId '+ defId+  ' atkIce '+atkIce+ ' atkDmg '+atkDmg+ ' defIce '+defIce+ 'defDmg '+defDmg)

    if (winner == 'attacker') {

        this.changeOwner('player',defId)
        log(engine.entities[defId].getComponent(IcePoints).icePointTextId)
        let defeatedTextId:string = engine.entities[defId].getComponent(IcePoints).icePointTextId
        let newIce:number = atkIce 
        engine.entities[defeatedTextId].getComponent(TextShape).value = newIce.toString()
        engine.entities[defId].getComponent(IcePoints).icePoints = newIce

          log(defId+ ' defId - new def ice '+ engine.entities[defId].getComponent(IcePoints).icePoints)

        let atkOldTileTextId: string = engine.entities[atkId].getComponent(IcePoints).icePointTextId

        engine.entities[atkOldTileTextId].getComponent(TextShape).value = '0'
        engine.entities[atkId].getComponent(IcePoints).icePoints = 0

    return newIce
    }

    
    if (winner == 'defender') {

      
      log(engine.entities[defId].getComponent(IcePoints).icePointTextId)
      let defeatedTextId:string = engine.entities[defId].getComponent(IcePoints).icePointTextId
      let newIce:number = defIce 
      engine.entities[defeatedTextId].getComponent(TextShape).value = newIce.toString()
      engine.entities[defId].getComponent(IcePoints).icePoints = newIce

        log(defId+ ' defId - new def ice '+ engine.entities[defId].getComponent(IcePoints).icePoints)

      let atkOldTileTextId: string = engine.entities[defId].getComponent(IcePoints).icePointTextId

      // engine.entities[atkOldTileTextId].getComponent(TextShape).value = '0'
      // engine.entities[atkId].getComponent(IcePoints).icePoints = 0

  return newIce
  }
    //     this.icePointText.value = engine.entities[e.entity.entityId].getComponent(IcePoints).icePoints.toString()
   }

    updateIce(attackerId:string,attackerIce:number,attackerDamage:number,defenderId:string,defenderDamage:number,winner:string){
    log('init Ice '+engine.entities[attackerId].getComponent(IcePoints).icePoints+ ' attackerIce '+attackerIce)
      //selected Attacking tile 
        let attackerRemainingIce:number = attackerIce -attackerDamage
        log('updateIce: attackerRemainingIce'+attackerRemainingIce+' attackerID  '+attackerId+ 'init Ice '+engine.entities[attackerId].getComponent(IcePoints).icePoints+'- attackerDamage '+attackerDamage + ' attk2 ice '+this.tileAttributes.icePoints)
   
      engine.entities[attackerId].getComponent(IcePoints).icePoints = attackerRemainingIce
      let textId = engine.entities[attackerId].getComponent(IcePoints).icePointTextId

      engine.entities[textId].getComponent(TextShape).value = attackerRemainingIce.toString()
      log('updateIce:  attacker new ice points '+engine.entities[attackerId].getComponent(IcePoints).icePoints)

      //defender tile
      // log('defender init Ice '+this.getComponent(IcePoints).icePoints+' defenderDamage '+defenderDamage)
     
      let defenderRemaingIce = engine.entities[defenderId].getComponent(IcePoints).icePoints -defenderDamage
      log('updateIce:  defenderRemaingIce '+defenderRemaingIce)
      
      // engine.entities[defenderId].getComponent(IcePoints).icePoints = defenderRemaingIce

      //change owner for losing defender
      this.icePointText.value = '0' //defenderRemaingIce.toString()
      log('updateIce: defender '+engine.entities[defenderId].getComponent(IcePoints).icePoints)
      
      if(winner == 'attacker'){
        log('updateIce: winner attackerId '+attackerId)
        this.tileAttributes.icePoints = attackerRemainingIce
        engine.entities[defenderId].getComponent(IcePoints).icePoints = engine.entities[attackerId].getComponent(IcePoints).icePoints
        engine.entities[attackerId].getComponent(IcePoints).icePoints = 0
        //engine.entities[textId].getComponent(TextShape).value = '0'

        return attackerId
      }
      if(winner == 'defender'){
        log('updateIce: winner DEFENDER '+defenderId)
        return defenderId
      }
    }

}