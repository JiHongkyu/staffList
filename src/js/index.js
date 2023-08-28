import { debounce } from 'lodash';
import FormatPhone from '../components/FormatPhone';

const tBody = document.querySelector('tbody');
const searchInput = document.querySelector('.search-input');
const modal = document.querySelector('.modal');
const modalSelect = document.querySelector('.modal-select');
const modalConfirm = document.querySelector('.modal-confirm');
const selectCancel = document.querySelector('.select-cancel');
const confirmCancel = document.querySelector('.confirm-cancel');
const profileBtn = document.querySelector('.profile-btn');
const deleteBtn = document.querySelector('.delete-btn');
const yesBtn = document.querySelector('.yes-btn');
const noBtn = document.querySelector('.no-btn');
const modalDeleteSuccess = document.querySelector('.modal-delete-success');
let getItem = JSON.parse(localStorage.getItem('infos'));

if (!getItem) {
  const data = [
    {
      id: '1692252098267',
      name: '백종원',
      email: 'paik@gmail.com',
      phone: '01012341234',
      address: '서울특별시 서초구 서초동',
      imageUrl: 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com/백종원.jpg'
    },
    {
      id: '1692268582359',
      name: '이무진',
      email: 'Moojin@gmail.com',
      phone: '01012345678',
      address: '경기도 고양시 일산구 풍동',
      imageUrl: 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com/이무진.jpg'
    },
    {
      id: '1692268621555',
      name: '김종국',
      email: 'Jongkook@gmail.com',
      phone: '01045671234',
      address: '서울특별시 강남구 논현동',
      imageUrl: 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com/김종국.png'
    },
    {
      id: '1692329664296',
      name: '해쉬',
      email: 'hash@gmail.com',
      phone: '01015448282',
      address: '서울특별시 노원구 상계로 182',
      imageUrl: 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com/해쉬.jpg'
    },
    {
      id: '1692349779458',
      name: '홍길동',
      email: 'gildong@gmail.com',
      phone: '01012341234',
      address: '서울 강동구 동남로 733',
      imageUrl: 'https://hong-upload-image.s3.ap-northeast-2.amazonaws.com/홍길동.png'
    }
  ];

  localStorage.setItem('infos', JSON.stringify(data));
  getItem = data;
}

getItem.forEach((item) => {
  createStaffList(item);
});

// 직원 리스트 생성 함수
function createStaffList(item) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
  <td><img src="${item.imageUrl}" alt="사진이었던 것" /></td>
  <td>${item.name}</td>
  <td>${item.email}</td>
  <td>${FormatPhone(item.phone)}</td>
  <td>${item.address}</td>
  `;

  tr.classList.add('list-inner');
  tr.id = item.id;
  tBody.append(tr);
}

// tr태그 클릭 시 동작 함수
function handleRowClick(event) {
  const tr = event.target.closest('tr');
  if (!tr) return;
  let data = getItem.find((item) => item.id === tr.id);
  data = JSON.stringify(data);
  localStorage.setItem('lately-info', data);
  modal.classList.add('active');
  modalSelect.classList.add('active');

  profileBtn.addEventListener('click', handleProfileBtnClick);
  deleteBtn.addEventListener('click', () => {
    handleDeleteBtnClick(tr);
  });
  selectCancel.addEventListener('click', handleNoBtnClick);
}

// 상세보기 버튼 클릭 시 동작 함수
function handleProfileBtnClick() {
  location.href = './profile.html';
}

// 삭제하기 버튼 클릭 시 동작 함수
function handleDeleteBtnClick(tr) {
  modalSelect.classList.remove('active');
  modalConfirm.classList.add('active');

  yesBtn.addEventListener('click', () => {
    handleYesBtnClick(tr);
  });
  noBtn.addEventListener('click', handleNoBtnClick);
  confirmCancel.addEventListener('click', handleNoBtnClick);
}

// Yes버튼 클릭 시 동작 함수
function handleYesBtnClick(tr) {
  getItem = getItem.filter((item) => item.id !== tr.id);
  const data = JSON.stringify(getItem);
  localStorage.setItem('infos', data);
  tr.remove();

  modalConfirm.classList.remove('active');
  modalDeleteSuccess.classList.add('active');

  setTimeout(() => {
    modalDeleteSuccess.classList.remove('active');
    modal.classList.remove('active');
  }, 1000);
}

// No 버튼 클릭 시 동작 함수
function handleNoBtnClick() {
  modalConfirm.classList.remove('active');
  modal.classList.remove('active');
}

// 검색 함수
const searchStaff = debounce(() => {
  const listInner = document.getElementsByClassName('list-inner');

  for (let i = 0; i < listInner.length; i++) {
    if (listInner[i].cells[1].innerText.includes(searchInput.value)) {
      listInner[i].style.display = 'table-row';
    } else {
      listInner[i].style.display = 'none';
    }
  }
}, 500);

tBody.addEventListener('click', handleRowClick);
searchInput.addEventListener('input', searchStaff);
