//登录界面
window.addEventListener('load',function(){
    const defaultUrlHeader = "http://localhost:3000";
    const songsUrlHeader = "http://music.163.com";
    let login_ok = document.querySelector('.login-yes')
    let login = document.querySelector('.login-no')
    let loginImg = document.querySelector('.Img_big')
    let loginName = document.querySelector('.infomationName')
    let bodier_section_unlogin = document.querySelector('.bodier_unlogin')
    let bodier_section_login = document.querySelector('.bodier_login')
    let login_header = document.querySelector('.login_header')
    let loading = document.querySelector('.loading')
    /* 判断登录状态*/
    let loginRefreshUrl = defaultUrlHeader + '/login/refresh';
    let loginStatusUrl = defaultUrlHeader + '/login/Status';
    let song_section_list = document.querySelector('.song_section_list')
    let timestamp = new Date().getTime();//获得当前时间
    setInterval(()=>{
        timestamp = new Date().getTime();
    },1000)
    function loginStatus(timestamp){
        AjaxRequest((loginRefreshUrl + '?timestamp=' + timestamp),function(){})
        AjaxRequest((loginStatusUrl + '?timestamp=' + timestamp),function(responseText){
            if(responseText.data.account != null)
            {
                login_ok.children[0].src = responseText.data.profile.avatarUrl+'?param=40y40';
                loginImg.src = responseText.data.profile.avatarUrl+'?param=70y70';
                loginName.innerHTML = responseText.data.profile.nickname;
                //头像名字渲染
                login_header.children[0].children[0].src = responseText.data.profile.avatarUrl+'?param=105y105';
                login_header.children[1].children[0].innerHTML = responseText.data.profile.nickname;
                let userfollows = defaultUrlHeader + '/user/follows?uid=' + responseText.data.account.id + '&timestamp=' + timestamp; 
                let userfalloweds = defaultUrlHeader + '/user/followeds?uid=' + responseText.data.account.id + '&timestamp=' + timestamp; 
                //我喜欢的歌数据渲染
                let song_list = document.querySelector('.song_list')
                let myloveUrl = defaultUrlHeader + '/likelist?uid=' + responseText.data.account.id;
                let music_number = document.querySelector('.music_number')
                song_section_list.remove();  
                AjaxRequest(myloveUrl,(responseText)=>{
                    music_number.innerHTML = '(' + responseText.ids.length + ')';
                    for(let i=0;i<responseText.ids.length;i++){
                        let songInformationUrl = defaultUrlHeader + '/song/detail?ids=' + responseText.ids[i];
                        AjaxRequest(songInformationUrl,function(responseText){ 
                            let singerName = '';//名字
                            let min;//时间
                            let s;
                            let time = '';
                            let song_clone = song_section_list.cloneNode(true);
                            song_clone.children[0].children[0].innerHTML = responseText.songs[0].name;//歌名
                            song_clone.children[0].children[0].title = responseText.songs[0].name;
                            for(let k=0;k<responseText.songs[0].ar.length;k++)
                            {
                                if( (k+1) == responseText.songs[0].ar.length) singerName = singerName +'<a href="javascript:;" class="singer" title ="'+responseText.songs[0].ar[k].name +'">'+responseText.songs[0].ar[k].name+'</a>';
                                else singerName = singerName +'<a href="javascript:;" class="singer" title ="'+responseText.songs[0].ar[k].name +'">'+responseText.songs[0].ar[k].name+'</a>' + ' / ';
                            }//歌手
                            song_clone.children[1].innerHTML = singerName ;
                            song_clone.children[2].children[0].innerHTML = responseText.songs[0].al.name;//专辑
                            song_clone.children[2].children[0].title = responseText.songs[0].al.name;
                            min = parseInt(responseText.songs[0].dt/1000/60);
                            s = parseInt(responseText.songs[0].dt/1000%60);
                            if(min<10) time = '0' + min + ':';
                            else time = min + ':';
                            if(s<10) time += '0'+s;
                            else time += s;
                            song_clone.children[3].innerHTML = time ;//时间
                            song_list.appendChild(song_clone);
                        }) 
                    }
                })             
                //关注数量
                AjaxRequest(userfollows,(responseText)=>{
                    let attention = document.querySelector('.attention')
                    attention.children[1].innerHTML  = responseText.follow.length;
                })
                //粉丝数量
                AjaxRequest(userfalloweds,(responseText)=>{
                    let fans = document.querySelector('.fans');
                    fans.children[1].innerHTML = responseText.followeds.length;

                    loading.style.display = 'none';//加载完再显示页面
                    login.style.display = 'none';
                    login_ok.style.display = 'block';
                    bodier_section_unlogin.style.display = 'none';
                    bodier_section_login.style.display = 'block' ; 
                })

            }
            else {
                loading.style.display = 'none';//加载完再显示页面
                login.style.display = 'block';
                login_ok.style.display = 'none';
                bodier_section_unlogin.style.display = 'block';
                bodier_section_login.style.display = 'none' ;
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
        body.style = 'position:relative;overflow:hidden';
        body.style.width = 'calc(100% - 10px)' ;
    })
    exit.addEventListener('click',function(){
        loginBox.style.display = 'none' ;
        body.style = '';
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
            bodier_section_unlogin.style.display = 'none';
            loading.style.display = 'block';
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
            bodier_section_login.style.display = 'none' ;
            loading.style.display = 'block';
            flag = true;
            if(flag == true) {
                console.log('刷新成功');
                loginStatus(timestamp);
            }
        })
    })
    let login_myMusic = document.querySelector('.login_myMusic')
    login_myMusic.addEventListener('click',function(){
        loginBox.style.display = 'block';
        body.style = 'position:relative;overflow:hidden';
        body.style.width = 'calc(100% - 10px)' ;
    })
    //点击显示不同模块
    let person_section_list = document.querySelectorAll('.person_section_list')
    let login_bodier_section = document.querySelectorAll('.login_bodier_section')
    let array = [1,0,0,0,0]
    for(let i=0;i<person_section_list.length;i++){
        person_section_list[i].addEventListener('click',function(){
            for(let j=0;j<person_section_list.length;j++)
            {
                person_section_list[j].style.color = '#fff';
                login_bodier_section[j].style.display = 'none';
            }
            this.style.color = '#31c27c';
            login_bodier_section[i].style.display = 'block';
            //加载历史播放记录
            if(i==4) {
                if(array[i]==0) {
                    AjaxRequest(loginStatusUrl,(respondText)=>{
                        let history_list = document.querySelector('.historySong_list')
                        console.log(history_list)
                        let historyPlayUrl =defaultUrlHeader + '/user/record?uid=' + respondText.data.account.id +'&type=0';
                        AjaxRequest(historyPlayUrl,(respondText)=>{
                            console.log(respondText);
                            let Historymusic_number = document.querySelector('.Historymusic_number')
                            Historymusic_number.innerHTML = '(' + respondText.allData.length + ')';
                            for(let j=0;j<respondText.allData.length;j++){
                                let singerName = '';//名字
                                let min;//时间
                                let s;
                                let time = '';
                                let song_clone = song_section_list.cloneNode(true);
                                song_clone.children[0].children[0].innerHTML = respondText.allData[j].song.name;//歌名
                                song_clone.children[0].children[0].title = respondText.allData[j].song.name;
                                for(let k=0;k<respondText.allData[j].song.ar.length;k++)
                                {
                                    if( (k+1) == respondText.allData[j].song.ar.length) singerName = singerName +'<a href="javascript:;" class="singer" title ="'+respondText.allData[j].song.ar[k].name +'">'+respondText.allData[j].song.ar[k].name+'</a>';
                                    else singerName = singerName +'<a href="javascript:;" class="singer" title ="'+respondText.allData[j].song.ar[k].name +'">'+respondText.allData[j].song.ar[k].name+'</a>' + ' / ';
                                }//歌手
                                song_clone.children[1].innerHTML = singerName ;
                                song_clone.children[2].children[0].innerHTML = respondText.allData[j].song.al.name;//专辑
                                song_clone.children[2].children[0].title = respondText.allData[j].song.al.name;
                                min = parseInt(respondText.allData[j].song.dt/1000/60);
                                s = parseInt(respondText.allData[j].song.dt/1000%60);
                                if(min<10) time = '0' + min + ':';
                                else time = min + ':';
                                if(s<10) time += '0'+s;
                                else time += s;
                                song_clone.children[3].innerHTML = time ;//时间
                                console.log(song_clone);
                                history_list.appendChild(song_clone);                                
                            }                            
                            array[i] = 1;
                        })
                    })
                }
            }
        })
    }
})
//未登录特效
window.addEventListener('load',function(){})