let container = document.querySelector('#map'); //지도를 담을 영역의 DOM 레퍼런스
    let options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 4 //지도의 레벨(확대, 축소 정도)
    };

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴


let search_bar = document.querySelector(".search-bar");
let search_btn = document.querySelector(".search-btn");

// 장소 검색 객체를 생성합니다
let ps = new kakao.maps.services.Places(); 

let apiUrl = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pSize=1000&";
let apiUrl2 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=2&pSize=1000&";
let apiUrl3 = "https://openapi.gg.go.kr/TninsttInstutM?KEY=9aa60a805f9041198337d6137cd6c761&type=json&pIndex=3&pSize=1000&";
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
        "math": "./cubes.png",
        "english": "./abc.png",
        "music": "./music.png",
        "art": "./paint.png",
        "readingRoom": "./reading-book.png",
        "etc": "./class.png"
    }; 
    let imageSize = new kakao.maps.Size(32, 32);
    let imageOption = {offset: new kakao.maps.Point(27, 69)};

    let imageSrc;

    
    if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("수학")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("수학")){
        imageSrc = image.math;
    }else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("음악")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("음악")){
        imageSrc = image.music;
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("영어")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("영어")){
        imageSrc = image.english;
    }
    else if((facilityData.CRSE_CLASS_NM && facilityData.CRSE_CLASS_NM.includes("미술")) || facilityData.FACLT_NM && facilityData.FACLT_NM.includes("미술")){
        imageSrc = image.art;
    }   
    else if(facilityData.CRSE_CLASS_NM === "독서실"){
        imageSrc = image.readingRoom;
    }
    else{
        imageSrc = image.etc;
    }

    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(facilityData.REFINE_WGS84_LAT, facilityData.REFINE_WGS84_LOGT),
        image: markerImage,
    });
}