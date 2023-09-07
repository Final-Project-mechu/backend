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

const openModalButton = document.getElementById('open-modal-button');
const modal = document.getElementById('modal');
openModalButton.addEventListener('click', () => {
  modal.style.display = 'block';
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

const openModalDelete = document.getElementById('open-modal-delete');
const deleteModal = document.getElementById('modal-delete');
openModalDelete.addEventListener('click', () => {
  deleteModal.style.display = 'block';
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
