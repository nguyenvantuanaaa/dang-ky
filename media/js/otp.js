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
    // console.log("inputOtps: ", inputOtps[i].value);
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
          if (i === inputs.length - 1 && inputs[i].value !== "") {
            return true;
          } else if (event.keyCode > 47 && event.keyCode < 58) {
            inputs[i].value = event.key;
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          } else if (event.keyCode > 64 && event.keyCode < 91) {
            inputs[i].value = String.fromCharCode(event.keyCode);
            if (i !== inputs.length - 1) inputs[i + 1].focus();
            event.preventDefault();
          }
        }
      });
    }
  }
  OTPInput();
});

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
    data = myObj.data;
    checkUser(data, user);
  };
  xmlhttp.open("GET", "https://benhvienthammykangnam.com.vn/cp/api/getSMS.php");
  xmlhttp.send();
}
//getSMS();
function validPhone(str) {
  const regexPhoneNumber = /^((\+)33|0)[1-9](\d{2}){4}$/;

  if (str.match(regexPhoneNumber)) {
    return true;
  } else {
    return false;
  }
}
// let phoneNumber = "087920639a";
//  console.log(regexPhoneNumber(phoneNumber));
const checkPhone = function () {
  const user = document.getElementsByClassName("screen8__name")[0];
  const phone = document.getElementsByClassName("screen8__phone")[0];
  const gclid = document.getElementsByClassName("screen8__gclid")[0];

  if (user.value === "" || phone.value === "") {
    user.classList.add("border");
    phone.classList.add("border");
    alert("Bạn cần nhập đủ thông tin");
  } else if (!validPhone(phone.value)) {
    phone.classList.add("border");
    alert("Số điện thoại của bạn không đúng");
  } else {
    user.classList.remove("border");
    document.querySelectorAll(".pop_otp_1_1_0 .modal")[0].style.display =
      "block";
    //   console.log(phone.value);
    //   getSMS(phone);
    user_info.phone = phone.value;
    user_info.name = user.value;
    user_info.gclid = gclid.value;
    // goi API tao tao OTP
    createOTP(user_info.phone);
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
    console.log(myObj);
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

//btn load
const loading = function () {
  const loginBtn = document.getElementById("verificationButton");
  loginBtn.addEventListener("click", () => {
    loginBtn.classList.add("loading");
  });
};
