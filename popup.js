let academy_popup = document.createElement('div');
academy_popup.className = 'academy-popup';

let academy_title_wrapper = document.createElement('div');
academy_title_wrapper.className = 'academy-title-wrapper';

let academy_title = document.createElement('span');
academy_title.className = 'academy-title';

let close_btn = document.createElement('i');
close_btn.classList.add('fas', 'fa-times', 'close-btn');

let academy_content = document.createElement('div');
academy_content.className = 'academy-content';

let academy_img_wrapper = document.createElement('div');
academy_img_wrapper.className = 'academy-img-wrapper';

let academy_img = document.createElement('img');
academy_img.className = 'academy-img';
academy_img.setAttribute("src", "./images/pop_music.png");

let academy_info_wrapper = document.createElement('div');
academy_info_wrapper.className = 'academy-info-wrapper';

let academy_process = document.createElement('span');
academy_process.className = 'academy-process';
academy_process.innerHTML = "음악";

let academy_addr = document.createElement('div');
academy_addr.className = 'academy-addr';
academy_addr_name.innerHTML = "경기도 수원시 오로롤롤 로로ㅗ로로로로";

let academy_num = document.createElement('div');
academy_num.className = 'academy-num';
academy_num.innerHTML = "010-1234-1234";


academy_popup.appendChild(academy_title_wrapper);
academy_title_wrapper.appendChild(academy_title);
academy_title_wrapper.appendChild(close_btn);

academy_popup.appendChild(academy_content);
academy_content.appendChild(academy_img_wrapper);
academy_img_wrapper.appendChild(academy_img);


academy_content.appendChild(academy_info_wrapper);
academy_info_wrapper.appendChild(academy_process);
academy_info_wrapper.appendChild(academy_addr);
academy_info_wrapper.appendChild(academy-num);
