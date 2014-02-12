/**
 * Created by David Xu on 2/12/14.
 */

var fs = require('fs');
var stdin = process.stdin;
var stdout = process.stdout;

//异步版本
//fs.readdir(__dirname, function(err, files){
//    console.log(files);
//})

//同步版本
//console.log(fs.readdirSync('.'));

fs.readdir(process.cwd(),function(err, files){
    console.log('');
    var stats =[];

    if(!files.length){
        return console.log('    \033[31m No files to show!\033[39m\n');
    }

    console.log(' Select which file or directory you want to see\n');

    function read(){
        stdin.resume();//等待用户输入
        stdin.on('data', option);
    }
    //called with the option supplied by the user

    function option(data){
        if(!files[Number(data)]){
            stdout.write('     \033[31mEnter your choice: \33[39m');
        }else{
                var filename = files[Number(data)];
                stdin.pause();
                if(stats[Number(data)].isDirectory()){
                     fs.readdir(__dirname +'/'+filename, function(err,files){
                         console.log(__dirname);
                         //console.log(files);
                         console.log('     (' + files.length + ' files)');
                         files.forEach(function(file){
                             console.log('     -   ' + file);
                         });
                         console.log('');
                     });
                }else{
                    fs.readFile(__dirname + '/' + filename,'utf8',function(err, data){
                        console.log('');
                        newdata = data.replace(/(.*)/g,'     $1');//添加正则表达式，是为了添加一些辅助缩进
                        console.log('\033[90m' + newdata + '\033[39m');
                    });
                }
            }
            //console.log(files[Number(data)]);
            //stdin.pause();
    }


    function file(i){
        var filename = files[i];

        fs.stat(__dirname + '/' +filename, function(err, stat){

            //console.log(stat);

            stats[i] = stat;//文件名字或者目录名字保存到stas数组里，便于我们以后使用

            if(stat.isDirectory()){
                console.log('     '+i+'     \033[36m' + filename + '/\033[39m');
            }else{
                console.log('     '+i+'     \033[90m' + filename + '/\033[39m');
            }

            ++i;

            if(i == files.length){
                console.log('');
                stdout.write('     \033[31mEnter your choice: \33[39m');
                read();

            }else{
                file(i);
            }

        });
    }

    file(0);
});