window.addEventListener('load',function(){
    /*登录框显示与退出 */
    let login = document.querySelector('.login-no')
    let exit = document.querySelector('.exit')
    let loginBox = document.querySelector('.login')
    let img = document.querySelector('.login-yes')
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
    const defaultUrlHeader = "http://localhost:3000";
    const songsUrlHeader = "http://music.163.com";
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
        let loginUrl = defaultUrlHeader + '/login/cellphone?phone=' + phone + '&password=' + password;
        AjaxRequest(loginUrl,loginIn);
    })
    function loginIn(responseText) {
        console.log(responseText);
        if(responseText.code == 200) 
        {
            console.log(responseText)
            loginBox.style.display = 'none' ;
            login.style.display = 'none' ;
            let informationUrl = defaultUrlHeader+'/user/detail?uid='+ responseText.account.id;
            body.style = ''
            AjaxRequest(informationUrl,information);
        }
        else
        {
            tips[1].innerHTML = '密码错误!' ;
        }
    }
    function information(responseText) {
        img.children[0].src = responseText.profile.avatarUrl + '?param=40y40';
        img.style.display = 'block' ;
    }
})
