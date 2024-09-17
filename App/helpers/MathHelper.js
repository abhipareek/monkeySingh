
 module.exports.roundNumber = (number,decimals) => { 
    return new Promise( async(resolve, reject) => {
        if(number){
       // var newnumber = new Number(number+'').toFixed(parseInt(decimals));          
       // resolve(parseFloat(newnumber));
       resolve(number+'.0');

        }else{
            resolve('0.0');
        }
    }); 

}
