function getNo() {
  // 현재 페이지 URL의 쿼리스트링 (? 뒤 부분)을 객체 형태로 파싱
  const searchParams = new URLSearchParams(location.search);

  // 'no' 파라미터 값을 읽어서 반환
  // 예: read.html?no=5 → "5"
  //    read.html → null
  return searchParams.get('no');
}

function fetchContact(no) {
  const url =`https://sample.bmaster.kro.kr/contacts/${no}`;

  axios.get(url).then(res=>{
    if(res.data.status==="fail") {
      alert('연락처 없음');
      location.href = 'list.html';
    }
  })
}