import resources from './resources'

//TODO add custom component to track uuid

export class HexSelector extends Entity{

    private hexPlaneEntity: Entity = new Entity()
    private hexPlane: PlaneShape = new PlaneShape()
    private hexMaterial: Material = new Material()
    
    private hexTransform: TranformConstructorArgs 
    private hexTexture: Texture = resources.images.hexPlane
    private playerIcon: Texture = resources.images.playerIcon

    private hexAttack: Texture = resources.images.hexAttack
    private hexMove: Texture = resources.images.hexMove
    


    constructor(
        colour: Color3, 
        hexTrans:TranformConstructorArgs,
        hexType:string
        ){
        super()
        engine.addEntity(this)
        this.hexTransform = hexTrans
        
         this.hexPlane.withCollisions = false
         this.hexPlane.isPointerBlocker = false 
        this.hexPlaneEntity.addComponent(this.hexPlane)
        this.hexPlaneEntity.addComponent(this.hexTransform)
        
        //TODO make if for new hexTypes
        if (hexType == 'selector'){
            this.hexMaterial.albedoTexture = this.hexTexture
            this.hexMaterial.alphaTexture =  this.hexTexture
            this.hexMaterial.transparencyMode = 1
            this.hexPlaneEntity.addComponent(this.hexMaterial)
            
             this.hexMaterial.emissiveColor = Color3.Green()
             this.hexMaterial.emissiveIntensity = 5
        this.hexPlaneEntity.setParent(this)
          
        }
      //TODO make if for new hexTypes
      if (hexType == 'player'){
        this.hexMaterial.albedoTexture = this.playerIcon
        this.hexMaterial.alphaTexture =  this.playerIcon
        this.hexMaterial.transparencyMode = 1
        this.hexPlaneEntity.addComponent(this.hexMaterial)
        
         this.hexMaterial.emissiveColor = Color3.Blue()
         this.hexMaterial.emissiveIntensity = 9
    this.hexPlaneEntity.setParent(this)
      
    }


        if (hexType == 'attack'){
            this.hexMaterial.albedoTexture = this.hexAttack
            this.hexMaterial.alphaTexture = this.hexAttack
            this.hexMaterial.transparencyMode = 1
            this.hexPlaneEntity.addComponent(this.hexMaterial)
            
             this.hexMaterial.emissiveColor = Color3.Red()
             this.hexMaterial.emissiveIntensity = 5
        this.hexPlaneEntity.setParent(this)
          
        }
        // this.hexMaterial.albedoTexture = this.hexTexture
        //     this.hexMaterial.alphaTexture = this.hexTexture
        // debugger

        // this.hexMaterial.transparencyMode = 1
        // this.hexPlaneEntity.addComponent(this.hexMaterial)
        
        //  this.hexMaterial.emissiveColor = colour
        //  this.hexMaterial.emissiveIntensity = 5
        // this.addComponent(this.hexPlaneEntity)
        // this.hexPlaneEntity.setParent(this)

        return this
    }
    selected(){

    }
    unSelected(){

    }
}