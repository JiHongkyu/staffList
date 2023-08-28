import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();
const URL = 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com';
const element = ['name', 'email', 'phone', 'address', 'image'];
const write = {};
const Message = {};
const title = document.querySelector('.title');
const getAddressBtn = document.getElementById('get-address-btn');
const previewImage = document.querySelector('.preview-image');
const deleteImageBtn = document.querySelector('.delete-image-btn');
const submitBtn = document.getElementById('submit-button');
let getItem = JSON.parse(localStorage.getItem('infos'));
let latelyInfo = JSON.parse(localStorage.getItem('lately-info'));
let referrer = document.referrer.split('/').pop().replace('.html', ''); // 전에 어떤 페이지에서 왔는지 확인
let uploadFile = 'undefined.png';
let oldImage;
let infos = [];
let isValid;
element.forEach((el) => {
  Message[el] = document.getElementById(`${el}-message`);
  write[el] = document.getElementById(el);
});

write['address'].disabled = true;
previewImage.src = `${URL}/${uploadFile}`;

// localStorage 안에 값이 있는지 확인하고 있다면 값 보존
if (getItem) {
  getItem.forEach((item) => {
    infos.push(item);
  });
}
// 등록하기인지 수정하기인지 판별
if (referrer === 'profile') {
  // 수정하기
  uploadFile = latelyInfo['imageUrl'].split('/')[3]; // 원래 이미지의 이름
  oldImage = uploadFile;
  element.forEach((el) => {
    if (el !== 'image') write[el].value = latelyInfo[el];
  });
  previewImage.src = latelyInfo['imageUrl'];

  title.innerText = '임직원 수정';
  submitBtn.innerText = '수정하기';
  submitBtn.addEventListener('click', editStaff);
} else {
  // 등록하기
  title.innerText = '임직원 등록';
  submitBtn.innerText = '등록하기';
  submitBtn.addEventListener('click', createStaff);
}

// uploadFile 변경 함수
function uploadFileChange(e) {
  uploadFile = e.target.files[0];
  const reader = new FileReader();

  // 미리보기 이미지 생성
  reader.onload = (data) => {
    previewImage.src = data.target.result;
  };

  reader.readAsDataURL(uploadFile);
}

// 사진 삭제 함수
function deleteImageFunc() {
  uploadFile = 'undefined.png';
  previewImage.src = `${URL}/${uploadFile}`;
  write['image'].value = '';
}

// 이름 유효성 검사
function nameIsValid() {
  const nameMessage = Message['name'];

  if (!write['name'].value) {
    nameMessage.innerText = '이름을 작성해주세요.';
    nameMessage.style.color = 'red';
    isValid = false;
  } else {
    nameMessage.innerText = 'Success!';
    nameMessage.style.color = 'green';
  }
}

// 이메일 유효성 검사
function emailIsValid() {
  const emailMessage = Message['email'];

  if (!write['email'].value) {
    emailMessage.innerText = '이메일을 작성해주세요.';
    emailMessage.style.color = 'red';
    isValid = false;
  } else if (!write['email'].value.includes('@')) {
    emailMessage.innerText = '이메일을 형식에 맞춰 작성해주세요.';
    emailMessage.style.color = 'red';
    isValid = false;
  } else {
    emailMessage.innerText = 'Success';
    emailMessage.style.color = 'green';
  }
}

// 휴대폰 번호 유효성 검사
function phoneIsValid() {
  const phoneMessage = Message['phone'];

  if (!write['phone'].value) {
    phoneMessage.innerText = '휴대폰 번호를 입력해주세요.';
    phoneMessage.style.color = 'red';
    isValid = false;
  } else if (write['phone'].value.length !== 11) {
    phoneMessage.innerText = '휴대폰 번호 11자리를 입력해주세요.';
    phoneMessage.style.color = 'red';
    isValid = false;
  } else {
    phoneMessage.innerText = 'Success';
    phoneMessage.style.color = 'green';
  }
}

// 주소 유효성 검사
function addressIsValid() {
  const addressMessage = Message['address'];

  if (!write['address'].value) {
    addressMessage.innerText = '주소를 입력해주세요.';
    addressMessage.style.color = 'red';
    isValid = false;
  } else {
    addressMessage.innerText = 'Success';
    addressMessage.style.color = 'green';
  }
}

// input 입력 유효성 검사
function isInputValid() {
  isValid = true;
  // 이름 검사
  nameIsValid();
  // 이메일 검사
  emailIsValid();
  // 휴대폰 번호 검사
  phoneIsValid();
  // 주소 검사
  addressIsValid();
}

// 주소 찾기 API
function getAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      write['address'].value = data.address;
    }
  }).open();
}

function onFileUpload() {
  const ACCESS_KEY = process.env.ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
  const REGION = 'ap-northeast-2';
  const S3_BUCKET = 'hong-upload-image';

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION
  });

  const file = uploadFile;
  const params = {
    ACL: 'public-read',
    Body: file,
    Bucket: S3_BUCKET,
    Key: file.name
  };

  myBucket
    .putObject(params)
    .on('httpUploadProgress', (evt) => {
      console.log('success');
    })
    .send((err) => {
      if (err) console.log(err);
    });
}

// 가장 마지막에 만든 임직원 저장 함수
function saveToLatelyLocalStorage(item) {
  const data = JSON.stringify(item);
  localStorage.setItem('lately-info', data);
}

// 임직원 리스트 생성 함수
function saveToLocalStorage() {
  const data = JSON.stringify(infos);
  localStorage.setItem('infos', data);
}

// 임직원 등록 함수
function createStaff() {
  isInputValid();
  if (!isValid) return;
  if (uploadFile !== 'undefined.png') onFileUpload();

  const item = {
    id: String(new Date().getTime()),
    name: write['name'].value,
    email: write['email'].value,
    phone: write['phone'].value,
    address: write['address'].value,
    imageUrl: `${URL}/${uploadFile.name ?? uploadFile}`
  };

  infos.push(item);
  saveToLocalStorage();
  saveToLatelyLocalStorage(item);

  alert('등록이 완료되었습니다.');
  location.href = './profile.html';
}

// 임직원 수정 함수
function editStaff() {
  isInputValid();
  if (!isValid) return;
  if (uploadFile !== 'undefined.png' && uploadFile !== oldImage) onFileUpload();

  infos.forEach((el) => {
    if (el.id === latelyInfo['id']) {
      el['name'] = write['name'].value;
      el['email'] = write['email'].value;
      el['phone'] = write['phone'].value;
      el['address'] = write['address'].value;
      el['imageUrl'] = `${URL}/${uploadFile.name ?? uploadFile}`;

      saveToLatelyLocalStorage(el);
    }
  });

  saveToLocalStorage();

  alert('정보변경이 완료되었습니다.');
  location.href = './profile.html';
}

write['image'].addEventListener('change', uploadFileChange);
getAddressBtn.addEventListener('click', getAddress);
write['name'].addEventListener('blur', nameIsValid);
write['email'].addEventListener('blur', emailIsValid);
write['phone'].addEventListener('blur', phoneIsValid);
deleteImageBtn.addEventListener('click', deleteImageFunc);
