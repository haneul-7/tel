function getPageno() {
  // 현재 URL의 쿼리스트링(? 뒤 부분)을 분석할 수 있는 객체 생성
  const searchParams = new URLSearchParams(location.search);

  // pageno 값이 없으면 기본값 1 반환, 있으면 숫자로 변환해서 반환
  return searchParams.get('pageno') === null ? 1 : +(searchParams.get('pageno'));
}

function renderContacts(contacts) {
  // 연락처 목록을 삽입할 <tbody id="contacts"> 요소 찾기
  const $contacts = document.getElementById('contacts');

  // 누적할 HTML 문자열
  let html = '';

  // 전달받은 contacts 배열 순회
  for (const c of contacts) {
    // 각 연락처 객체(c)의 정보를 <tr> 행으로 변환
    html += `
      <tr>
        <td>${c.no}</td>       <!-- 번호 -->
        <td>
          <!-- 이름을 클릭하면 read.html로 이동하면서, 연락처 고유 번호(no)를 쿼리스트링으로 전달 -->
          <a href="read.html?no=${c.no}">${c.name}</a>
        </td>
        <td>${c.tel}</td>      <!-- 전화번호 -->
        <td>${c.address}</td>  <!-- 주소 -->
      </tr>
    `;
  }

  // 완성된 HTML 문자열을 tbody 안에 삽입
  $contacts.innerHTML = html;
}

function renderPagination(pageno, pagesize, totalcount, blocksize=5) {
  const $p = document.getElementById('pagination'); 
  // 페이지 번호 버튼을 넣을 <ul id="pagination">

  const numberOfPage = Math.ceil(totalcount/pagesize);
  // 전체 페이지 개수 = 총 데이터 개수 ÷ 페이지 크기

  const prev = Math.floor((pageno-1)/blocksize) * blocksize;
  // 현재 블록의 시작 직전 페이지 번호

  const start = prev + 1;
  // 블록 시작 페이지

  let end = prev + blocksize;
  // 블록 끝 페이지

  let next = end + 1;
  // 다음 블록 시작 페이지

  if(end >= numberOfPage) {
    end = numberOfPage; // 마지막 페이지가 전체 페이지 수보다 크면 보정
    next = 0;           // 다음 블록 없음
  }

  let html = '';  
  // 페이지네이션 버튼들의 HTML 문자열을 누적할 변수

  if (prev > 0) {
    // 이전 블록이 존재한다면 "이전으로" 버튼 추가
    html += `<li class='page-item'><a class='page-link' href='list.html?pageno=${prev}'>이전으로</a></li>`;
  }

  for (let i = start; i <= end; i++) {
    // 현재 블록(start ~ end)의 페이지 번호들을 반복해서 버튼 생성
    html += `
      <li class='${i === pageno ? "page-item active" : "page-item"}'>
        <a class='page-link' href='list.html?pageno=${i}'>${i}</a>
      </li>
    `;
  // 현재 페이지(pageno)와 같으면 "active" 클래스를 붙여서 강조
  }

  if (next > 0) {
    // 다음 블록이 존재한다면 "다음으로" 버튼 추가
    html += `<li class='page-item'><a class='page-link' href='list.html?pageno=${next}'>다음으로</a></li>`;
  }

  $p.innerHTML = html;  
  // 완성된 HTML 문자열을 <ul id="pagination"> 안에 삽입해서 화면에 출력
}

function fetchContacts() {
  // 요청할 API 주소 (현재 페이지 번호와 페이지 크기를 쿼리스트링으로 전달)
  const url = `https://sample.bmaster.kro.kr/contacts?pageno=${pageno}&pagesize=10`;

  // axios를 사용해 GET 요청
  axios.get(url).then(res => {
    // 응답 데이터 구조 분해 할당
    const { pageno, pagesize, totalcount, contacts } = res.data;

    // 연락처 목록을 테이블에 렌더링
    renderContacts(contacts);

    // 페이지네이션 버튼 렌더링
    renderPagination(pageno, pagesize, totalcount);
  }).catch(res => {
    // 에러 발생 시 콘솔에 출력
    console.log(res);
  })
}
