document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get('https://togethereat.shop/users/find');

    if (response.status === 200) {
      const nickName = response.data;

      const profileNickNameElement =
        document.getElementById('profile-nickName');
      profileNickNameElement.textContent = '닉네임: ' + nickName;
    } else {
      console.error('서버 응답 오류:', response.status);
    }
  } catch (error) {
    console.error('닉네임을 가져오는 중 오류 발생:', error);
  }
});

function updateUser() {
  const data = {
    newNick_name: $('#newNick_Name').val(),
    password: $('#password').val(),
    newPassword: $('#new-password').val(),
  };
  axios
    .patch('https://togethereat.shop/users/update', data)
    .then(response => {
      console.log(response);
      alert('닉네임, 비밀번호 변경 성공');
      location.reload();
    })
    .catch(error => {
      alert('내 정보 수정 실패');
    });
}

function deleteUser() {
  const data = {
    password: $('#passwordDelete1').val(),
    passwordConfirm: $('#passwordDelete2').val(),
  };
  axios
    .post('https://togethereat.shop/users/quit', data)
    .then(response => {
      document.cookie = deleteCookie('AccessToken');
      document.cookie = deleteCookie('RefreshToken');
      alert('정상적으로 탈퇴되었습니다' + '');
      window.location.href = 'https://togethereat.shop';
    })
    .catch(error => {
      console.log(error);
      alert('회원탈퇴 실패');
    });
}
