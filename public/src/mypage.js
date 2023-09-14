document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get('http://localhost:3000/users/find');

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

// 기능구현중
// document.addEventListener('DOMContentLoaded', async () => {
//   try {
//     // 랜덤 사진 가져오기
//     const photoResponse = await axios.get('http://localhost:3000/food', {
//       params: {
//         food_id: id,
//       },
//     });

//     if (photoResponse.status === 200) {
//       const randomPhotoUrl = photoResponse.data;

//       // 이미지 엘리먼트에 랜덤 사진 URL 설정
//       const randomPhotoElement = document.getElementById('random-photo');
//       randomPhotoElement.src = randomPhotoUrl;
//     } else {
//       console.error('랜덤 사진 가져오기 오류:', photoResponse.status);
//     }
//   } catch (error) {
//     console.error('데이터 가져오는 중 오류 발생:', error);
//   }
// });

function updateUser() {
  const data = {
    newNick_name: $('#newNick_Name').val(),
    password: $('#password').val(),
    newPassword: $('#new-password').val(),
  };
  axios
    .patch('http://localhost:3000/users/update', data)
    .then(response => {
      console.log(response);
      alert('닉네임, 비밀번호 변경 성공');
      location.reload();
    })
    .catch(error => {
      alert("내 정보 수정 실패" ); 
    });
}

function deleteUser() {
  const data = {
    password: $('#passwordDelete1').val(),
    passwordConfirm: $('#passwordDelete2').val(),
  };
  axios
    .post('http://localhost:3000/users/quit', data)
    .then(response => {
      console.log(response);
      alert('회원탈퇴 성공');
      location.reload();
    })
    .catch(error => {
      alert(error.message);
    });
}
