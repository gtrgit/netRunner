

export class Ui extends Entity{

    private canvas = new UICanvas()
    private text = new UIText(this.canvas)

    constructor(){
        super()
        engine.addEntity(this)
        this.addComponent(this.canvas)
        
        this.text.value = ''

        this.text.value = "Close UI"
        this.text.fontSize = 15
        this.text.width = 120
        this.text.height = 30
        this.text.vAlign = "bottom"
        this.text.positionX = -80
    }

    updateTxt(txtValue:string){
        this.text.value = txtValue
    }
}