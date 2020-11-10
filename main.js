/*지도 가져오기*/
let container = document.querySelector('#map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(37.2872912604, 126.9910303332), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    console.log('지도생성')
let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

 
const search_bar = document.querySelector(".search-bar");
const search_btn = document.querySelector(".search-btn");

const math_btn = document.querySelector(".info-math");
const english_btn = document.querySelector(".info-english");
const music_btn = document.querySelector(".info-music");
const art_btn = document.querySelector(".info-art");
const essay_btn = document.querySelector(".info-essay");
const etc_btn = document.querySelector(".info-etc");

// 장소 검색 객체를 생성합니다
let ps = new kakao.maps.services.Places(); 

const apiUrl = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pSize=1000&";
const apiUrl2 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=2&pSize=1000&";
const apiUrl3 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=3&pSize=1000&";

/* eventListener */
search_bar.addEventListener('keyup', (event) =>{
    if(event.keyCode === 13){
        search_btn.click();
    }
});

search_btn.addEventListener('click', () => {
    let data = search_bar.value
    console.log(data);
    if(data){
        console.log(data);
        keywordSearch(data, keywordSearchCB);
    }
    else{
        alert('검색어 입력바람');
    }
});

math_btn.addEventListener('click', () => {

})
english_btn.addEventListener('click', () => {
    
})
art_btn.addEventListener('click', () => {
    
})
etc_btn.addEventListener('click', () => {
    
})
essay_btn.addEventListener('click', () => {
    
})
music_btn.addEventListener('click', () => {
    
})



let keywordSearch = (keyword)=> {
    ps.keywordSearch(keyword, keywordSearchCB);
}

let keywordSearchCB = async (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
        let center = new kakao.maps.LatLng(data[0].y, data[0].x);
        map.setCenter(center);
        
        let facilityData = await getData();

        console.log(facilityData);

    for(const i of facilityData){
        drawMaker(i);
    }

    }
}
//전체 데이터 가져오기
let getData = async() =>{
    let request_url = apiUrl;
    let response = await fetch(request_url);
    let result = await response.json();

    let request_url2 = apiUrl2;
    let response2 = await fetch(request_url2);
    let result2 = await response2.json();

    let request_url3 = apiUrl3;
    let response3 = await fetch(request_url3);
    let result3 = await response3.json();

    let resultAll = [];
    resultAll = result.TninsttInstutM[1].row.concat(result2.TninsttInstutM[1].row);
    resultAll = resultAll.concat(result3.TninsttInstutM[1].row);
    
    return resultAll;
}

let clickOverlay = null;

let drawMaker = (facilityData) => {
    const image = {
        "math": "./images/math.png",
        "english": "./images/english.png",
        "music": "./images/music.png",
        "art": "./images/art.png",
        "essay": "./images/essay.png",
        "etc": "./images/etc.png"
    }; 
    const imageSize = new kakao.maps.Size(64, 69);
    const imageOption = {offset: new kakao.maps.Point(27, 69)};
    let imageSrc;

    let olContentClass;
    let olContentName = facilityData.FACLT_NM;
    let olContentAddr = facilityData.REFINE_LOTNO_ADDR;
    let olContentNum = facilityData.TELNO;
    let olContentImg;

    
    if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("수학")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("수학")){
        imageSrc = image.math;
        olContentImg = './images/pop_math.png';
        olContentClass = "수학";
    }else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("음악", "플룻", "피아노", "첼로")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("음악")){
        imageSrc = image.music;
        olContentImg = './images/pop_music.png';
        olContentClass = "음악";
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("영어", "외국어")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("영어", "어학원", "잉글리쉬")){
        imageSrc = image.english;
        olContentImg = './images/pop_english.png';
        olContentClass = "영어";
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("미술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("미술")){
        imageSrc = image.art;
        olContentImg = './images/pop_art.png';
        olContentClass = "미술";
    }   
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("논술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("논술")){
        imageSrc = image.essay;
        olContentImg = './images/pop_essay.png';
        olContentClass = "논술";
    }
    else{
        imageSrc = image.etc;
        olContentImg = './images/pop_etc.png';
        olContentClass = facilityData.CRSE_CLASS_NM;
    }
    
    if(olContentClass == null){
        olContentClass = "-";
    }
    if(olContentNum == null){
        olContentNum = "-";
    }


    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT),
        image: markerImage,
        clickable: true,
    });


    let academy_popup = document.createElement('div');
    academy_popup.className = 'academy-popup';

    let academy_title_wrapper = document.createElement('div');
    academy_title_wrapper.className = 'academy-title-wrapper';

    let academy_title = document.createElement('span');
    academy_title.className = 'academy-title';
    academy_title.innerHTML = olContentName;

    let close_btn = document.createElement('i');
    close_btn.classList.add('fas', 'fa-times', 'close-btn');

    let academy_content = document.createElement('div');
    academy_content.className = 'academy-content';

    let academy_img_wrapper = document.createElement('div');
    academy_img_wrapper.className = 'academy-img-wrapper';

    let academy_img = document.createElement('img');
    academy_img.className = 'academy-img';
    academy_img.setAttribute("src", olContentImg);

    let academy_info_wrapper = document.createElement('div');
    academy_info_wrapper.className = 'academy-info-wrapper';

    let academy_process = document.createElement('span');
    academy_process.className = 'academy-process';
    academy_process.innerHTML = olContentClass;

    let academy_addr = document.createElement('div');
    academy_addr.className = 'academy-addr';
    academy_addr.innerHTML = olContentAddr;

    let academy_num = document.createElement('div');
    academy_num.className = 'academy-num';
    academy_num.innerHTML = olContentNum;


    academy_popup.appendChild(academy_title_wrapper);
    academy_title_wrapper.appendChild(academy_title);
    academy_title_wrapper.appendChild(close_btn);

    academy_popup.appendChild(academy_content);
    academy_content.appendChild(academy_img_wrapper);
    academy_img_wrapper.appendChild(academy_img);


    academy_content.appendChild(academy_info_wrapper);
    academy_info_wrapper.appendChild(academy_process);
    academy_info_wrapper.appendChild(academy_addr);
    academy_info_wrapper.appendChild(academy_num);


    let overlay = new kakao.maps.CustomOverlay({
        content: academy_popup,
        map: map,
        position:  new kakao.maps.LatLng(marker.getPosition().getLat(), marker.getPosition().getLng()),
        xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
        yAnchor: 1.4 // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
    });
    
    // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        if(clickOverlay){
            clickOverlay.setMap(null);
        }
        clickOverlay = overlay;
        overlay.setMap(map);
    });

    overlay.setMap(null);   //초기

    close_btn.addEventListener('click', () =>{
        overlay.setMap(null);
    });

}
