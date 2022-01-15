
var data = {
    Floors: [],
    ManagementBehaviorData:[
    //     {
    //     content: '室内浇筑',
    //     list:[
    //         // {
    //         //     version:3.0,
    //         //     isFInish:true,
    //         // },
    //     ],
    //     finishRate:'100%',
    
    // }
]}
for(var i=0;i<3;i++){
    
    var item = {
        BehaviorName: '室内浇筑'+ i,
        FinishData:[],
        FinishRate: i+'%'
    }
    data.Floors = [];
    for(var j=0;j<10;j++){
        data.Floors.push(j)
        item.FinishData.push(
            {
                FinishDate:'2011-8-12T12',
                IsFinish:Math.floor((Math.random()*100))%2==0?true:false,
            }
        )
    }
    data.ManagementBehaviorData.push(item)
    
}


export default data