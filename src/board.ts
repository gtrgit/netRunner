
import resources from "./resources"
import {HexTile, tileAttributes,TileInfo, attackSelector, moveSelector} from "./hexTile"
import { HexSelector } from "./hexSelector"
import {getRandomInt} from "./modules/random"
import { Ui } from "./modules/ui"

@Component("playerFlags")
export class PlayerFlags {
  playerTile: string = ''
  aiTile: string = ''
  neturalTile: string = ''
  aetheriaTile: string = ''
}



//TODO: customer component type to show owner {owner: 'player'} {owner: 'npc'} {owner: '3sc'}

export class Board extends Entity{

    private ui: Ui = new Ui()
    private aetheriaMap: Texture = resources.images.aetheriaMap
    private aetheriaMaterial = new BasicMaterial()
    private hexTransform:TranformConstructorArgs = new Transform()
    private hexPos:TranformConstructorArgs[] = []

    private currentColour = Color3.Green()
    private playerSelectedColour = Color3.Yellow()
    private enemySelectedColour = Color3.Red()

    private hexSelectorTransform: Transform = new Transform({position: new Vector3(0,.1,0),rotation: Quaternion.Euler(90,0,0),scale: new Vector3(0,0,0)})
    private playerSelectedTransform: Transform = new Transform({position: new Vector3(2,1,2),rotation: Quaternion.Euler(90,0,0),scale: new Vector3(0,1,0)})
    
    private selector: HexSelector = new HexSelector(this.currentColour,this.hexSelectorTransform,'selector')
    private playerSelected: HexSelector = new HexSelector(this.playerSelectedColour,this.playerSelectedTransform,'player')
    private enemySelected: HexSelector = new HexSelector(this.enemySelectedColour,this.hexSelectorTransform,'enemy')


    
    private hexDirNorthEast: Transform = new Transform({position: new Vector3(1,.3,1),rotation: Quaternion.Euler(90,215,0),scale: new Vector3(0,0,0)})
    private hexDirNorthWest: Transform = new Transform({position: new Vector3(2,.3,1),rotation: Quaternion.Euler(90,145,0),scale: new Vector3(0,0,0)})
    private hexDirEast: Transform = new Transform({position: new Vector3(3,.3,1),rotation: Quaternion.Euler(90,270,0),scale: new Vector3(0,0,0)})
    private hexDirWest: Transform = new Transform({position: new Vector3(4,.3,1),rotation: Quaternion.Euler(90,90,0),scale: new Vector3(0,0,0)})
    private hexDirSouthEast: Transform = new Transform({position: new Vector3(5,.3,1),rotation: Quaternion.Euler(90,330,0),scale: new Vector3(0,0,0)})
    private hexDirSouthWest: Transform = new Transform({position: new Vector3(6,.3,1),rotation: Quaternion.Euler(90,30,0),scale: new Vector3(0,0,0)})



    private hexAttackNorthEast: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirNorthEast,'attack')
    private hexAttackNorthWest: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirNorthWest,'attack')
    private hexAttackWest: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirWest,'attack')
    private hexAttackEast: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirEast,'attack')
    private hexAttackSouthEast: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirSouthEast,'attack')
    private hexAttackSouthWest: HexSelector = new HexSelector(this.enemySelectedColour,this.hexDirSouthWest,'attack')


    private enemyTilesIdArray:string[] = []
    //TODO make attack and move tiles for each adjecentTiles
    // private enemySelected: HexSelector = new HexSelector(this.enemySelectedColour,this.hexSelectorTransform,'enemy')

    

       
    constructor(
        
        transform: TranformConstructorArgs
      ) {
        super()
        engine.addEntity(this)
        this.aetheriaMaterial.texture = this.aetheriaMap
        this.addComponent(this.aetheriaMaterial)
        this.addComponent(new Transform(transform))
    
        this.addComponent(new PlayerFlags)
        
        

        this.placeHexTiles(11,11)
      
        //TODO:
        //iSystems

        this.raySys(this.getComponent(Transform).position)

        this.ui.updateTxt('NetRunner')
      }


      raySys(boardPosition: Vector3){
          
        //////////////////////////////////////////////////////////
        ///////
        let selectorId =  this.getChildSelector(this.selector)


        // //Selector
        //     let selectorId:string = ''
        //     for (const key in this.selector.children) {
        //       if (Object.prototype.hasOwnProperty.call(this.selector.children, key)) {
        //         const element = this.selector.children[key];
        //         //log(element.uuid)
                
        //         selectorId = element.uuid
        //       }
        //     }
      


          let selectorGlobalPos:Vector3
           
         
        

          ///////////
          let parentPos: Vector3  
          let globalRayOrigin : Vector3      
          // this.localRayOrigin = this.getComponent(Transform).position
          const northEastDirection = new Vector3(1,0,1)
          const northWestDirection = new Vector3(-1,0,1)
          const eastDirection = new Vector3(1,0,0)
          const westDirection = new Vector3(-1,0,0)
          
          const southEastDirection = new Vector3(1,0,-1)
          const southWestDirection = new Vector3(-1,0,-1)
      


            /////////////////
            class BoardSystems implements ISystem {
              // private tileInfo = new TileInfo
              private physicsCast = PhysicsCast.instance   
              // private tileInfo:tileAttributes = {tileId:'',tileTransform: new Vector3(0,0,0),tileOwner: '',icePoints:0}
                        
              private initialTile: GLTFShape = resources.models.hexBlue
              private blueTile:GLTFShape= resources.models.hexBlue
              private greenTile:GLTFShape= resources.models.hexGreen
              private redTile:GLTFShape= resources.models.hexRed
              private orangeTile:GLTFShape= resources.models.hexOrange
    

              update(dt: number) {
                
               

                ////////////////////////////////
                //RAYCASE
                const rayFromCamera: Ray = PhysicsCast.instance.getRayFromCamera(1000)

                PhysicsCast.instance.hitFirst(  
                  rayFromCamera, (raycastHitEntity) => {

                  
                    if(raycastHitEntity.didHit){
                    
                      if(raycastHitEntity.entity.meshName == 'hex_collider'){

                        //this.changeTileToPlayer(raycastHitEntity.entity.entityId)
                     
                        ////////////////////////////////
                        //tile ray test
                        parentPos = engine.entities[raycastHitEntity.entity.entityId].getComponent(Transform).position  

                        globalRayOrigin = Vector3.Add(parentPos, boardPosition)

                        const northWestRay: Ray = {origin: globalRayOrigin, direction: northWestDirection, distance: 1}
                        const northEastRay: Ray = {origin: globalRayOrigin, direction: northEastDirection, distance: 1}
                        const eastRay: Ray = {origin: globalRayOrigin, direction: eastDirection, distance: 1}
                        const westRay: Ray = {origin: globalRayOrigin, direction: westDirection, distance: 1}
                        const southEastRay: Ray = {origin: globalRayOrigin, direction: southEastDirection, distance: 1}
                        const southWestRay: Ray = {origin: globalRayOrigin, direction: southWestDirection, distance: 1}
              
                         
                          
                        ////////////////////////////////
                        //move selector
                            // log('id '+raycastHitEntity.entity.entityId)
                           if(engine.entities[raycastHitEntity.entity.entityId].getComponent(TileInfo).tileOwner == 'player'){
                           
                            selectorGlobalPos = Vector3.Add(boardPosition,engine.entities[raycastHitEntity.entity.entityId].getComponent(Transform).position)
                        
                            engine.entities[selectorId].getComponent(Transform).position.x = selectorGlobalPos.x
                            engine.entities[selectorId].getComponent(Transform).position.z = selectorGlobalPos.z
                            engine.entities[selectorId].getComponent(Transform).position.y = selectorGlobalPos.y+.2

                            engine.entities[selectorId].getComponent(Transform).scale.setAll(1)


                            }
                           

                      }
                    }
                  
                  }
                )


               ////////////////////////////////////////////////////////////////
               //Board
               //TODO mark surrounding tiles as red
               //on your tile click the cursor changes to an attack cursor (sword)
               //the red adjecent tiles can be clicked on and then change to your colour Green



              }

              changeTileToPlayer(changeId:string){
                let newOwner = resources.models.hexGreen
                engine.entities[changeId].addComponentOrReplace(newOwner)
    
          }
            }

       engine.addSystem(new BoardSystems())
      }

      moveSelector(moveToId:string){
        
      }
      loadHexSelector(){
        
      }

      tileSelected(tileId:string){


      }

      drawHexMap(){

        let playerSelectedId:string = ''

          for (const key in this.playerSelected.children) {
            if (Object.prototype.hasOwnProperty.call(this.playerSelected.children, key)) {
              const element = this.playerSelected.children[key];
              //log(element.uuid)
              
              playerSelectedId = element.uuid
              log('id '+playerSelectedId)
            }
          }

        for (let i = 0; i < this.hexPos.length; i++){
          
          //tileAttributes type
          let icePoints:number = getRandomInt(1,10)
          let initialTileOwner: string = 'npc'

          let lastTile:number = this.hexPos.length-1

      switch (i) {
          case 0:
            icePoints = 50
              initialTileOwner = 'player'
              break;
          case 1:
            icePoints = 9
              initialTileOwner = 'enemy'
              break;
          // case 8:
          //   icePoints = 18
          //     initialTileOwner = 'player'
          //     break;
          // case 102:
          //   icePoints = 18
          //     initialTileOwner = 'player'
          //     break;
          case lastTile:
              initialTileOwner = 'enemy'
              break;
          case 157:
                initialTileOwner = 'enemy'
                break;
          case 87:
                initialTileOwner = 'enemy'
                break;
          case 163:
                initialTileOwner = 'enemy'
                break;
          case 150:
                initialTileOwner = 'enemy'
                break;
          case 79:
                  initialTileOwner = 'enemy'
                  break;
            case 156:
                  initialTileOwner = 'enemy'
                  break;
            case 71:
                  initialTileOwner = 'enemy'
                  break;
            case 149:
                  initialTileOwner = 'enemy'
                  break;
          case 43:
              initialTileOwner = 'aetheria'
              break;
          case 111:
              initialTileOwner = 'aetheria'
              break;
          case 118:
              initialTileOwner = 'aetheria'
              break;
          case 125:
              initialTileOwner = 'aetheria'
              break;
          case 132:
              initialTileOwner = 'aetheria'
              break;
          case 36:
              initialTileOwner = 'aetheria'
              break;
          case 44:
              initialTileOwner = 'aetheria'
              break;
          case 52:
              initialTileOwner = 'aetheria'
              break;
              case 112:
                initialTileOwner = 'aetheria'
                break;
            case 119:
                initialTileOwner = 'aetheria'
                break;
            case 126:
                initialTileOwner = 'aetheria'
                break;
            case 133:
                initialTileOwner = 'aetheria'
                break;
            case 45:
                initialTileOwner = 'aetheria'
                break;
            
        }
          
          let taHolder:tileAttributes =  this.allocateTileAttributes(initialTileOwner,icePoints)//i icePoints
          
          let neId = this.getChildSelector(this.hexAttackNorthEast)
          let nwId = this.getChildSelector(this.hexAttackNorthWest)
          let eId = this.getChildSelector(this.hexAttackEast)
          let wId = this.getChildSelector(this.hexAttackWest)
          let seId = this.getChildSelector(this.hexAttackSouthEast)
          let swId = this.getChildSelector(this.hexAttackSouthWest)

          log(' ne selector id '+neId)
          let attackSel:attackSelector = this.assignAttackSelector(neId,nwId,eId,wId,seId,swId)
          //move
          const parentId = this.uuid
          const playerSelection =  new HexTile(this.hexPos[i],parentId,taHolder,playerSelectedId,this.enemySelected.uuid,attackSel,attackSel)
          playerSelection.setParent(this)

          //creat enemy tile array
          if(engine.entities[playerSelection.uuid].getComponent(TileInfo).tileOwner == 'enemy'){
            this.enemyTilesIdArray.push(playerSelection.uuid) 
          }
          

         
          

          // class EnemyMoves implements ISystem {

          //   private tiles:string[] = []
          //   private timer: number = 20
          //   constructor(tilesArr:string[]) {this.tiles = tilesArr }
            
          //       update(dt: number) {
          //       for (let i = 0; i < this.tiles.length; i++) {
          //         if (this.timer > 0) {
          //           this.timer -= dt
          //         } else {
          //           this.timer = 20
          //           // DO SOMETHING
          //         }
          //       //   log('tiles '+engine.entities[this.tiles[i]].getComponent(TileInfo).tileOwner)
                  
          //         }
          //       }
              
          // }
          // engine.addSystem(new EnemyMoves(this.enemyTilesIdArray))

        }
      }

      assignAttackSelector(ne:string,nw:string,e:string,w:string,se:string,sw:string,) {
        let attackselectors:attackSelector = {northEastId:ne,northWestId:nw,eastId:e,westId:w,southEastId:se,southWestId:sw}
        return attackselectors
      }
      allocateTileAttributes(tileOwner:string, icePoints:number) {
        let tileAttributes:tileAttributes = {tileId:'',tileTransform: new Vector3(0,0,0),tileOwner: tileOwner,icePoints:icePoints}//randomIce
        return tileAttributes
      }

      placeHexTiles(rows: number, cols: number){

                for (let x = 0; x <cols; x++){
              
                  this.hexTransform  = {position: new Vector3(x+.5, 0, 1.25),scale: new Vector3(0,1,0)}
                  this.hexPos.push(this.hexTransform)

                  for (let y = 0; y <rows; y++){
                    if (y<1.77){
                      y = y + 1
                      } else {
                        y = y +.5
                      }
          
                    
                    this.hexTransform  = {position: new Vector3(x, 0, y+1),scale: new Vector3(0,1,0)}
                    this.hexPos.push(this.hexTransform)
                  }

                }

                for (let x = 0; x <cols; x++){
                
                
                  // this.hexTransform  = {position: new Vector3(x, 0, 1),scale: new Vector3(0,1,0)}
                  // this.hexPos.push(this.hexTransform)

                  for (let y = .75; y <rows; y++){
                    if (y<1.77){
                    y = y + 1
                    } else {
                      y = y +.5
                    }

                  this.hexTransform  = {position: new Vector3(x+.5, 0, y+1),scale: new Vector3(0,1,0)}
                  this.hexPos.push(this.hexTransform)
                  }
              }
                //todo make another loop to fill in the gaps
                this.drawHexMap()
      }

      startTiles(){
       
      }

      adjecentTiles(tileId:string){



      }

      changeTileToEnemy(){

      }

      getChildSelector(selectorType:HexSelector){
         //Attack NorthWest
          let selectorId:string = ''
          for (const key in selectorType.children) {
            if (Object.prototype.hasOwnProperty.call(selectorType.children, key)) {
              const element = selectorType.children[key];
              //log(element.uuid)
              
              selectorId = element.uuid
            }
          }
          return selectorId
      }
     
}