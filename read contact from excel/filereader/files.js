var xlsx = require('excel');
module.exports = function(fileName){
    xlsx(fileName, function(err, data){
        if(err)
            console.log({"Error " : err});
        else{
            for(var i=1; i<data.length; i++){
                /*for(var j=1; j<3; i++){
                    console.log('Data[' + i + '] [' + j + '] : ', data[i][j]);
                }*/
                for(var j=0; j<data[i].length; j++){
                    console.log('Data : ', data[i][j])
                }
                console.log('Data Length : ', data[i].length);
            }
            /*console.log('length : ', data.length);
            console.log('Data : ', data[2]);
            var str = data[2][1];
            console.log('Name : ', str);*/
        }
    });
};