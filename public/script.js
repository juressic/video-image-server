var uploadFieldImage = document.getElementById('imageInput');
var uploadField = document.getElementById('videoInput');

/*uploadField.addEventListener('onchange', handleFiles, false);

function handleFiles() {
  console.log('file upload input');
}*/

uploadFieldImage.onchange = function () {
  console.log('file input');
  if (this.files[0].size > 3097152) {
    alert('Image file is too big!');
    this.value = '';
  }
};

uploadField.onchange = function () {
  console.log('file input');
  if (this.files[0].size > 9097152) {
    alert('Video file is too big!');
    this.value = '';
  }
};
