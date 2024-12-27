// confirm
function showCustomConfirm(callback) {
  const confirmModal = document.querySelector('#custom-confirm');
  const yesBtn = document.querySelector('#confirm-yes');
  const noBtn = document.querySelector('#confirm-no');

  confirmModal.classList.remove('hidden');

  yesBtn.onclick = () => {
    callback(true); // 使用者選擇 "Yes"
    confirmModal.classList.add('hidden');
  };

  noBtn.onclick = () => {
    callback(false); // 使用者選擇 "no"
    confirmModal.classList.add('hidden');
  };
}

// alert
function showCustomAlert(message) {
  const alertModal = document.querySelector('#custom-alert');
  const alertText = document.querySelector('.alert-modal-text');
  const alertCheckBtn = document.querySelector('#alert-check');

  alertModal.classList.remove('hidden');

  alertText.innerHTML = message;

  alertCheckBtn.onclick = () => {
    alertModal.classList.add('hidden');
  };
}
