document.addEventListener('DOMContentLoaded', () => {
  
  if (localStorage.getItem('user_name')){
   window.location.href="/Home";
  }

  // default : submit button is disabled
  var usr = document.querySelector('#user_name')
  var btn =   document.querySelector('#submit')
    btn.disabled= true;


//Enable button if there is text
  document.querySelector('#user_name').onkeyup = () => {
    if(usr.value.length > 0 )
      {btn.disabled=false}
    else{
      btn.disabled=true}
  }

  document.querySelector('#user_login_name').onsubmit = () =>{
    const name = document.querySelector('#user_name').value;
    localStorage.setItem('user_name',name);
  }
})
