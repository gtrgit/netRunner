import { Dash_AnimationQueue, Dash_Ease, } from "dcldash"


export class DashAnim {


    private startScale: number= 0
    private endScale: number = .99

constructor(entId:string,startScale: number,endScale: number,duration:number){


        Dash_AnimationQueue.add({
            duration: 2,
            data: { someval: 'foo' }, // optionally pass along some data that is accessible every frame
            onFrame: (progress, data) => {
                const enemyTransform = engine.entities[entId].getComponent(Transform)
                // const easeValue = Scalar.Lerp(startScale, endScale, Dash_Ease.easeInOutQuad(progress))
                const easeValue = Scalar.Lerp(startScale, endScale, Dash_Ease.easeOutQuint(progress))
                
            
                enemyTransform.scale.setAll(easeValue)
                

            },
            onComplete: () => {
                // this.slashFade()
                return 'done'
                log('Animation Done!')
            }
        })
}
}