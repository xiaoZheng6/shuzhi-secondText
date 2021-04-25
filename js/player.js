window.addEventListener('load',function() {
    // 防抖
    function debounce(fn, wait) {    
        var timeout = null;    
        return function() {        
            if(timeout !== null)   clearTimeout(timeout);        
            timeout = setTimeout(fn, wait);    
        }
    }

    //节流
    var throttle = function(func, delay) {            
        var timer = null;            
        return function() {                
            var context = this;               
            var args = arguments;                
            if (!timer) {                    
                timer = setTimeout(function() {                        
                    func.apply(context, args);                        
                    timer = null;                    
                }, delay);                
            }            
        }        
    }

    console.log('ok');
    const defaultUrlHeader = "http://localhost:3000";
    const songsUrlHeader = "http://music.163.com";
    let login_ok = document.querySelector('.login-yes')
    let login = document.querySelector('.login-no')
    let loginImg = document.querySelector('.Img_big')
    let loginName = document.querySelector('.infomationName')
    let menu_section_item = document.querySelector('.menu_section_item')

    /* 判断登录状态*/
    let loginRefreshUrl = defaultUrlHeader + '/login/refresh';
    let loginStatusUrl = defaultUrlHeader + '/login/Status';
    let timestamp = new Date().getTime();//获得当前时间
    setInterval(()=>{
        timestamp = new Date().getTime();
    },1000)
    function loginStatus(timestamp){
        AjaxRequest((loginRefreshUrl + '?timestamp=' + timestamp),function(responseText){})  
        AjaxRequest((loginStatusUrl + '?timestamp=' + timestamp),function(responseText){
            if(responseText.data.account != null)
            {
                login.style.display = 'none';
                login_ok.style.display = 'block';
                loginImg.src = responseText.data.profile.avatarUrl+'?param=30y30';
                loginName.innerHTML = responseText.data.profile.nickname;
                //默认加载历史播放
                menu_section_item.remove();   
                let historysongUrl = defaultUrlHeader + '/user/record?uid=' + responseText.data.account.id +'&type=0';
                AjaxRequest(historysongUrl,(respondText)=>{
                    for(let i=0;i<respondText.allData.length;i++)
                    {
                        let cloneMenuItem = menu_section_item.cloneNode(true)
                        cloneMenuItem.dataset.id = respondText.allData[i].song.id;
                        cloneMenuItem.dataset.dt = respondText.allData[i].song.dt;
                        cloneMenuItem.dataset.src = respondText.allData[i].song.al.picUrl;
                        cloneMenuItem.children[0].children[0].innerHTML = i+1;
                        //歌名
                        cloneMenuItem.children[1].innerHTML = respondText.allData[i].song.name;
                        cloneMenuItem.children[1].title = respondText.allData[i].song.name;
                        //歌手
                        let allNAME = '';
                        for(let j=0;j<respondText.allData[i].song.ar.length;j++){
                            if(j+1 == respondText.allData[i].song.ar.length) {
                                allNAME += respondText.allData[i].song.ar[j].name;
                            }
                            else {
                                allNAME += respondText.allData[i].song.ar[j].name + '/';
                            }
                        }
                        cloneMenuItem.children[2].innerHTML = allNAME ;
                        //时长
                        cloneMenuItem.children[3].innerHTML = transformTimeMs(respondText.allData[i].song.dt);
                        menu_section.appendChild(cloneMenuItem);
                    }
                    showMusic();
                })
            }
            else {
                login.style.display = 'block';
                login_ok.style.display = 'none';
                loginStatusNow = 0;
            }                    
        })
    }
    loginStatus(timestamp);

    /*登录框显示与退出 */
    let exit = document.querySelector('.exit')
    let loginBox = document.querySelector('.login')
    let body = document.querySelector('body')
    login.addEventListener('click',function(){
        loginBox.style.display = 'block';
    })
    exit.addEventListener('click',function(){
        loginBox.style.display = 'none' ;
        for(let i=0;i<tips.length;i++)
         {
             tips[i].innerHTML = '';
         }
         phoneLogin.value = '';
         passwordLogin.value = '';
    })
    let phoneLogin = document.querySelector('.phoneLogin')
    let passwordLogin = document.querySelector('.phonePasswordLogin')
    let btnLogin = document.querySelector('.btnLogin')
    let tips = document.querySelectorAll('.tips')
    
    //判断手机号是否输入正确
    phoneLogin.addEventListener('focus',function(){
        phoneLogin.addEventListener('keyup',function(){
            let phone = phoneLogin.value;
            //let phoneflagUrl = defaultUrlHeader + '/cellphone/existence/check?phone=' + phone;
            if(phone.length == 11)
            {
                for(let i = 0;i<phone.length;i++)
                {
                    if(phone[i]>'9'||phone[i]<'0')
                    {
                        tips[0].innerHTML = '有非法字符！' ;
                        return;
                    }                    
                }
                tips[0].innerHTML = '' ;
                //AjaxRequest(phoneflagUrl,loginIn);
            }
            else {
                tips[0].innerHTML = '手机号不正确' ;
                return;
            }
        })
    })
    btnLogin.addEventListener('click',function(){
        let phone =phoneLogin.value;
        let password = passwordLogin.value;
        let loginUrl = defaultUrlHeader + '/login/cellphone?phone=' + phone + '&password=' + password + '&timestamp=150301993000';
        AjaxRequest(loginUrl,loginIn);
    })
    function loginIn(responseText) {
        console.log(responseText);
        if(responseText.code == 200) 
        {
            console.log(responseText)
            loginBox.style.display = 'none' ;
            login.style.display = 'none' ;
            body.style = '';
            for(let i=0;i<tips.length;i++)
            {
                tips[i].innerHTML = '';
            }
            phoneLogin.value = '';
            passwordLogin.value = '';
            timestamp++;
            loginStatus(timestamp);
        }
        else
        {
            tips[1].innerHTML = '密码错误!' ;
        }
    }
    //退出登录
    let logout = document.querySelector('.logout')
    logout.addEventListener('click',function(){
        let flag = false;
        let logoutUrl = defaultUrlHeader + '/logout?timestamp='+ timestamp;
        timestamp++;
        AjaxRequest(logoutUrl,function(){
            console.log('推出成功');
            flag = true;
            if(flag == true) {
                console.log('刷新成功');
                loginStatus(timestamp);
            }
        })
    })
    //字幕盒子的大小
    let playerSection = document.querySelector('.playerSection')
    let songtext_box = document.querySelector('.songtext_box')
    body.style.height = window.innerHeight + 'px';
    playerSection.style.height = window.innerHeight*0.6 + 'px';
    playerSection.addEventListener('selectstart',function(e){
        e.preventDefault(true);
    })
    let move = 0;//记录目前歌词的位置
    let yanshi = null;
    //滑动歌词
    playerSection.addEventListener('mousedown',function(e){
        let NowY = e.pageY;
        let moveNow = move;
        if(yanshi != null){
            clearInterval(yanshi);
        }
        clearInterval(scrollOk);
        songtext_box.style.transition = 'none';
        document.addEventListener('mousemove',moving);
        function moving(e) {
            move = moveNow + NowY - e.pageY;
            if(move<0) move = 0;
            songtext_box.style.transform = 'translateY(' + -move + 'px' +')';
        }
        document.addEventListener('mouseup',function(){
            document.removeEventListener('mousemove',moving);
            if(yanshi){
                clearInterval(yanshi);
            }
            yanshi = setInterval(()=>{
                songtext_box.style.transition = 'transform 0.5s';
                scrollOk = setInterval(()=>{
                    console.log(scrollOk)
                    if(songAllP){
                        for(let i=0;i<songTextarray.length;i++){
                            if(currentTime>=songTextarray[i].t) continue;
                            else {
                                if(songAllP[i-1].innerHTML != ''){
                                    let on = document.querySelector('.on')
                                    let scrollYl = on.offsetTop - playerSection.clientHeight/2;
                                    if(scrollYl<0) scrollYl = 0;
                                    move = scrollYl;
                                    songtext_box.style.transform = 'translateY(' + -scrollYl  +'px)'; 
                                }
                                break;
                            }
                        }
                    }
                },100)
                clearInterval(yanshi)
            },1500)
        }) 
    })
    window.addEventListener('resize',()=>{
        body.style.height = window.innerHeight + 'px';
        playerSection.style.height = window.innerHeight*0.6 + 'px'
        playerBottom.style.width = window.innerWidth*0.8 + 'px';
    })
    //下方盒子的大小
    let playerBottom = document.querySelector('.playerBottom')
    playerBottom.style.width = window.innerWidth*0.8 + 'px';
    //加载歌曲时间
    function transformTime(time) {
        let min;
        let s;
        let timer = '';
        min = parseInt(time/60);
        s = parseInt(time%60);
        if(min<10) timer = '0' + min + ':';
        else timer = min + ':';
        if(s<10) timer+='0'+s;
        else timer+=s;
        return timer; 
    } //转换时间
    function transformTimeMs(time) {
        let min;
        let s;
        let timer = '';
        time /= 1000;
        min = parseInt(time/60);
        s = parseInt(time%60);
        if(min<10) timer = '0' + min + ':';
        else timer = min + ':';
        if(s<10) timer+='0'+s;
        else timer+=s;
        return timer; 
    } //转换时间
    let time_now = document.querySelector('.time_now')
    let time_all = document.querySelector('.time_all')
    let audio = document.querySelector('#audio');
    let during = audio.duration;    
    let currentTime = audio.currentTime;
    //暂停与播放
    let goStop = document.querySelector('.goStop')
    let songimg = document.querySelector('.songimg')
    goStop.addEventListener('click',()=>{
        let play_status = goStop.className;
        console.log(play_status)
        if(play_status == 'goStop btn_pause') {
            goStop.className = 'goStop';
            audio.pause();
            songimg.style = 'animation-play-state:paused';
        }
        else {
            goStop.className = 'goStop btn_pause';
            audio.play();
            songimg.style = 'animation-play-state:running';
        }
    })
    //拖动进度条
    let song_main = document.querySelector('.song_main')
    let time_running = document.querySelector('.time_running')
    let time_progress_play = document.querySelector('.time_progress_play')
    let Xposition = 0;//记录进度条的位置
    let lettime = null;
    time_running.addEventListener('mousedown',(e)=>{
        console.log('点击了')
        let flag = true
        if(lettime != null){
            clearInterval(lettime);
        }
        clearInterval(Nowrunning);
        play_move(e);
        document.addEventListener('selectstart',(e)=>{
            e.preventDefault(true);
        })
        document.addEventListener('mousemove',play_move)
        function play_move(e) {
            let allweight = time_running.clientWidth;
            let x = (e.pageX - playerBottom.offsetLeft + playerBottom.clientWidth/2 - song_main.offsetLeft);
            if(x<0) x = 0;
            if(x>time_running.clientWidth) x = time_running.clientWidth;
            Xposition = (x/allweight).toFixed(6)*100;
            time_progress_play.style.width = Xposition + '%';
        }
        document.addEventListener('mouseup',()=>{
            if(flag) {
                document.removeEventListener('mousemove',play_move);
                audio.currentTime = (Xposition/100*during).toFixed(6);
                time_now.innerHTML = transformTime(currentTime);
                //歌词跳转
                if(songAllP){
                    for(let i=0;i<songTextarray.length;i++){
                        if(audio.currentTime>=songTextarray[i].t) continue;
                        else {
                            if(songAllP[i-1].innerHTML != ''){
                                let on = document.querySelector('.on')
                                on.className = '';
                                songAllP[i-1].className = 'on';
                                on = document.querySelector('.on')
                                let scrollYl = on.offsetTop - playerSection.clientHeight/2;
                                if(scrollYl<0) scrollYl = 0;
                                move = scrollYl;
                                songtext_box.style.transform = 'translateY(' + -scrollYl  +'px)'; 
                            }
                            else {
                                let on = document.querySelector('.on')
                                on.className = '';
                                songAllP[i-2].className = 'on';
                                on = document.querySelector('.on')
                                let scrollYl = on.offsetTop - playerSection.clientHeight/2;
                                if(scrollYl<0) scrollYl = 0;
                                move = scrollYl;
                                songtext_box.style.transform = 'translateY(' + -scrollYl  +'px)'; 
                            }
                            break;
                        }
                    }
                }
                lettime = setInterval(() => {
                    Nowrunning = setInterval(() => {
                        Xposition = (currentTime/during).toFixed(6)*100;
                        time_progress_play.style.width = Xposition + '%';
                        if(songAllP){
                            for(let i =0;i<songTextarray.length;i++){
                                if(currentTime>=songTextarray[i].t) continue;
                                else {
                                    if(songAllP[i-1].innerHTML != ''){
                                        for(let j =0;j<songTextarray.length;j++){
                                            songAllP[j].className = '';
                                        }
                                    }
                                    songAllP[i-1].className = 'on';
                                    break;
                                }
                            }
                        }
                    }, 300);//启动实时定时器
                    clearInterval(lettime);
                }, 500);//防抖
                flag = false ;
            }
        })
    })
    //实时监控歌的进度
    setInterval(()=>{
        currentTime = audio.currentTime;
        time_now.innerHTML = transformTime(currentTime);
    },300)
    let Nowrunning = setInterval(() => {
        Xposition = (currentTime/during).toFixed(6)*100;
        time_progress_play.style.width = Xposition + '%';
        if(songAllP){
            for(let i =0;i<songTextarray.length;i++){
                if(currentTime>=songTextarray[i].t) continue;
                else {
                    if(songAllP[i-1].innerHTML != ''){
                        for(let j =0;j<songTextarray.length;j++){
                            songAllP[j].className = '';
                        }
                    songAllP[i-1].className = 'on';  
                    }
                    break;
                }
            }
        }
    }, 300);
    //自动滚动
    let scrollOk = setInterval(()=>{
        if(songAllP){
            console.log(scrollOk)
            for(let i=0;i<songTextarray.length;i++){
                if(currentTime>=songTextarray[i].t) continue;
                else {
                    if(songAllP[i-1].innerHTML != ''){
                        let on = document.querySelector('.on')
                        let scrollYl = on.offsetTop - playerSection.clientHeight/2;
                        if(scrollYl<0) scrollYl = 0;
                        move = scrollYl;
                        songtext_box.style.transform = 'translateY(' + -scrollYl  +'px)'; 
                    }
                    break;
                }
            }
        }
    },100)

    //菜单内容盒子大小
    let menu_section = document.querySelector('.menu_section')
    let menuBox = document.querySelector('.menuBox')
    menu_section.style.height = menuBox.clientHeight - 30 + 'px';
    window.addEventListener('resize',()=>{
        menu_section.style.height = menuBox.clientHeight - 30 + 'px';
    })
    //菜单出入
    let openbtn = document.querySelector('.openbtn')
    let playermenu = document.querySelector('.playermenu')
    let openflag = false; //判断状态
    openbtn.addEventListener('click',function(){
        document.addEventListener('selectstart',function(e){
            e.preventDefault(true);
        })
        if(openflag == false) {
            openbtn.innerHTML = '';
            playermenu.style = 'min-width:300px;';
            openflag = true ;
        }
        else {
            openbtn.innerHTML = '';
            playermenu.style = '';
            openflag = false ;
        }
    })
    //点击菜单内的歌进行播放
    let songName = document.querySelector('.songName')
    let singerName = document.querySelector('.singerName')
    let songtext_box_text = document.querySelector('.songtext_box').querySelector('p');
    var songTextarray = new Array(); //定义存放歌词的数组
    var songAllP = undefined;
    let nextsong = document.querySelector('.nextSong')
    let lastsong = document.querySelector('.lastSong')
    let nowshow = null;
    songtext_box_text.remove(); 
    function showMusic(){
        let allButton = document.querySelectorAll('.icon_show')
        for(let k=0;k<allButton.length;k++)
        {
            allButton[k].addEventListener('click',()=>{
                nowshow = k;
                let id = allButton[k].parentElement.parentElement.getAttribute('data-id');
                let img = allButton[k].parentElement.parentElement.getAttribute('data-src') + '?param=70y70'
                let dt = allButton[k].parentElement.parentElement.getAttribute('data-dt');
                during = dt/1000;
                time_all.innerHTML = transformTime(during);//时间
                audio.src = songsUrlHeader + '/song/media/outer/url?id=' + id + '.mp3';//音频
                songimg.src = img ;
                for(let l=0;l<allButton.length;l++){
                    allButton[l].parentElement.parentElement.children[0].children[0].className = '';
                    allButton[l].parentElement.parentElement.children[0].children[1].className = 'noshow';
                }
                allButton[k].parentElement.parentElement.children[0].children[0].className = 'noshow';
                allButton[k].parentElement.parentElement.children[0].children[1].className = '';
                songName.innerHTML = allButton[k].parentElement.parentElement.children[1].innerHTML;//歌名
                singerName.innerHTML = allButton[k].parentElement.parentElement.children[2].innerHTML;//歌手
                goStop.className = 'goStop btn_pause';
                audio.play();
                songimg.style = 'animation-play-state:running';//转换为播放状态;
                let songtextUrl = defaultUrlHeader + '/lyric?id=' + id;
                songTextarray.length = 0;
                if(songAllP){
                    for(let i=0;i<songAllP.length;i++){
                        songAllP[i].remove();
                    } //移除当前歌词的全部信息
                }
                AjaxRequest(songtextUrl,(respondText)=>{
                    let nArry = respondText.lrc.lyric.split('\n');
                    for(let i =0;i<nArry.length;i++){
                        if(nArry[i] != ''){
                            var t = nArry[i].substring(nArry[i].indexOf("[") +1,nArry[i].indexOf("]"));
                            songTextarray.push({
                                t:((t.split(":")[0] *60 + parseFloat(t.split(":")[1])).toFixed(3)),
                                c:nArry[i].substring(nArry[i].indexOf("]") + 1,nArry[i].length) 
                            })
                        }
                    }//遍历，分解，2个对象，存放
                    for(let i =0;i<songTextarray.length;i++){
                        let textclone = songtext_box_text.cloneNode(true);
                        if(i==0) textclone.className = 'on';
                        textclone.innerHTML = songTextarray[i].c;
                        songtext_box.appendChild(textclone)
                    }
                    songAllP = document.querySelector('.songtext_box').querySelectorAll('p')//获取当前歌词全部信息
                })
            })
        }
        //点击切歌
        nextsong.addEventListener('click',throttle(()=>{
            if(nowshow == null) nowshow = 0;
            else{
                if(nowshow==allButton.length-1) nowshow = 0;
                else nowshow++;
            }
            let id = allButton[nowshow].parentElement.parentElement.getAttribute('data-id');
            let img = allButton[nowshow].parentElement.parentElement.getAttribute('data-src') + '?param=70y70'
            let dt = allButton[nowshow].parentElement.parentElement.getAttribute('data-dt');
            during = dt/1000;
            time_all.innerHTML = transformTime(during);//时间
            audio.src = songsUrlHeader + '/song/media/outer/url?id=' + id + '.mp3';//音频
            songimg.src = img ;
            let j = nowshow;
            if(j==0) j = allButton.length -1;
            else j--;
            allButton[j].parentElement.parentElement.children[0].children[0].className = '';
            allButton[j].parentElement.parentElement.children[0].children[1].className = 'noshow';
            allButton[nowshow].parentElement.parentElement.children[0].children[0].className = 'noshow';
            allButton[nowshow].parentElement.parentElement.children[0].children[1].className = '';
            songName.innerHTML = allButton[nowshow].parentElement.parentElement.children[1].innerHTML;//歌名
            singerName.innerHTML = allButton[nowshow].parentElement.parentElement.children[2].innerHTML;//歌手
            goStop.className = 'goStop btn_pause';
            audio.play();
            songimg.style = 'animation-play-state:running';//转换为播放状态;
            let songtextUrl = defaultUrlHeader + '/lyric?id=' + id;
            songTextarray.length = 0;
            if(songAllP){
                for(let i=0;i<songAllP.length;i++){
                    songAllP[i].remove();
                } //移除当前歌词的全部信息
            }
            AjaxRequest(songtextUrl,(respondText)=>{
                let nArry = respondText.lrc.lyric.split('\n');
                for(let i =0;i<nArry.length;i++){
                    if(nArry[i] != ''){
                        var t = nArry[i].substring(nArry[i].indexOf("[") +1,nArry[i].indexOf("]"));
                        songTextarray.push({
                            t:((t.split(":")[0] *60 + parseFloat(t.split(":")[1])).toFixed(3)),
                            c:nArry[i].substring(nArry[i].indexOf("]") + 1,nArry[i].length) 
                        })
                    }
                }//遍历，分解，2个对象，存放
                for(let i =0;i<songTextarray.length;i++){
                    let textclone = songtext_box_text.cloneNode(true);
                    if(i==0) textclone.className = 'on';
                    textclone.innerHTML = songTextarray[i].c;
                    songtext_box.appendChild(textclone)
                }
                songAllP = document.querySelector('.songtext_box').querySelectorAll('p')//获取当前歌词全部信息
            })
        },1000))
        lastsong.addEventListener('click',throttle(()=>{
            if(nowshow==null) nowshow = 0;
            else {
                if(nowshow==0) nowshow = allButton.length-1;
                else nowshow--;
            }
            let id = allButton[nowshow].parentElement.parentElement.getAttribute('data-id');
            let img = allButton[nowshow].parentElement.parentElement.getAttribute('data-src') + '?param=70y70'
            let dt = allButton[nowshow].parentElement.parentElement.getAttribute('data-dt');
            during = dt/1000;
            time_all.innerHTML = transformTime(during);//时间
            audio.src = songsUrlHeader + '/song/media/outer/url?id=' + id + '.mp3';//音频
            songimg.src = img ;
            let j = nowshow;
            if(j == allButton.length-1) j=0;
            else j++;
            allButton[j].parentElement.parentElement.children[0].children[0].className = '';
            allButton[j].parentElement.parentElement.children[0].children[1].className = 'noshow';
            allButton[nowshow].parentElement.parentElement.children[0].children[0].className = 'noshow';
            allButton[nowshow].parentElement.parentElement.children[0].children[1].className = '';
            songName.innerHTML = allButton[nowshow].parentElement.parentElement.children[1].innerHTML;//歌名
            singerName.innerHTML = allButton[nowshow].parentElement.parentElement.children[2].innerHTML;//歌手
            goStop.className = 'goStop btn_pause';
            audio.play();
            songimg.style = 'animation-play-state:running';//转换为播放状态;
            let songtextUrl = defaultUrlHeader + '/lyric?id=' + id;
            songTextarray.length = 0;
            if(songAllP){
                for(let i=0;i<songAllP.length;i++){
                    songAllP[i].remove();
                } //移除当前歌词的全部信息
            }
            AjaxRequest(songtextUrl,(respondText)=>{
                let nArry = respondText.lrc.lyric.split('\n');
                for(let i =0;i<nArry.length;i++){
                    if(nArry[i] != ''){
                        var t = nArry[i].substring(nArry[i].indexOf("[") +1,nArry[i].indexOf("]"));
                        songTextarray.push({
                            t:((t.split(":")[0] *60 + parseFloat(t.split(":")[1])).toFixed(3)),
                            c:nArry[i].substring(nArry[i].indexOf("]") + 1,nArry[i].length) 
                        })
                    }
                }//遍历，分解，2个对象，存放
                for(let i =0;i<songTextarray.length;i++){
                    let textclone = songtext_box_text.cloneNode(true);
                    if(i==0) textclone.className = 'on';
                    textclone.innerHTML = songTextarray[i].c;
                    songtext_box.appendChild(textclone)
                }
                songAllP = document.querySelector('.songtext_box').querySelectorAll('p')//获取当前歌词全部信息
            })
        },1000))
    }

})