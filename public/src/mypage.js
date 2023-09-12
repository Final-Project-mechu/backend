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

const toggleModalButton = document.getElementById('toggle-modal-button');
const modal = document.getElementById('modal');

toggleModalButton.addEventListener('click', () => {
  if (modal.style.display === 'block') {
    modal.style.display = 'none';
    toggleModalButton.textContent = '유저 정보 수정'; // 버튼 텍스트 변경
  } else {
    modal.style.display = 'block';
    toggleModalButton.textContent = '모달 닫기'; // 버튼 텍스트 변경
  }
});

const updatePasswordButton = document.getElementById('update-password-button');
updatePasswordButton.addEventListener('click', async () => {
  const newNickName = document.getElementById('newNick_Name').value;
  const password = document.getElementById('password').value;
  const newPassword = document.getElementById('new-password').value;

  try {
    const response = await axios.patch('http://localhost:3000/users/update', {
      newNick_name: newNickName,
      password: password,
      newPassword: newPassword,
    });

    if (response.status === 200) {
      alert('비밀번호가 성공적으로 수정되었습니다.');
      modal.style.display = 'none';
      location.reload();
    } else {
      console.error('서버 응답 오류:', response.status);
    }
  } catch (error) {
    console.error('비밀번호 수정 중 오류 발생:', error);
  }
});

// const toggleModalButton = document.getElementById('toggle-modal-button');
// const modal = document.getElementById('modal');

// toggleModalButton.addEventListener('click', () => {
//   if (modal.style.display === 'block') {
//     modal.style.display = 'none';
//     toggleModalButton.textContent = '유저 정보 수정'; // 버튼 텍스트 변경
//   } else {
//     modal.style.display = 'block';
//     toggleModalButton.textContent = '모달 닫기'; // 버튼 텍스트 변경
//   }
// });

const toggleModalButtonDelete = document.getElementById(
  'toggle-modal-button-delete',
);
const modal_Delete = document.getElementById('modal-delete');

toggleModalButtonDelete.addEventListener('click', () => {
  if (modal_Delete.style.display === 'block') {
    modal_Delete.style.display = 'none';
    toggleModalButtonDelete.textContent = '회원 탈퇴'; // 버튼 텍스트 변경
  } else {
    modal_Delete.style.display = 'block';
    toggleModalButtonDelete.textContent = '모달 닫기'; // 버튼 텍스트 변경
  }
});

const deleteButton = document.getElementById('delete-button');
deleteButton.addEventListener('click', async () => {
  const password = document.getElementById('passwordDelete1').value;
  const passwordConfirm = document.getElementById('passwordDelete2').value;

  try {
    const response = await axios.post('http://localhost:3000/users/quit', {
      password: password,
      passwordConfirm: passwordConfirm,
    });

    if (response.status === 200) {
      alert('회원 탈퇴 성공');
      modal.style.display = 'none';
    } else {
      console.error('서버 응답 오류:', response.status);
    }
  } catch (error) {
    console.error('비밀번호 수정 중 오류 발생:', error);
  }
});
