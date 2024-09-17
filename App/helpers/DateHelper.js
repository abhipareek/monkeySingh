let moment = require('moment'); // require
const requestIp = require('request-ip');


module.exports.formatDate = (date,args = {}) => {
    let response = moment(date, user().date_format).utc(true);     

    if(args.dayEnd) {
        response = response.endOf("day"); 
    }

    return this.toMongoDate(response); 
} 

module.exports.toMongoDate = (date) => {
    let response = new Date(date);    
    return response;
}

 

module.exports.toFormatDateInFormat = (date) => {
    const today = date ? date : new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    return  formattedToday = dd + '/' + mm + '/' + yyyy;
}
module.exports.toFormatDateInFormatwithTime = (date) => {
    const today = date ? date : new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    let HH = today.getHours();
    let MM = today.getMinutes();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    var ampm = HH >= 12 ? 'pm' : 'am';
    
    return formattedToday = dd + '/' + mm + '/' + yyyy + " " + HH + ":" + MM + " " + ampm;
}

// inside middleware handler
module.exports.ipMiddleware = (req, res, next) =>{
    let clientIp = requestIp.getClientIp(req); 
    return clientIp;

};