const user_info = {
  name: "",
  phone: "",
  email: "",
  description: "",
  code_campaign: "582387667",
  name_campaign: "[Kangnam] Đăng Ký OTP",
  gclid: "",
  otp: "",
};

function codeverify() {
  const listInputs = document.querySelector("#listInputs");
  for (let pin of listInputs.children) {
    if (pin.value == "") {
      alert("OTP is too short");
      return;
    }
  }
  const inputOtps = document.getElementsByName("verificationCodeDigit");
  let input = "";
  for (let i = 0; i < inputOtps.length; i++) {
    input += `${inputOtps[i].value}`;
  }
  user_info.otp = input;
  getSMS(user_info);
  loading();
}

//focus input otp
document.addEventListener("DOMContentLoaded", function (event) {
  function OTPInput() {
    const inputs = document.querySelectorAll("#listInputs > *[id]");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keydown", function (event) {
        if (event.key === "Backspace") {
          inputs[i].value = "";
          if (i !== 0) inputs[i - 1].focus();
        } else {
          //check input cuoi
          if (i === inputs.length - 1 && inputs[i].value !== "") {
            console.log(111111);
            // return true;
            // alert('ban da nhap du. vui long')
            // } else if (event.keyCode > 47 && event.keyCode < 58) {
          } else if (!isNaN(inputs[i].value)) {
            // check number
            console.log("number");
            inputs[i].value = event.key;
            if (i !== inputs.length - 1) {
              inputs[i + 1].focus();
            } else {
              console.log("het roi");
              document.getElementById("verificationButton").focus();
            }
            event.preventDefault();
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            // check text
            // inputs[i].value = String.fromCharCode(event.keyCode);
            // if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          }
        }
      });
    }
  }
  OTPInput();
});

//check otp nhập vào
function checkUser(data, user_info) {
  let otp = user_info.otp;
  let phone = user_info.phone;
  let check = false;
  let id;

  for (let i = 0; i < data.length; i++) {
    if (data[i].otp == otp && data[i].phone == phone) {
      check = true;
      id = data[i].id;
      break;
    } else {
      check = false;
    }
  }
  if (check) {
    // Gui inssight
    // sendForm(name, phone, email, description, code_campaign, name_campaign, gclid)
    send_form(
      user_info.name,
      user_info.phone,
      user_info.email,
      user_info.description,
      user_info.code_campaign,
      user_info.name_campaign,
      user_info.gclid
    );
    // Gui xoa otp
    delOTP(id);
  } else {
    console.log("false");
  }
}

function getSMS(user) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
    // console.log(myObj);
    data = myObj.data;
    checkUser(data, user);
  };
  xmlhttp.open("GET", "https://benhvienthammykangnam.com.vn/cp/api/getSMS.php");
  xmlhttp.send();
}
// getSMS();
function validPhone(str) {
  const regexPhoneNumber = /^((\+)33|0)[1-9](\d{2}){4}$/;

  if (str.match(regexPhoneNumber)) {
    return true;
  } else {
    return false;
  }
}
function sendInfo(phone, user, gclid) {
  document.querySelectorAll(".pop_otp_1_1_0 .modal")[0].style.display = "block";
  user_info.phone = phone.value;
  user_info.name = user.value;
  user_info.gclid = gclid.value;
  createOTP(user_info.phone);
}

const checkUserPhone = function () {
  const user = document.getElementsByClassName("screen8__name")[0];
  const phone = document.getElementsByClassName("screen8__phone")[0];
  const gclid = document.getElementsByClassName("screen8__gclid")[0];
  const nameError = document.getElementById("name__error");
  const phoneError = document.getElementById("phone__error");
  if (user.value === "") {
    user.classList.add("border");
    nameError.style.display = "block";
  } else if (!validPhone(phone.value)) {
    phone.classList.add("border");
    phoneError.style.display = "block";
    alert("Số điện thoại của bạn không đúng");
  } else {
    user.classList.remove("border");
    nameError.style.display = "none";
    phoneError.style.display = "none";
    sendInfo(phone, user, gclid);
  }
};

const checkPhone = function () {
  const user = document.getElementsByClassName("pop_callkn_1_1_0__name")[0];
  const gclid = document.getElementsByClassName("pop_callkn_1_1_0__gclid")[0];
  const phone = document.getElementsByClassName("pop_callkn_1_1_0__number")[0];
  const phoneError = document.getElementById("phone__error2");
  if (phone.value === "") {
    phone.classList.add("border");
    phoneError.style.display = "block";
  } else {
    phone.classList.remove("border");
    sendInfo(phone, user, gclid);
  }
};

//open popup otp
document.getElementById("modal-close2").addEventListener("click", () => {
  document.querySelectorAll(".pop_otp_1_1_0 .modal")[0].style.display = "none";
});

//ceateOTP
function createOTP(phone) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
  };
  xmlhttp.open(
    "GET",
    `https://benhvienthammykangnam.com.vn/cp/api/createOTP.php?phone=${phone}`
  );
  xmlhttp.send();
}

//dellOTP
function delOTP(otp) {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
    console.log(myObj);
  };
  xmlhttp.open(
    "GET",
    `https://benhvienthammykangnam.com.vn/cp/api/delOTP.php?id=${otp}`
  );
  xmlhttp.send();
}

const loading = function () {
  const loginBtn = document.getElementById("verificationButton");
  loginBtn.addEventListener("click", () => {
    loginBtn.classList.add("loading");
  });
};
