//ws服务端
const MeoWS = require('meowslib');
const WSServer = MeoWS.WSServer;
const BuildSession = MeoWS.BuildSession;
let wss = new WSServer(1006);
//qq机器人方法
const { App } = require('koishi');
//文件
var fs = require("fs");
var readline = require('readline');

/*
启动natapp
var child_process=require("child_process")
child_process.execFile("tcp.bat",null,{cwd:'./ex/natapp/', windowsHide:false},function(error,stdout,stderr){
    if(error !==null){
        console.log("exec error:"+error)
    }
    else {
    	console.log("成功")
    }
})
*/




 

/*
* 按行读取文件内容
* 返回：字符串数组
* 参数：fReadName:文件名路径
*      callback:回调函数
* */
function readFileToArr(fReadName,callback){
    var fRead = fs.createReadStream(fReadName);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
       // console.log(arr);
        callback(arr);
    });
}

	



const app = new App({
  // 这里的配置项与上面的 koishi.config.js 作用相同
  type: 'http',
  port: 1005,
  server: 'http://localhost:5700',
})

wss.on('client', (session, request) => {
    console.log(request.connection.remoteAddress + ' connected!');
    session.tellraw("欢迎使用！请输入help [数字]查看帮助叭！");

    BuildSession.createAndBind(session);
    session.on('onMessage',(msg, player)=>{
        console.log(`[${player}]`, msg);
		a=msg.trim().split(/\s+/);
		var cmd = "";
		var work= "";
		


		if(a[0]=="command"){
  			for(var i = 1; i < a.length;i++){
        	var cmd = cmd + a[i] + " ";
 		}
		session.sendCommandSync(cmd);
		}
		if(a[0]=="help"){
			
			if(a[1]=="0"){
				session.tellraw("你看个泡泡茶壶，这边没东西，东西在后面的页面");
			}
			if(a[1]=="1"){
				session.tellraw("第一页\ncommand 执行指令;\nhelp 查看帮助，后加数字\nsay 可以向某一个机器人在的群内说话\ntphere [玩家id]使某一玩家tp到自己身边\ncb  [a：追加，c：创建，r:读取] [命令模块名] [a与r的时候需要添加该参数：内容] 创建一个命令模块\n绑定 [qq群]可以绑定qq群，是使用say指令的前提");
			}

			
		}
		
		if(a[0]=="say"){
            var groupId=parseInt(global.groupnum);

            if(groupId==""){
                session.tellraw("请先绑定需要发送的qq群");
            }else{
            var text=a[1];
            var text="["+player+"]："+text;
            
            app.sender.sendGroupMsgAsync(groupId, text, true);
            session.tellraw("发送成功");
        }
        }
		if(a[0]=="tphere"){
			var here="tp"+" "+a[1]+" "+player;
			session.sendCommandSync(here);
		}
		//返回信息时执行的源码	
		if(a[0]=="cb"){
			var lu="../bstluo/yuzhi/cmd/"+a[2]+".txt";

			for(var i = 3; i < a.length;i++){
        	var work = work + a[i] + " ";
 			}
 			if(a[1]=="c"){
 				//创建
 				fs.writeFile(lu, work, (err, data) => {
    			if (err) {
    				throw err
    			}else{
    				session.tellraw("创建成功啦~");
    			}
				});
 			}

			if(a[1]=="a"){	
				var work1="\n"+work;
				fs.appendFile(lu, work1, (err, data) => {
					if (err) {
						throw err;
					}else{
						session.tellraw("添加成功啦~");
					}

					});
				//追加
			}
			if(a[1]=="r"){
				readFileToArr('../bstluo/yuzhi/cmd/test.txt',function(data){
				for(var c=0; c < data.length;c++){
				session.sendCommandSync(data[c]);	
				}
				session.tellraw("运行成功啦");
				})
				//使用
			}

		}
		if(a[0]=="绑定"){
                global.groupnum = a[1];
                if (global.groupnum!="") {
                    session.tellraw("绑定成功");
                }else{
                    session.tellraw("绑定失败");
                }
            }	
    });
});
		


/*
好的不打算用qq了，发送信息到qq作为一个单独的功能了，到时候直接自己做一个新的聊天室和网页聊天就好了嗯。
 */
