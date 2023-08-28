import FormatPhone from '../components/FormatPhone';

const profileName = document.querySelector('.name');
const profileEmail = document.querySelector('.email');
const profilePhone = document.querySelector('.phone');
const profileAddress = document.querySelector('.address');
const profileImage = document.querySelector('.image');
const staffInfoEdit = document.querySelector('.staff-info-edit');
let data;

try {
  data = JSON.parse(localStorage.getItem('lately-info'));

  profileName.innerText = data.name;
  profileEmail.innerText = data.email;
  profilePhone.innerText = FormatPhone(data['phone']);
  profileAddress.innerText = data.address;
  profileImage.src = data.imageUrl;
} catch (error) {
  alert('로컬 스토리지에서 데이터를 가져오는 동안 에러 발생: ' + error);
  location.href = './index.html';
}

staffInfoEdit.addEventListener('click', function () {
  location.href = './write.html';
});
