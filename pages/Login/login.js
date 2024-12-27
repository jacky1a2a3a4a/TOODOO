// dom
const loginPage = document.querySelector('.login');
const loginForm = document.querySelector('#login-form');
const registerPage = document.querySelector('.register');
const registerForm = document.querySelector('#register-form');
// btns
const btns = document.querySelector('.buttons');
const loginBtn = document.querySelector('#login-btn');
const switchToRegisterBtn = document.querySelector('#switch-to-register-btn');
const registerBtn = document.querySelector('#register-btn');
const switchToLoginBtn = document.querySelector('#switch-to-login-btn');
//error text
const passwordLengthError = document.querySelector('#password-length-error');
const passwordMatchError = document.querySelector('#password-match-error');
const loginError = document.querySelector('#login-error');
const registerError = document.querySelector('#register-repeat-error');

const img = document.querySelector('.login-img img');

// variable
const apiUrl = 'https://todoo.5xcamp.us';

// function
//切換頁面
function toggleForm(e) {
  loginPage.classList.toggle('active');
  registerPage.classList.toggle('active');
}

//註冊
function signUp(email, nickname, password) {
  axios
    .post(`${apiUrl}/users`, {
      user: {
        email: email,
        nickname: nickname,
        password: password,
      },
    })
    .then((res) => {
      setTimeout(() => {
        // 儲存 nickname 到 localStorage
        localStorage.setItem('nickname', nickname);

        //logo動畫
        img.style.animation = 'elastic-bounce 0.6s ease-out';
        img.addEventListener('animationend', (e) => {
          alert('register successful! Now will switch to login page.');
          toggleForm();
        });
      }, 0);

      console.log(res);
    })
    .catch((error) => {
      if (error.response.data.message === '註冊發生錯誤') {
        registerError.classList.remove('hidden');
      }
      console.log(error);
    });
}

//登入
function login(email, password) {
  axios
    .post(`${apiUrl}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    })
    .then((res) => {
      img.style.animation = 'none';
      loginError.classList.add('hidden');

      const token = res.headers.authorization;
      const nickname = res.data.nickname;

      axios.defaults.headers.common['Authorization'] = token;
      localStorage.setItem('Authorization', token);
      localStorage.setItem('nickname', nickname);

      setTimeout(() => {
        img.style.animation = 'elastic-bounce 0.6s ease-out';

        img.addEventListener('animationend', (e) => {
          window.location.href = '/pages/ToDoList/to_do_list.html'; //頁面跳轉
        });
      }, 0);

      console.log(res);
    })
    .catch((error) => {
      loginError.classList.remove('hidden');
      console.log(error);
    });
}

// login('jacky1a2a3a4a@gmail.com', '123456');

//eventListener
switchToRegisterBtn.addEventListener('click', (e) => {
  toggleForm();
});

switchToLoginBtn.addEventListener('click', (e) => {
  toggleForm();
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.querySelector('#register-email-content').value;
  const nickname = document.querySelector('#register-nickname-content').value;
  const password = document.querySelector('#register-password-content').value;
  const password2 = document.querySelector('#register-password2-content').value;

  let hasError = false;

  //檢查密碼長度
  if (password.length < 6) {
    passwordLengthError.classList.remove('hidden');
    hasError = true;
  } else {
    passwordLengthError.classList.add('hidden');
  }

  //檢查密碼一致
  if (password !== password2) {
    passwordMatchError.classList.remove('hidden');
    hasError = true;
  } else {
    passwordMatchError.classList.add('hidden');
  }

  if (hasError) {
    return;
  }

  signUp(email, nickname, password);
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.querySelector('#login-email-content').value;
  const password = document.querySelector('#login-password-content').value;

  login(email, password);
});

function logout() {
  axios
    .delete(`${apiUrl}/users/sign_out`)
    .then((res) => {
      //清空token
      // localStorage.removeItem('Authorization');
      // axios.defaults.headers.common['Authorization'] = null;

      // window.location.href = 'login.html';
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}
