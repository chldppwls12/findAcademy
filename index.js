const find_list = document.querySelector('.find-list');
const find_map = document.querySelector('.find-map');
const search_bar = document.querySelector('.search-bar');

const urlList = {
    'map': 'main.html',
    'list': 'list.html',
}

find_map.addEventListener("click", () => {
    let keyword = search_bar.value;
    if(keyword){
        let url = `${window.location.origin}/${urlList.map}?keyword=${keyword}`;
        window.location = url;
    }
    else{
        alert('검색어를 입력해주세요');
    }
});

find_list.addEventListener("click", () => {
    let keyword = search_bar.value;
    if(keyword){
        let url = `${window.location.origin}/${urlList.list}?keyword=${keyword}`;
        window.location = url;
    }
    else{
        alert("검색어를 입력해주세요");
    }
});

