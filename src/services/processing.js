const db = require('../../models')
const { OrderServiceDetails } = db 

const updateCount = async (request)=>{

    let specialCount = request.clothItem.map(element=>({id:element.id, count:element.count}))
    let miscCount  = request.miscItem.map(element=>({id:element.id, count:element.count}))
    let totalClothCount = specialCount.concat(miscCount);

    const queries = totalClothCount.map(element=>{
        return OrderServiceDetails.update(
                    {
                        count:element.count
                    },
                    {
                        where:{id:element.id}
                    }
                )
    })
    await Promise.all(queries);
}

module.exports = {  
    updateCount
}