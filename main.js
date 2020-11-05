let container = document.querySelector('#map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 4 //지도의 레벨(확대, 축소 정도)
    };

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

 
const search_bar = document.querySelector(".search-bar");
const search_btn = document.querySelector(".search-btn");

// 장소 검색 객체를 생성합니다
let ps = new kakao.maps.services.Places(); 

const apiUrl = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pSize=1000&";
const apiUrl2 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=2&pSize=1000&";
const apiUrl3 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=3&pSize=1000&";

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
let mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.RIGHT);



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


let keywordSearch = (keyword)=> {
    ps.keywordSearch(keyword, keywordSearchCB);
}

let keywordSearchCB = async (data, status, pagination) => {
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
    console.log(result);
    resultAll = result.TninsttInstutM[1].row.concat(result2.TninsttInstutM[1].row);
    resultAll = resultAll.concat(result3.TninsttInstutM[1].row);

    return resultAll;
    
}

let drawMaker = (facilityData) => {
    let image = {
        "math": "./images/cubes.png",
        "english": "./images/abc.png",
        "music": "./images/music.png",
        "art": "./images/paint.png",
        "essay": "./images/open-book.png",
        "etc": "./images/class.png"
    }; 
    let imageSize = new kakao.maps.Size(32, 32);
    let imageOption = {offset: new kakao.maps.Point(27, 69)};

    let imageSrc;

    
    if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("수학")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("수학")){
        imageSrc = image.math;
    }else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("음악", "플룻", "피아노", "첼로")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("음악")){
        imageSrc = image.music;
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("영어", "외국어")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("영어", "어학원", "잉글리쉬")){
        imageSrc = image.english;
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("미술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("미술")){
        imageSrc = image.art;
    }   
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("논술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("논술")){
        imageSrc = image.essay;
    }
    else{
        imageSrc = image.etc;
    }

    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT),
        image: markerImage,
        clickable: true,
    });

    let iwContent = '<div>인포윈도 생성</div>'; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    const iwPosition = new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT); //인포윈도우 표시 위치입니다

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
