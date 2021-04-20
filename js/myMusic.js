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
    /* 判断登录状态*/
    let loginRefreshUrl = defaultUrlHeader + '/login/refresh';
    let loginStatusUrl = defaultUrlHeader + '/login/Status';
    let timestamp = new Date().getTime();//获得当前时间
    setInterval(()=>{
        timestamp = new Date().getTime();
    },1000)
    function loginStatus(timestamp){
        login.style.display = 'block';
        login_ok.style.display = 'none';
        bodier_section_unlogin.style.display = 'block';
        bodier_section_login.style.display = 'none' ;
        AjaxRequest((loginRefreshUrl + '?timestamp=' + timestamp),function(responseText){
            console.log(responseText);
            AjaxRequest((loginStatusUrl + '?timestamp=' + timestamp),function(responseText){
                console.log(responseText);
                if(responseText.account == null)
                {
                    login.style.display = 'none';
                    login_ok.style.display = 'block';
                    bodier_section_unlogin.style.display = 'none';
                    bodier_section_login.style.display = 'block' ;
                    login_ok.children[0].src = responseText.data.profile.avatarUrl+'?param=40y40';
                    loginImg.src = responseText.data.profile.avatarUrl+'?param=70y70';
                    loginName.innerHTML = responseText.data.profile.nickname;
                }                    
            })
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

    let login_myMusic = document.querySelector('.login_myMusic')
    login_myMusic.addEventListener('click',function(){
        loginBox.style.display = 'block';
        body.style = 'position:relative;overflow:hidden';
        body.style.width = 'calc(100% - 10px)' ;
    })
})
//未登录特效
window.addEventListener('load',function(){})