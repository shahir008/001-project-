// ======================================
// SMART QR RECORD SYSTEM
// SCRIPT.JS PART 1
// ======================================


// ---------- DOM ELEMENTS ----------

const form = document.getElementById("recordForm");

const photoInput = document.getElementById("photo");

const previewArea = document.getElementById("previewArea");

const fullName = document.getElementById("fullName");

const gender = document.getElementById("gender");

const dob = document.getElementById("dob");

const bloodGroup = document.getElementById("bloodGroup");

const height = document.getElementById("height");

const weight = document.getElementById("weight");

const phone = document.getElementById("phone");

const address = document.getElementById("address");

const uniqueIdBox = document.getElementById("uniqueId");

const qrBox = document.getElementById("qrcode");

const generateBtn = document.getElementById("generateBtn");

const saveBtn = document.getElementById("saveBtn");

const downloadBtn = document.getElementById("downloadBtn");

const currentDate = document.getElementById("currentDate");

const loadingPopup = document.getElementById("loadingPopup");

const successPopup = document.getElementById("successPopup");

const errorPopup = document.getElementById("errorPopup");

const errorMessage = document.getElementById("errorMessage");


// ---------- VARIABLES ----------

let generatedUniqueId = "";

let uploadedImageUrl = "";


// ---------- CURRENT DATE ----------

function showCurrentDate() {

const today = new Date();

currentDate.innerHTML =
today.toLocaleDateString("en-IN",{

day:"2-digit",

month:"long",

year:"numeric"

});

}

showCurrentDate();


// ---------- UNIQUE ID ----------

function generateUniqueID(){

const chars =
"ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let random="";

for(let i=0;i<8;i++){

random +=
chars.charAt(
Math.floor(
Math.random()*chars.length
)

);

}

generatedUniqueId =
"QRS-"+random;

uniqueIdBox.innerHTML =
generatedUniqueId;

}

generateUniqueID();


// ---------- PHOTO PREVIEW ----------

photoInput.addEventListener("change",function(){

const file =
this.files[0];

if(!file) return;

const reader =
new FileReader();

reader.onload=function(e){

previewArea.innerHTML=
`
<img
src="${e.target.result}">
`;

};

reader.readAsDataURL(file);

});
// ======================================
// SCRIPT.JS PART 2
// QR GENERATE + DOWNLOAD
// ======================================

// ---------- GENERATE QR ----------

generateBtn.addEventListener("click", () => {

    if (fullName.value.trim() === "") {

        errorMessage.innerHTML = "Please enter Full Name.";

        errorPopup.style.display = "flex";

        return;

    }

    if (generatedUniqueId === "") {

        generateUniqueID();

    }

    qrBox.innerHTML = "";

    QRCode.toCanvas(

        generatedUniqueId,

        {

            width: 220,

            margin: 2

        },

        function (error, canvas) {

            if (error) {

                console.log(error);

                errorMessage.innerHTML = "QR Generation Failed.";

                errorPopup.style.display = "flex";

                return;

            }

            qrBox.appendChild(canvas);

        }

    );

});



// ---------- DOWNLOAD QR ----------

downloadBtn.addEventListener("click", () => {

    const canvas = qrBox.querySelector("canvas");

    if (!canvas) {

        errorMessage.innerHTML =

        "Please Generate QR First.";

        errorPopup.style.display = "flex";

        return;

    }

    const link = document.createElement("a");

    link.download = generatedUniqueId + ".png";

    link.href = canvas.toDataURL("image/png");

    link.click();

});



// ---------- POPUP CLOSE ----------

document

.getElementById("closeSuccess")

.addEventListener("click", () => {

    successPopup.style.display = "none";

});



document

.getElementById("closeError")

.addEventListener("click", () => {

    errorPopup.style.display = "none";

});



// ---------- CLICK OUTSIDE POPUP ----------

window.addEventListener("click", (e) => {

    if (e.target === successPopup) {

        successPopup.style.display = "none";

    }

    if (e.target === errorPopup) {

        errorPopup.style.display = "none";

    }

});
// ======================================
// SCRIPT.JS PART 3
// CLOUDINARY + SUPABASE
// ======================================


// ---------- Upload Photo ----------

async function uploadPhoto(file){

if(!file){

return "";

}

const formData = new FormData();

formData.append("file",file);

formData.append(
"upload_preset",
CLOUDINARY_UPLOAD_PRESET
);

const response = await fetch(

`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,

{

method:"POST",

body:formData

}

);

if(!response.ok){

throw new Error("Photo Upload Failed");

}

const data = await response.json();

return data.secure_url;

}



// ---------- Save Record ----------

saveBtn.addEventListener("click",async()=>{

try{

loadingPopup.style.display="flex";


// Upload Photo

uploadedImageUrl = await uploadPhoto(

photoInput.files[0]

);


// Save To Supabase

const {error}=await supabaseClient

.from(DATABASE_TABLE)

.insert([{

unique_id:generatedUniqueId,

full_name:fullName.value,

gender:gender.value,

date_of_birth:dob.value,

blood_group:bloodGroup.value,

height:height.value,

weight:weight.value,

phone_number:phone.value,

address:address.value,

photo_url:uploadedImageUrl

}]);


loadingPopup.style.display="none";


if(error){

throw error;

}


// Success

successPopup.style.display="flex";

}
catch(err){

loadingPopup.style.display="none";

errorMessage.innerHTML=

err.message;

errorPopup.style.display="flex";

}

});
// ======================================
// SCRIPT.JS PART 4
// NEW RECORD
// ======================================

const newRecordBtn =
document.getElementById("newRecordBtn");

newRecordBtn.addEventListener("click",()=>{

// Form Clear

form.reset();

// Remove Photo Preview

previewArea.innerHTML=`

<div class="uploadIcon">

📷

</div>

<p>

Upload Photo

</p>

`;

// Remove QR

qrBox.innerHTML="";

// New Unique ID

generateUniqueID();

// Reset Variables

uploadedImageUrl="";

// Focus Name

fullName.focus();

});