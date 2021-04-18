//预加载图片函数
function loadImage(url,callback){
    var img = new Image();
    img.src = url;

    if(img.complete){
        callback.call(img);
        return;
    }

    img.onload = function(){
        callback.call(img);
    }
}
//加载歌单推荐
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let playlist_list =document.querySelector('.playlist_list')
    let playlist_item = document.querySelector('.playlist_item')
    let playlist_itemUrl = defaultUrlHeader + '/playlist/hot';
    AjaxRequest(playlist_itemUrl,addPlaylist);
    function addPlaylist(respondText) { 
        for(let i=0;i<6;i++)
        {
            if(i==0) 
            {
                //加载默认歌单推荐
                let playlist_section_item = document.querySelector('.playlist_section_item');
                let playlist_section_list = document.querySelectorAll('.playlist_section_list');
                let playlistsUrl = defaultUrlHeader + '/top/playlist/highquality?cat=全部&limit=20'
                AjaxRequest(playlistsUrl, playlists,i)
                function playlists(respondText,i) {
                    playlist_section_item.remove();
                    for(let j = 0;j<respondText.playlists.length;j++)
                    {
                        let cloneItem = playlist_section_item.cloneNode(true);
                        loadImage((respondText.playlists[j].coverImgUrl + '?param=224y224'),preloadImg);//图片预加载
                        function preloadImg(){
                            cloneItem.children[0].children[0].src = this.src;
                        }
                        cloneItem.children[1].innerHTML = respondText.playlists[j].name;
                        cloneItem.children[2].innerHTML = '播放量:' + (respondText.playlists[j].playCount/10000).toFixed(1) +'万';
                        playlist_section_list[i].appendChild(cloneItem);
                    }
                    //创造小圆点
                    let part_background = document.querySelector('.part-background')
                    let length = respondText.playlists.length;
                    let buttonClick = document.createElement('div');
                    buttonClick.className = "buttonClick w";
                    buttonClick.dataset.index = 0;
                    if(length/5 < 1) length = 0;
                    else length =length/5;
                    for(let j=0; j<length ; j++)
                    {
                        let changeBtn = document.createElement('button');
                        changeBtn.className = "changeBtn";
                        changeBtn.type = "button";
                        changeBtn.dataset.index = j;
                        if(j==0) changeBtn.style.backgroundColor = '#999';
                        buttonClick.appendChild(changeBtn);
                    }
                    part_background.appendChild(buttonClick);
                }
                continue;
            }
            let clonePlaylist = playlist_item.cloneNode(true);
            clonePlaylist.style.color = '';
            clonePlaylist.innerHTML = respondText.tags[i-1].name ;
            playlist_list.appendChild(clonePlaylist)
            //加载歌单推荐
            let playlist_section_item = document.querySelector('.playlist_section_item');
            let playlist_section_list = document.querySelectorAll('.playlist_section_list');
            let playlistsUrl = defaultUrlHeader + '/top/playlist/highquality?cat='+respondText.tags[i-1].name +'&limit=20'
            AjaxRequest(playlistsUrl, playlists,i)
            function playlists(respondText,i) {
                playlist_section_item.remove();
                for(let j = 0;j<respondText.playlists.length;j++)
                {
                    let cloneItem = playlist_section_item.cloneNode(true);
                    cloneItem.children[0].children[0].dataset.src = respondText.playlists[j].coverImgUrl + '?param=224y224';
                    cloneItem.children[1].innerHTML = respondText.playlists[j].name;
                    cloneItem.children[2].innerHTML = '播放量:' + (respondText.playlists[j].playCount/10000).toFixed(1) +'万';
                    playlist_section_list[i].appendChild(cloneItem);
                }
                //创造小圆点
                let part_background = document.querySelector('.part-background')
                let length = respondText.playlists.length;
                let buttonClick = document.createElement('div');
                buttonClick.dataset.index = i;
                buttonClick.className = "buttonClick w";
                buttonClick.style.display = 'none' ;
                if(length/5 < 1) length = 0;
                else length = length/5;
                for(let j=0; j<length ; j++)
                {
                    let changeBtn = document.createElement('button');
                    changeBtn.className = "changeBtn";
                    changeBtn.type = "button";
                    changeBtn.dataset.index = j;
                    if(j==0) changeBtn.style.backgroundColor = '#999';
                    buttonClick.appendChild(changeBtn);
                }
                part_background.appendChild(buttonClick);
                playlist_event();
            }
        }
    }
})
//按钮事件
function playlist_event(){
    //显示隐藏左右按钮
    let part = document.querySelectorAll('.part-background')
    let playlist_leftBtn =document.querySelector('.playlist_leftBtn')
    let playlist_rightBtn =document.querySelector('.playlist_rightBtn')
    part[0].addEventListener('mouseenter',function(){
        playlist_leftBtn.style.visibility = 'visible';
        playlist_rightBtn.style.visibility = 'visible';
    })
    part[0].addEventListener('mouseleave',function(){
        playlist_leftBtn.style.visibility = 'hidden';
        playlist_rightBtn.style.visibility = 'hidden';
    })
    //左右按钮切换
    let playlist_section_list = document.querySelectorAll('.playlist_section_list')
    let changeBtn = document.querySelectorAll('.changeBtn')
    let index = 0;//默认对应页面为0
    let number = 0;
    //下方按钮切换
    let buttonClick = document.querySelectorAll('.buttonClick');
    //显示与隐藏不同模块
    let playlist_item = document.querySelectorAll('.playlist_item')
    let playlist_section = document.querySelectorAll('.playlist_section')
    for(let i =0;i<playlist_item.length;i++)
    {
        playlist_item[i].addEventListener('click',function(){
            //加载当前的照片
            if(i!=0){
                for(let j=0;j<playlist_section_list[i].children.length;j++){
                    let imgUrl =playlist_section_list[i].children[j].children[0].children[0].getAttribute('data-src');
                    loadImage(imgUrl,function(){
                        playlist_section_list[i].children[j].children[0].children[0].src = imgUrl;
                    })
                }
            }
            //显示当前页面的按钮
            for(let j =0;j<buttonClick.length;j++)
            {
                playlist_item[j].style.color = '';
                playlist_section[j].style.display = 'none';
                playlist_section[j].style.left = '0';
                buttonClick[j].style.display = 'none';//隐藏所有按钮
                if(buttonClick[j].getAttribute('data-index')==i){
                    buttonClick[j].style.display = 'flex';//找出对应的按钮
                }
            }
            this.style.color = '#31c27c';
            playlist_section[i].style.display = 'block';
            index = i;  //改变页面对应号码 
            number = 0;
            playlist_section_list[index].style.left = number*100 + '%';
            //显示按钮
            for(let i=0;i<buttonClick.length;i++)
            {
                for(let j=0;j<buttonClick[i].children.length;j++)
                {
                    buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                buttonClick[i].children[number].style.backgroundColor = '#999';
            } //还原对应按钮位置  
            playlist_leftBtn.style.display = 'none';
            playlist_rightBtn.style.display = 'block';                 
        })
    }
    function goNext(){
        playlist_section_list[index].style.left = -number*100 + '%';
        for(let i=0;i<buttonClick.length;i++)
        {
            if(buttonClick[i].getAttribute('data-index')==index){
                for(let j=0;j<buttonClick[i].children.length;j++)
                {
                    buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                buttonClick[i].children[number].style.backgroundColor = '#999';
                if(number == buttonClick[i].children.length-1)//显示隐藏按钮S
                playlist_rightBtn.style.display = 'none';
                else playlist_rightBtn.style.display = 'block';
                if(number == 0)playlist_leftBtn.style.display = 'none';
                else playlist_leftBtn.style.display = 'block';//显示隐藏按钮E
            }
        }    
    }
    //点击右边按钮
    playlist_rightBtn.addEventListener('click',function(){
        number++;
        goNext();
    })
    //点击左边按钮
    playlist_leftBtn.addEventListener('click',function(){
        number--;
        goNext();
    })
    //点击下方按钮 或者 经过
    for(let i=0;i<changeBtn.length;i++)
    {
        changeBtn[i].addEventListener('click',function(){
            number = this.getAttribute('data-index')
            goNext();
        })
        changeBtn[i].addEventListener('mouseenter',function(){
            this.style = 'background-color:#999';
        })
        changeBtn[i].addEventListener('mouseleave',function(){
            if(number != this.getAttribute('data-index')) this.style = 'background-color:#eee';
        })
    }
}
//加载新歌首发
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let newsongs_section_list = document.querySelectorAll('.newsongs_section_list')
    let newsongs_section_item = document.querySelector('.newsongs_section_item')
    newsongs_section_item.remove();
    let typeArray = [0,7,96,8,16]  //存储url对应类型值
    for(let i=0;i<typeArray.length;i++)
    {
        let newsongs_itemUrl = defaultUrlHeader + '/top/song?type=' + typeArray[i];
        AjaxRequest(newsongs_itemUrl,addNewsongs,i);
    }
    function addNewsongs(respondText,i){
        //添加页面元素
        for(let j=0;j<72&&j<respondText.data.length;j++)
        {
            let singerName = '';
            let min;
            let s;
            let time;
            let cloneNewsongs = newsongs_section_item.cloneNode(true);
            if(i==0) {
                loadImage((respondText.data[j].album.blurPicUrl + '?param=86y86'),preloadImg);//图片预加载
                function preloadImg(){
                    cloneNewsongs.children[0].children[0].src = this.src;
                }
            }
            else {
                cloneNewsongs.children[0].children[0].dataset.src = respondText.data[j].album.blurPicUrl + '?param=86y86';
            }
            cloneNewsongs.children[1].innerHTML = respondText.data[j].name;
            for(let k=0;k<respondText.data[j].artists.length;k++)
            {
                if( (k+1) == respondText.data[j].artists.length) singerName = singerName +'<a href="javascript:;" class="singer">'+respondText.data[j].artists[k].name+'</a>';
                else singerName = singerName = singerName + '<a href="javascript:;" class="singer">'+respondText.data[j].artists[k].name+'</a>' + ' / ';
            }
            cloneNewsongs.children[2].innerHTML = singerName;
            min = parseInt(respondText.data[j].duration/1000/60);
            s = parseInt(respondText.data[j].duration/1000%60);
            if(min<10) time = '0' + min + ':';
            else time = min + ':';
            if(s<10) time += '0'+s;
            else time += s;
            cloneNewsongs.children[3].innerHTML = time;
            newsongs_section_list[i].appendChild(cloneNewsongs);
        }
        //创建按钮
        let clickBtnNumber;//创建下方小按钮
        let part_background = document.querySelectorAll('.part-background');
        let buttonClick = document.createElement('div');
        buttonClick.className = "newsongs_buttonClick w";
        buttonClick.dataset.index = i
        if(i!=0) buttonClick.style.display = 'none' ;
        clickBtnNumber=Math.ceil(respondText.data.length/9);
        if(clickBtnNumber>8) clickBtnNumber=8;//限制按钮数量
        for(let j=0; j<clickBtnNumber ; j++)
        {
            let changeBtn = document.createElement('button');
            changeBtn.className = "newsongs_changeBtn";
            changeBtn.type = "button";
            changeBtn.dataset.index = j;
            if(j==0) changeBtn.style.backgroundColor = '#999';
            buttonClick.appendChild(changeBtn);
        }
        part_background[1].appendChild(buttonClick);
        newsongs_event();
    }
})
//按钮事件
function newsongs_event(){
    //显示隐藏左右按钮
    let part = document.querySelectorAll('.part-background')
    let newsongs_leftBtn =document.querySelector('.newsongs_leftBtn')
    let newsongs_rightBtn =document.querySelector('.newsongs_rightBtn')
    part[1].addEventListener('mouseenter',function(){
        newsongs_leftBtn.style.visibility = 'visible';
        newsongs_rightBtn.style.visibility = 'visible';
    })
    part[1].addEventListener('mouseleave',function(){
        newsongs_leftBtn.style.visibility = 'hidden';
        newsongs_rightBtn.style.visibility = 'hidden';
    })
    //左右按钮切换
    let newsongs_section_list = document.querySelectorAll('.newsongs_section_list')
    let newsongs_changeBtn = document.querySelectorAll('.newsongs_changeBtn')
    let index = 0;//默认对应页面为0
    let number = 0;
    //下方按钮切换
    let newsongs_buttonClick = document.querySelectorAll('.newsongs_buttonClick');
    //显示与隐藏不同模块
    let newsongs_item = document.querySelectorAll('.newsongs_item')
    let newsongs_section = document.querySelectorAll('.newsongs_section')
    for(let i =0;i<newsongs_item.length;i++)
    {
        newsongs_item[i].addEventListener('click',function(){
            //加载当前的照片
            if(i!=0){
                for(let j=0;j<newsongs_section_list[i].children.length;j++){
                    let imgUrl =newsongs_section_list[i].children[j].children[0].children[0].getAttribute('data-src');
                    loadImage(imgUrl,function(){
                        newsongs_section_list[i].children[j].children[0].children[0].src = imgUrl;
                    })
                }
            }
            //显示隐藏当前按钮
            for(let j =0;j<newsongs_buttonClick.length;j++)
            {
                newsongs_item[j].style.color = '';
                newsongs_section[j].style.display = 'none';
                newsongs_section[j].style.left = '0';
                newsongs_buttonClick[j].style.display = 'none';//隐藏所有按钮
                if(newsongs_buttonClick[j].getAttribute('data-index')==i){
                    newsongs_buttonClick[j].style.display = 'flex';//找出对应的按钮
                }
            }
            this.style.color = '#31c27c';
            newsongs_section[i].style.display = 'block';
            index = i;  //改变页面对应号码 
            number = 0;
            newsongs_section_list[index].style.left = number*100 + '%';
            //显示按钮
            for(let i=0;i<newsongs_buttonClick.length;i++)
            {
                for(let j=0;j<newsongs_buttonClick[i].children.length;j++)
                {
                    newsongs_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                newsongs_buttonClick[i].children[number].style.backgroundColor = '#999';
            } //还原对应按钮位置  
            newsongs_leftBtn.style.display = 'none';
            newsongs_rightBtn.style.display = 'block';                 
        })
    }
    function newsongs_goNext(){
        newsongs_section_list[index].style.left = -number*100 + '%';
        for(let i=0;i<newsongs_buttonClick.length;i++)
        {
            if(newsongs_buttonClick[i].getAttribute('data-index')==index){
                for(let j=0;j<newsongs_buttonClick[i].children.length;j++)
                {
                    newsongs_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                newsongs_buttonClick[i].children[number].style.backgroundColor = '#999';
                if(number == newsongs_buttonClick[i].children.length-1)//显示隐藏按钮S
                newsongs_rightBtn.style.display = 'none';
                else newsongs_rightBtn.style.display = 'block';
                if(number == 0)newsongs_leftBtn.style.display = 'none';
                else newsongs_leftBtn.style.display = 'block';//显示隐藏按钮E
            }
        }    
    }
    //点击右边按钮
    newsongs_rightBtn.addEventListener('click',function(){
        number++;
        newsongs_goNext();
    })
    //点击左边按钮
    newsongs_leftBtn.addEventListener('click',function(){
        number--;
        newsongs_goNext();
    })
    //点击下方按钮
    for(let i=0;i<newsongs_changeBtn.length;i++)
    {
        newsongs_changeBtn[i].addEventListener('click',function(){
            number = this.getAttribute('data-index')
            newsongs_goNext();
        })
        newsongs_changeBtn[i].addEventListener('mouseenter',function(){
            this.style = 'background-color:#999';
        })
        newsongs_changeBtn[i].addEventListener('mouseleave',function(){
            if(number != this.getAttribute('data-index')) this.style = 'background-color:#eee';
        })
    }
}
//加载精彩推荐
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let commend_section_list = document.querySelector('.commend_section_list')
    let commend_section_item = document.querySelector('.commend_section_item')
    commend_section_item.remove();
    let commend_itemUrl = defaultUrlHeader + '/personalized/privatecontent/list?limit=8'
    AjaxRequest(commend_itemUrl,addCommend);
    function addCommend(respondText) {
        //创建页面元素
        for(let i=0;i<respondText.result.length;i++)
        {
            let cloneCommend_Item = commend_section_item.cloneNode(true);
            loadImage((respondText.result[i].picUrl + '?param=590y281'),preloadImg);//图片预加载
            function preloadImg(){
                cloneCommend_Item.children[0].children[0].src  = this.src;
            }
            commend_section_list.appendChild(cloneCommend_Item);
        }
        //创建小按钮
        let clickBtnNumber;//创建下方小按钮
        let part_background = document.querySelectorAll('.part-background');
        let buttonClick = document.createElement('div');
        buttonClick.className = "commend_buttonClick w"
        clickBtnNumber=Math.ceil(respondText.result.length/2);
        for(let j=0; j<clickBtnNumber ; j++)
        {
            let changeBtn = document.createElement('button');
            changeBtn.className = "commend_changeBtn";
            changeBtn.type = "button";
            changeBtn.dataset.index = j;
            if(j==0) changeBtn.style.backgroundColor = '#999';
            buttonClick.appendChild(changeBtn);
        }
        part_background[2].appendChild(buttonClick);
        commend_event();
    }
})
//按钮事件
function commend_event() {
    //显示隐藏左右按钮
    let part = document.querySelectorAll('.part-background')
    let commend_leftBtn =document.querySelector('.commend_leftBtn')
    let commend_rightBtn =document.querySelector('.commend_rightBtn')
    part[2].addEventListener('mouseenter',function(){
        commend_leftBtn.style.visibility = 'visible';
        commend_rightBtn.style.visibility = 'visible';
    })
    part[2].addEventListener('mouseleave',function(){
        commend_leftBtn.style.visibility = 'hidden';
        commend_rightBtn.style.visibility = 'hidden';
    })
    //左右按钮切换
    let commend_section_list = document.querySelectorAll('.commend_section_list')
    let commend_changeBtn = document.querySelectorAll('.commend_changeBtn')
    let index = 0;//默认对应页面为0
    let number = 0;
    //下方按钮切换
    let commend_buttonClick = document.querySelector('.commend_buttonClick');
    function commend_goNext(){
        commend_section_list[index].style.left = -number*100 + '%';          
        for(let j=0;j<commend_buttonClick.children.length;j++)
        {
            commend_buttonClick.children[j].style.backgroundColor = '#eee';
        }
        commend_buttonClick.children[number].style.backgroundColor = '#999';
        if(number == commend_buttonClick.children.length-1)//显示隐藏按钮S
        commend_rightBtn.style.display = 'none';
        else commend_rightBtn.style.display = 'block';
        if(number == 0)commend_leftBtn.style.display = 'none';
        else commend_leftBtn.style.display = 'block';//显示隐藏按钮E   
    }
    //点击右边按钮
    commend_rightBtn.addEventListener('click',function(){
        number++;
        commend_goNext();
    })
    //点击左边按钮
    commend_leftBtn.addEventListener('click',function(){
        number--;
        commend_goNext();
    })
    //点击下方按钮
    for(let i=0;i<commend_changeBtn.length;i++)
    {
        commend_changeBtn[i].addEventListener('click',function(){
            number = this.getAttribute('data-index')
            commend_goNext();
        })
        commend_changeBtn[i].addEventListener('mouseenter',function(){
            this.style = 'background-color:#999';
        })
        commend_changeBtn[i].addEventListener('mouseleave',function(){
            if(number != this.getAttribute('data-index')) this.style = 'background-color:#eee';
        })
    }    
}
//加载新碟首发
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let newDisc_section_list = document.querySelectorAll('.newDisc_section_list')
    let newDisc_section_item = document.querySelector('.newDisc_section_item')
    newDisc_section_item.remove();
    let typeArray = ['ALL','ZH','EA','KR','JP']  //存储url对应类型值
    for(let i=0;i<typeArray.length;i++)
    {
        let newDisc_itemUrl = defaultUrlHeader + '/album/new?limit=20&area='+typeArray[i];
        AjaxRequest(newDisc_itemUrl,addNewDisc,i);
    }
    function addNewDisc(respondText,i){
        //添加页面元素
        for(let j=0;j<respondText.albums.length;j++)
        {
            let singerName = '';
            let cloneNewDisc = newDisc_section_item.cloneNode(true);
            if(i==0){
                loadImage((respondText.albums[j].blurPicUrl + '?param=224y224'),preloadImg);//图片预加载
                function preloadImg(){
                    cloneNewDisc.children[0].children[0].src = this.src;
                }
            }
            else {
                cloneNewDisc.children[0].children[0].dataset.src = respondText.albums[j].blurPicUrl + '?param=224y224';
            }
            cloneNewDisc.children[1].innerHTML = respondText.albums[j].name;
            for(let k=0;k<respondText.albums[j].artists.length;k++)
            {
                if( (k+1) == respondText.albums[j].artists.length) singerName = singerName +'<a href="javascript:;" class="singer">'+respondText.albums[j].artists[k].name+'</a>';
                else singerName = singerName + '<a href="javascript:;" class="singer">'+respondText.albums[j].artists[k].name+'</a>' + ' / ';
            }
            cloneNewDisc.children[2].innerHTML = singerName;
            newDisc_section_list[i].appendChild(cloneNewDisc);
        }
        //创建按钮
        let clickBtnNumber;//创建下方小按钮
        let part_background = document.querySelectorAll('.part-background');
        let buttonClick = document.createElement('div');
        buttonClick.className = "newDisc_buttonClick w";
        buttonClick.dataset.index = i
        if(i!=0) buttonClick.style.display = 'none' ;
        clickBtnNumber=Math.ceil(respondText.albums.length/10);
        if(clickBtnNumber>5) clickBtnNumber=5;//限制按钮数量
        for(let j=0; j<clickBtnNumber ; j++)
        {
            let changeBtn = document.createElement('button');
            changeBtn.className = "newDisc_changeBtn";
            changeBtn.type = "button";
            changeBtn.dataset.index = j;
            if(j==0) changeBtn.style.backgroundColor = '#999';
            buttonClick.appendChild(changeBtn);
        }
        part_background[3].appendChild(buttonClick);
        newDisc_event();
    }
})
//按钮事件
function newDisc_event(){
    //显示隐藏左右按钮
    let part = document.querySelectorAll('.part-background')
    let newDisc_leftBtn =document.querySelector('.newDisc_leftBtn')
    let newDisc_rightBtn =document.querySelector('.newDisc_rightBtn')
    part[3].addEventListener('mouseenter',function(){
        newDisc_leftBtn.style.visibility = 'visible';
        newDisc_rightBtn.style.visibility = 'visible';
    })
    part[3].addEventListener('mouseleave',function(){
        newDisc_leftBtn.style.visibility = 'hidden';
        newDisc_rightBtn.style.visibility = 'hidden';
    })
    //左右按钮切换
    let newDisc_section_list = document.querySelectorAll('.newDisc_section_list')
    let newDisc_changeBtn = document.querySelectorAll('.newDisc_changeBtn')
    let index = 0;//默认对应页面为0
    let number = 0;
    //下方按钮切换
    let newDisc_buttonClick = document.querySelectorAll('.newDisc_buttonClick');
    //显示与隐藏不同模块
    let newDisc_item = document.querySelectorAll('.newDisc_item')
    let newDisc_section = document.querySelectorAll('.newDisc_section')
    for(let i =0;i<newDisc_item.length;i++)
    {
        newDisc_item[i].addEventListener('click',function(){
            //加载当前的照片
            if(i!=0){
                for(let j=0;j<newDisc_section_list[i].children.length;j++){
                    let imgUrl =newDisc_section_list[i].children[j].children[0].children[0].getAttribute('data-src');
                    loadImage(imgUrl,function(){
                        newDisc_section_list[i].children[j].children[0].children[0].src = imgUrl;
                    })
                }
            }
            //显示隐藏当前按钮
            for(let j =0;j<newDisc_buttonClick.length;j++)
            {
                newDisc_item[j].style.color = '';
                newDisc_section[j].style.display = 'none';
                newDisc_section[j].style.left = '0';
                newDisc_buttonClick[j].style.display = 'none';//隐藏所有按钮
                if(newDisc_buttonClick[j].getAttribute('data-index')==i){
                    newDisc_buttonClick[j].style.display = 'flex';//找出对应的按钮
                }
            }
            this.style.color = '#31c27c';
            newDisc_section[i].style.display = 'block';
            index = i;  //改变页面对应号码 
            number = 0;
            newDisc_section_list[index].style.left = number*100 + '%';
            //显示按钮
            for(let i=0;i<newDisc_buttonClick.length;i++)
            {
                for(let j=0;j<newDisc_buttonClick[i].children.length;j++)
                {
                    newDisc_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                newDisc_buttonClick[i].children[number].style.backgroundColor = '#999';
            } //还原对应按钮位置  
            newDisc_leftBtn.style.display = 'none';
            newDisc_rightBtn.style.display = 'block';                 
        })
    }
    function newDisc_goNext(){
        newDisc_section_list[index].style.left = -number*100 + '%';
        for(let i=0;i<newDisc_buttonClick.length;i++)
        {
            if(newDisc_buttonClick[i].getAttribute('data-index')==index){
                for(let j=0;j<newDisc_buttonClick[i].children.length;j++)
                {
                    newDisc_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                newDisc_buttonClick[i].children[number].style.backgroundColor = '#999';
                if(number == newDisc_buttonClick[i].children.length-1)//显示隐藏按钮S
                newDisc_rightBtn.style.display = 'none';
                else newDisc_rightBtn.style.display = 'block';
                if(number == 0)newDisc_leftBtn.style.display = 'none';
                else newDisc_leftBtn.style.display = 'block';//显示隐藏按钮E
            }
        }    
    }
    //点击右边按钮
    newDisc_rightBtn.addEventListener('click',function(){
        number++;
        newDisc_goNext();
    })
    //点击左边按钮
    newDisc_leftBtn.addEventListener('click',function(){
        number--;
        newDisc_goNext();
    })
    //点击下方按钮
    for(let i=0;i<newDisc_changeBtn.length;i++)
    {
        newDisc_changeBtn[i].addEventListener('click',function(){
            number = this.getAttribute('data-index')
            newDisc_goNext();
        })
        newDisc_changeBtn[i].addEventListener('mouseenter',function(){
            this.style = 'background-color:#999';
        })
        newDisc_changeBtn[i].addEventListener('mouseleave',function(){
            if(number != this.getAttribute('data-index')) this.style = 'background-color:#eee';
        })
    }
}
//加载排行榜
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let rank_section_item = document.querySelector('.rank_section_item')
    let rank_section_list = document.querySelector('.rank_section_list')
    let rankUrl = defaultUrlHeader + '/toplist';
    rank_section_item.remove();
    AjaxRequest(rankUrl,function(respondText){
        for(let i =0;i<5;i++){
            let rank_Clone = rank_section_item.cloneNode(true);
            let rank_id = respondText.list[i].id;
            let rankitemUrl = defaultUrlHeader + '/playlist/detail?id=' + rank_id;
            rank_Clone.children[2].innerHTML = respondText.list[i].name;
            AjaxRequest(rankitemUrl,function(respondText){
                for(let j =0;j<3;j++){
                    let rank_name = respondText.playlist.tracks[j].name;
                    let rank_singer = '';
                    for(let k = 0;k<respondText.playlist.tracks[j].ar.length;k++){
                        if((k+1) == respondText.playlist.tracks[j].ar.length) {
                            rank_singer += respondText.playlist.tracks[j].ar[k].name;
                        }
                        else {
                            rank_singer += respondText.playlist.tracks[j].ar[k].name + '/';
                        }
                    }
                    rank_Clone.children[5].children[j].children[1].children[0].innerHTML = rank_name;
                    rank_Clone.children[5].children[j].children[2].children[0].innerHTML = rank_singer;
                }
            })
            rank_section_list.appendChild(rank_Clone);
        }
    })
})
//加载MV
document.addEventListener('DOMContentLoaded',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let MV_section_list = document.querySelectorAll('.MV_section_list')
    let MV_section_item = document.querySelector('.MV_section_item')
    MV_section_item.remove();
    let typeArray = ['全部','内地','港台','欧美','韩国','日本']  //存储url对应类型值
    for(let i=0;i<typeArray.length;i++)
    {
        let MV_itemUrl = defaultUrlHeader + '/mv/all?limit=40&area='+typeArray[i];
        AjaxRequest(MV_itemUrl,addMV,i);
    }
    function addMV(respondText,i){
        //添加页面元素
        for(let j=0;j<respondText.data.length;j++)
        {
            let singerName = '';
            let cloneMV = MV_section_item.cloneNode(true);
            if(i==0){
                loadImage((respondText.data[j].cover + '?param=224y127'),preloadImg);//图片预加载
                function preloadImg(){
                    cloneMV.children[0].children[0].src = this.src;
                }
            }
            else {
                cloneMV.children[0].children[0].dataset.src = respondText.data[j].cover + '?param=224y127';
            }
            cloneMV.children[1].innerHTML = respondText.data[j].name;
            for(let k=0;k<respondText.data[j].artists.length;k++)
            {
                if( (k+1) == respondText.data[j].artists.length) singerName = singerName +'<a href="javascript:;" class="singer">'+respondText.data[j].artists[k].name+'</a>';
                else singerName = singerName + '<a href="javascript:;" class="singer">'+respondText.data[j].artists[k].name+'</a>' + ' / ';
            }
            cloneMV.children[2].innerHTML = singerName;
            let playCount = respondText.data[j].playCount;
            if(playCount>10000) cloneMV.children[3].children[1].innerHTML = (playCount/10000).toFixed(1) + '万';
            else cloneMV.children[3].children[1].innerHTML = playCount;
            MV_section_list[i].appendChild(cloneMV);
        }
        //创建按钮
        let clickBtnNumber;//创建下方小按钮
        let part_background = document.querySelectorAll('.part-background');
        let buttonClick = document.createElement('div');
        buttonClick.className = "MV_buttonClick w";
        buttonClick.dataset.index = i;
        if(i!=0) buttonClick.style.display = 'none' ;
        clickBtnNumber=Math.ceil(respondText.data.length/10);
        for(let j=0; j<clickBtnNumber ; j++)
        {
            let changeBtn = document.createElement('button');
            changeBtn.className = "MV_changeBtn";
            changeBtn.type = "button";
            changeBtn.dataset.index = j;
            if(j==0) changeBtn.style.backgroundColor = '#999';
            buttonClick.appendChild(changeBtn);
        }
        part_background[5].appendChild(buttonClick);  
        MV_event();   
    }
})
//按钮事件
function MV_event(){
    //显示隐藏左右按钮
    let part = document.querySelectorAll('.part-background')
    let MV_leftBtn =document.querySelector('.MV_leftBtn')
    let MV_rightBtn =document.querySelector('.MV_rightBtn')
    part[5].addEventListener('mouseenter',function(){
        MV_leftBtn.style.visibility = 'visible';
        MV_rightBtn.style.visibility = 'visible';
    })
    part[5].addEventListener('mouseleave',function(){
        MV_leftBtn.style.visibility = 'hidden';
        MV_rightBtn.style.visibility = 'hidden';
    })
        //左右按钮切换
    let MV_section_list = document.querySelectorAll('.MV_section_list')
    let MV_changeBtn = document.querySelectorAll('.MV_changeBtn')
    let index = 0;//默认对应页面为0
    let number = 0;
    //下方按钮切换
    let MV_buttonClick = document.querySelectorAll('.MV_buttonClick');
    //显示与隐藏不同模块
    let MV_item = document.querySelectorAll('.MV_item')
    let MV_section = document.querySelectorAll('.MV_section')
    for(let i =0;i<MV_item.length;i++)
    {
        MV_item[i].addEventListener('click',function(){
            //加载当前的照片
            if(i!=0){
                for(let j=0;j<MV_section_list[i].children.length;j++){
                    let imgUrl =MV_section_list[i].children[j].children[0].children[0].getAttribute('data-src');
                    loadImage(imgUrl,function(){
                        MV_section_list[i].children[j].children[0].children[0].src = imgUrl;
                    })
                }
            }
            //显示隐藏当前按钮
            for(let j =0;j<MV_buttonClick.length;j++)
            {
                MV_item[j].style.color = '';
                MV_section[j].style.display = 'none';
                MV_section[j].style.left = '0';
                MV_buttonClick[j].style.display = 'none';//隐藏所有按钮
                if(MV_buttonClick[j].getAttribute('data-index')==i){
                    MV_buttonClick[j].style.display = 'flex';//找出对应的按钮
                }
            }
            this.style.color = '#31c27c';
            MV_section[i].style.display = 'block';
            index = i;  //改变页面对应号码 
            number = 0;
            MV_section_list[index].style.left = number*100 + '%';
            //显示按钮
            for(let i=0;i<MV_buttonClick.length;i++)
            {
                for(let j=0;j<MV_buttonClick[i].children.length;j++)
                {
                    MV_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                MV_buttonClick[i].children[number].style.backgroundColor = '#999';
            } //还原对应按钮位置  
            MV_leftBtn.style.display = 'none';
            MV_rightBtn.style.display = 'block';                 
        })
    }
    function MV_goNext(){
        MV_section_list[index].style.left = -number*100 + '%';
        for(let i=0;i<MV_buttonClick.length;i++)
        {
            if(MV_buttonClick[i].getAttribute('data-index')==index){
                for(let j=0;j<MV_buttonClick[i].children.length;j++)
                {
                    MV_buttonClick[i].children[j].style.backgroundColor = '#eee';
                }
                MV_buttonClick[i].children[number].style.backgroundColor = '#999';
                if(number == MV_buttonClick[i].children.length-1)//显示隐藏按钮S
                MV_rightBtn.style.display = 'none';
                else MV_rightBtn.style.display = 'block';
                if(number == 0)MV_leftBtn.style.display = 'none';
                else MV_leftBtn.style.display = 'block';//显示隐藏按钮E
            }
        }    
    }
    //点击右边按钮
    MV_rightBtn.addEventListener('click',function(){
        number++;
        MV_goNext();
    })
    //点击左边按钮
    MV_leftBtn.addEventListener('click',function(){
        number--;
        MV_goNext();
    })
    //点击下方按钮
    for(let i=0;i<MV_changeBtn.length;i++)
    {
        MV_changeBtn[i].addEventListener('click',function(){
            number = this.getAttribute('data-index')
            MV_goNext();
        })
        MV_changeBtn[i].addEventListener('mouseenter',function(){
            this.style = 'background-color:#999';
        })
        MV_changeBtn[i].addEventListener('mouseleave',function(){
            if(number != this.getAttribute('data-index')) this.style = 'background-color:#eee';
        })
    }
}