const uniqueid = createUniqueID();
const goToDashboard = () => {
  window.location = `/dashboard.html?box=box_${uniqueid}`;
};
const copyURL = () => {
  /* Get the text field */
  var copyText = document.getElementById('boxurl');
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  /* Copy the text inside the text field */
  document.execCommand('copy');
  document.getElementById('copyBtn').style.color = '#27ae60';
  setTimeout(() => {
    document.getElementById('copyBtn').style.color = '#333';
  }, 3000);
};

function createUniqueID() {
  var dt = new Date().getTime();
  var uuid = 'xxyxxxxxxyxxxxxyxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
var base =
  window.location.protocol +
  '//' +
  window.location.hostname +
  (window.location.port ? ':' + window.location.port : '');
document.getElementById('boxurl').value = base + '/box_' + uniqueid;

const copyBtn = document.querySelector("#copyBtn");
copyBtn.addEventListener("click", function(){copyURL();});
