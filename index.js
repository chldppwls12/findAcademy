const find_list = document.querySelector('.find-list');
const find_map = document.querySelector('.search-btn');
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


search_bar.addEventListener("keyup", (event) => {
    if(event.keyCode === 13){
        find_map.click();
    }
})
