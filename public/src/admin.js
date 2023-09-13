//어드민 변환
function admintransfer() {
  axios
    .post('https://togethereat.shop/users/admin')
    .then(response => {
      alert('어드민 변환 완료');
      location.reload();
    })
    .catch(error => {
      alert('어드민 변환 실패');
      console.error(error);
    });
}
