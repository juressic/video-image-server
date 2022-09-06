var uploadFieldImage = document.getElementById('imageInput');
var uploadField = document.getElementById('videoInput');

/*uploadField.addEventListener('onchange', handleFiles, false);

function handleFiles() {
  console.log('file upload input');
}*/

uploadFieldImage.onchange = function () {
  console.log('file input');
  if (this.files[0].size > 597152) {
    alert('Image file is too big!');
    this.value = '';
  }
};

uploadField.onchange = function () {
  console.log('file input');
  if (this.files[0].size > 2097152) {
    alert('Video file is too big!');
    this.value = '';
  }
};
