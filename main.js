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
    console.log(data)
    if (status === kakao.maps.services.Status.OK) {
        let center = new kakao.maps.LatLng(data[0].y, data[0].x);
        map.setCenter(center);
        
        let facilityData = await getData(data[0].y, data[0].x);

        console.log(facilityData);

    for(const i of facilityData){
        drawMaker(i);
    }

    }
}

let getData = async (Lat, Lng) =>{
    let request_url = `${apiUrl}REFINE_WGS84_LAT=${Lat}&REFINE_WGS84_LOGT=${Lng}`;
    let response = await fetch(request_url);
    let result = await response.json();


    let request_url2 = `${apiUrl2}REFINE_WGS84_LAT=${Lat}&REFINE_WGS84_LOGT=${Lng}`;
    let response2 = await fetch(request_url2);
    let result2 = await response2.json();

    let request_url3 = `${apiUrl3}REFINE_WGS84_LAT=${Lat}&REFINE_WGS84_LOGT=${Lng}`;
    let response3 = await fetch(request_url3);
    let result3 = await response3.json();

    let resultAll = [];
    resultAll = result.TninsttInstutM[1].row.concat(result2.TninsttInstutM[1].row);
    resultAll = resultAll.concat(result3.TninsttInstutM[1].row);

    return resultAll;
}

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

    let iwContent;
    let iwContentClass;
    let iwContentName = facilityData.FACLT_NM;
    let iwContentAddr = facilityData.REFINE_LOTNO_ADDR;
    let iwContentNum = facilityData.TELNO;

    
    if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("수학")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("수학")){
        imageSrc = image.math;
        iwContentClass = "수학";
    }else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("음악", "플룻", "피아노", "첼로")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("음악")){
        imageSrc = image.music;
        iwContentClass = "음악";
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("영어", "외국어")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("영어", "어학원", "잉글리쉬")){
        imageSrc = image.english;
        iwContentClass = "영어";
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("미술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("미술")){
        imageSrc = image.art;
        iwContentClass = "미술";
    }   
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("논술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("논술")){
        imageSrc = image.essay;
        iwContentClass = "논술";
    }
    else{
        imageSrc = image.etc;
        iwContentClass = facilityData.CRSE_CLASS_NM;
    }
    
    if(iwContentClass == null){
        iwContentClass = "-";
    }
    if(iwContentNum == null){
        iwContentNum = "-";
    }
    iwContent = iwContentClass + iwContentName + iwContentAddr + iwContentNum;



    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT),
        image: markerImage,
        clickable: true,
    });

    
    // const iwPosition = new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT); //인포윈도우 표시 위치입니다

    let infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : true,
    });
    
    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
          // 마커 위에 인포윈도우를 표시합니다
          infowindow.open(map, marker);
          console.log("click")
    });
}
