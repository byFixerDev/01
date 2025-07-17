const NAV_CHAT = document.getElementById('nav--chat');
const BTN_ICON = document.getElementById('btn-icon');
BTN_ICON.addEventListener('click', function(){
    NAV_CHAT.classList.toggle('active');
});