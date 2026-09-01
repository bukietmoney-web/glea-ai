# glea-ai
Glea Ai turn images to video 
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Glea AI</title>
<style>
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:linear-gradient(135deg,#ffb6e6,#b8e7ff,#d8c2ff);
  min-height:100vh;
  color:#222;
}
.container{
  max-width:700px;
  margin:auto;
  padding:30px 18px;
}
.logo{
  text-align:center;
  font-size:42px;
  font-weight:bold;
  color:#7b2cff;
}
.subtitle{
  text-align:center;
  font-size:18px;
  margin-bottom:25px;
}
.card{
  background:white;
  padding:25px;
  border-radius:25px;
  box-shadow:0 10px 30px rgba(0,0,0,.15);
}
.upload{
  border:3px dashed #9b6cff;
  padding:35px 15px;
  text-align:center;
  border-radius:20px;
  cursor:pointer;
}
.upload:hover{
  background:#f7f1ff;
}
input[type=file]{
  display:none;
}
textarea{
  width:100%;
  height:120px;
  margin-top:20px;
  padding:15px;
  border-radius:15px;
  border:2px solid #ddd;
  font-size:16px;
  box-sizing:border-box;
}
button{
  width:100%;
  margin-top:20px;
  padding:16px;
  border:0;
  border-radius:15px;
  background:linear-gradient(90deg,#ff4da6,#7b2cff,#00bfff);
  color:white;
  font-size:18px;
  font-weight:bold;
}
#preview{
  width:100%;
  margin-top:20px;
  border-radius:15px;
  display:none;
}
.message{
  text-align:center;
  margin-top:15px;
  color:#666;
}
</style>
</head>

<body>

<div class="container">

<div class="logo">✨ Glea AI</div>

<div class="subtitle">
Turn your images into amazing videos 🎬
</div>

<div class="card">

<label class="upload">
📷<br><br>
<strong>Tap here to upload your image</strong>
<br>
Choose a photo from your phone
<input type="file" id="imageInput" accept="image/*">
</label>

<img id="preview">

<textarea id="prompt"
placeholder="Describe the movement you want...

Example:
Make the person smile, wave and slowly walk forward."></textarea>

<button onclick="generateVideo()">
🎬 Generate Video
</button>

<div class="message" id="message"></div>

</div>
</div>

<script>

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", function(){

if(this.files && this.files[0]){

preview.src = URL.createObjectURL(this.files[0]);

preview.style.display = "block";

}

});

function generateVideo(){

const prompt =
document.getElementById("prompt").value;

const message =
document.getElementById("message");

if(!imageInput.files[0]){

message.innerText =
"Please upload an image first 📷";

return;

}

if(!prompt){

message.innerText =
"Please describe the movement ✍️";

return;

}

message.innerText =
"Glea AI is ready! 🎉 AI video generation will be connected next.";

}

</script>

</body>
</html>
