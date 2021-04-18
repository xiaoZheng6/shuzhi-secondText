window.addEventListener('load',function(){
    const defaultUrlHeader = "http://localhost:3000";
    let hotSearch_item = document.querySelector('.hotSearch_item')
    let hotSearch_list = document.querySelector('.hotSearch_list')
    let hotsearchUrl = defaultUrlHeader + '/search/hot/detail'
    AjaxRequest(hotsearchUrl,hotsearch);
    let hotSearchButtomList = document.querySelector('.hotSearch')
    let hotsearchBox = document.querySelector('.search_input')
    let searchKeyResult = document.querySelector('.searchResult')
    //触发下拉栏
    hotsearchBox.addEventListener('focus',function(){
        if(hotsearchBox.value == '') hotSearchButtomList.className = 'hotSearch drop';
        else searchKeyResult.className = 'searchResult drop';
        hotsearchBox.addEventListener('keyup',function(e){
            if(this.value == '') {
                hotSearchButtomList.className = 'hotSearch drop';
                searchKeyResult.className = 'searchResult';
            }
            else {
                if(e.key != 'Enter')
                {
                    hotSearchButtomList.className = 'hotSearch';
                    searchKeyResult.className = 'searchResult drop';
                }
            }
        })
    })
    hotsearchBox.addEventListener('blur',function(){
            hotSearchButtomList.className = 'hotSearch' ;
            searchKeyResult.className = 'searchResult';
    })
    //获取热门搜索并渲染在搜索框上
    function hotsearch(respondText) {
        for(let i = 0; i<5;i++)
        {
            if(i==0) {
                hotSearch_item.children[0].innerHTML = i+1 ;
                hotSearch_item.children[1].innerHTML = respondText.data[i].searchWord ;
                hotSearch_item.children[2].innerHTML = (respondText.data[i].score/10000).toFixed(1) + '万';
            }
            else {
                let hotSearch_itemClone = hotSearch_item.cloneNode(true)
                hotSearch_itemClone.children[0].innerHTML = i+1 ;
                hotSearch_itemClone.children[1].innerHTML = respondText.data[i].searchWord ;
                hotSearch_itemClone.children[2].innerHTML = (respondText.data[i].score/10000).toFixed(1) + '万';
                hotSearch_list.appendChild(hotSearch_itemClone);
            } 
        }
    }
    hotsearchBox.addEventListener('focus',function(){
        //删除历史记录
        let delectAll = document.querySelector('.delectHistory')
        delectAll.onclick = function() {
            let history_item = document.querySelectorAll('.history_item')
            for(let i = 0;i<history_item.length ;i++) 
            {
                history_item[i].remove();
            }
            hotsearchBox.focus();
        }
        let delectItem = document.querySelectorAll('.delect')
        for(let i=0;i<delectItem.length;i++)
        {
            delectItem[i].onclick = function(e){
                this.parentNode.remove();
                hotsearchBox.focus();
                e.stopPropagation();
            }
        }
        //点击已有搜索
        let clickHotSearch = document.querySelectorAll('.hotSearch_item')
        let clickHistorySearchs =document.querySelectorAll('.history_item') 
        for(let i =0;i<clickHotSearch.length ;i++)
        {
            clickHotSearch[i].onclick = function(){
                hotsearchBox.value = this.children[1].innerHTML;
                hotsearchBox.focus();
                //点击后显示内容
                let keyword = hotsearchBox.value ;
                let keywordUrl = defaultUrlHeader + '/search/suggest?keywords=' + keyword;
                AjaxRequest(keywordUrl,keywordInformation,keyword)
            }
        }
        for(let i =0;i<clickHistorySearchs.length;i++)
        {
            clickHistorySearchs[i].onclick = function() {
                hotsearchBox.value = this.children[0].textContent;
                hotsearchBox.focus();
                //点击后显示内容
                let keyword = hotsearchBox.value ;
                let keywordUrl = defaultUrlHeader + '/search/suggest?keywords=' + keyword;
                AjaxRequest(keywordUrl,keywordInformation,keyword)
            }
        }
        //将信息放入搜索历史中
        let searchBtn = document.querySelector('.search_input_btn')
        let history_list = document.querySelector('.history_list')
        let clickHistorySearch =document.querySelector('.history_item')
        function putIntoHistory() {
            let history_item = document.querySelectorAll('.history_item')
            let searchMessage = hotsearchBox.value;
            if(searchMessage == '') {
                return;
            }
            for(let i=0;i<history_item.length;i++)
            {
                if(searchMessage == history_item[i].children[0].innerHTML) 
                {
                    return;
                }
            }
            let cloneHistory = clickHistorySearch.cloneNode(true);
            cloneHistory.style = '';
            cloneHistory.children[0].innerHTML =searchMessage;
            cloneHistory.title = searchMessage ;
            history_list.appendChild(cloneHistory);
        }
        searchBtn.addEventListener('click',putIntoHistory);
        hotsearchBox.addEventListener('keyup',function(e){            
            if(e.key === "Enter") 
            {
                putIntoHistory();
                hotsearchBox.blur();
            }
        })        
    })
    //触发关键字搜索栏
    let searchResult = document.querySelector('.searchResult')
    let searchResult_list = document.querySelector('.searchResult-list')
    let searchSong = document.querySelector('.searchSong')
    let searchSinger = document.querySelector('.searchSinger')
    let searchAlbum = document.querySelector('.searchAlbum')
    let searchMv = document.querySelector('.searchMv')
    hotsearchBox.addEventListener('focus',function(){
        hotsearchBox.addEventListener('keyup',function(e){
            let keyword = this.value ;
            let keywordUrl = defaultUrlHeader + '/search/suggest?keywords=' + keyword;
            if(e.key != 'Enter'){
                AjaxRequest(keywordUrl,keywordInformation,keyword)
            }
        })      
    })
    //改变关键字颜色
    function showData(val,keywords) {
        return val.innerHTML.replace(keywords , '<span class="searchKeyWord">' + keywords + '</span>')
    }
    //关键字搜索
    function keywordInformation(respondText,keyword){
        if(respondText.code == 200&&respondText.result.order !=undefined)
        {
            searchResult.className = 'searchResult drop';
            var arrayType = [0,0,0,0];
            for(let i =0; i<respondText.result.order.length ;i++)
            {
                let judge = respondText.result.order[i];
                if(judge == 'songs') arrayType[0]=1;
                if(judge == 'artists') arrayType[1]=1;
                if(judge == 'albums') arrayType[2]=1;
                if(judge == 'playlists') arrayType[3]=1;

            }
            //先清除所有信息
            let searchResult_lists = document.querySelectorAll('.searchResult-list')
            for(let i=0;i<searchResult_lists.length;i++)
                searchResult_lists[i].remove();
            //若没找到信息则隐藏对应的菜单，如有则添加信息
            for(let j=0;j< arrayType.length;j++)
            {                   
                if(j==0&&arrayType[j]==1) {
                    searchSong.style.display = 'block';
                    for(let i =0;i<respondText.result.songs.length;i++)
                    {
                        let titleTips = ''; 
                        let cloneSearch_Item = searchResult_list.cloneNode(true);
                        let allSingerName = '-';
                        let songsName = respondText.result.songs[i].name;
                        titleTips +=respondText.result.songs[i].name;                 
                        cloneSearch_Item.children[0].innerHTML = songsName;
                        for(let k = 0; k< respondText.result.songs[i].artists.length;k++)
                        {
                            if(k== respondText.result.songs[i].artists.length-1)
                            {
                                allSingerName = allSingerName + respondText.result.songs[i].artists[k].name ;
                            }
                            else
                            allSingerName = allSingerName + respondText.result.songs[i].artists[k].name +',';
                        }
                        cloneSearch_Item.children[1].innerHTML = allSingerName;
                        titleTips += allSingerName;
                        cloneSearch_Item.title = titleTips ;
                        cloneSearch_Item.innerHTML = showData(cloneSearch_Item,keyword);
                        searchSong.appendChild(cloneSearch_Item);
                    }
                    continue;
                }
                if(j==0&&arrayType[j]==0) {
                    searchSong.style.display = 'none';
                    continue;
                }
                if(j==1&&arrayType[j]==1) {
                    searchSinger.style.display = 'block';
                    for(let i =0;i<respondText.result.artists.length;i++)
                    {
                        let titleTips = '';
                        let cloneSearch_Item = searchResult_list.cloneNode(true);
                        cloneSearch_Item.children[0].innerHTML = respondText.result.artists[i].name;
                        cloneSearch_Item.children[1].innerHTML = '';
                        titleTips += respondText.result.artists[i].name;
                        cloneSearch_Item.title = titleTips ;
                        cloneSearch_Item.innerHTML = showData(cloneSearch_Item,keyword);
                        searchSinger.appendChild(cloneSearch_Item);
                    }
                    continue;
                }
                if(j==1&&arrayType[j]==0) {
                    searchSinger.style.display = 'none';
                    continue;
                }
                if(j==2&&arrayType[j]==1) {
                    searchAlbum.style.display = 'block';
                    for(let i =0;i<respondText.result.albums.length;i++)
                    {
                        let titleTips = '';
                        let cloneSearch_Item = searchResult_list.cloneNode(true);
                        let allSingerName = '-';
                        cloneSearch_Item.children[0].innerHTML = respondText.result.albums[i].name; 
                        allSingerName = allSingerName + respondText.result.albums[i].artist.name ;
                        cloneSearch_Item.children[1].innerHTML = allSingerName;
                        titleTips += respondText.result.albums[i].name + allSingerName;
                        cloneSearch_Item.title = titleTips ;
                        cloneSearch_Item.innerHTML = showData(cloneSearch_Item,keyword);
                        searchAlbum.appendChild(cloneSearch_Item);
                    }
                    continue;
                }
                if(j==2&&arrayType[j]==0) {
                    searchAlbum.style.display = 'none';
                    continue;
                }
                if(j==3&&arrayType[j]==1) {
                    searchMv.style.display = 'block';
                    for(let i =0;i<respondText.result.playlists.length;i++)
                    {
                        let titleTips = '';
                        let cloneSearch_Item = searchResult_list.cloneNode(true);
                        cloneSearch_Item.children[0].innerHTML = respondText.result.playlists[i].name;
                        cloneSearch_Item.children[1].innerHTML = '';
                        titleTips += respondText.result.playlists[i].name;
                        cloneSearch_Item.title = titleTips;
                        cloneSearch_Item.innerHTML = showData(cloneSearch_Item,keyword);
                        searchMv.appendChild(cloneSearch_Item);
                    }
                    continue;
                }
                if(j==3&&arrayType[j]==0) {
                    searchMv.style.display = 'none';
                    continue;
                }
            }
            //添加信息
        }
        else searchResult.className = 'searchResult';
    }
    //显示回到顶部的按钮
    let goTop = document.querySelector('.goTop')
    window.addEventListener('scroll',function(){
        var long =document.documentElement.scrollTop || document.body.scrollTop;
        if(long>140) goTop.style.display = 'block' ;
        else goTop.style.display = 'none';
    })
    goTop.addEventListener('click',function(){
        window.scrollTo({ 
            top: 0,
            behavior: "smooth" 
        })
    })
})