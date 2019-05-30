document.addEventListener("DOMContentLoaded",()=>{

  
  // appear user name
  var user_name_local = localStorage.user_name
  document.querySelector('#user_local_name').innerHTML = "Hello "+ user_name_local

  
  var lout = document.querySelector('#logout');
      // logout button
      lout.onclick = ()=> {
          localStorage.clear('user_name') ;
          window.location.replace('/');
      }

   //div to carry the groups added
  const groups_sec =document.querySelector('#groups');

  
  // add_group_btn
  const add_group_btn = document.querySelector('#add_group');
    
  // group_name : input text add_group
  const group_name_text = document.querySelector('#group_name') ;

   // the place for chat rooms
  var chats =document.querySelector('#chat')

  // button disabled for sure
  add_group_btn.disabled=true;

  
  //enable add button
  group_name_text.onkeyup = ()=> {
    if(group_name_text.value.length > 0){ add_group_btn.disabled = false; }
    else{ add_group_btn.disabled=true;}
    }

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
      
  socket.on('connect', ()=> {
    //get the already exists groups on startup
    socket.emit('start page')  
  });

  //add group
  add_group_btn.onclick = ()=>{
    var group_name_send = group_name_text.value;
    socket.emit('add groups',{"group_name":group_name_send})
    group_name_text.value="";
    add_group_btn.disabled=true;
  };




  socket.on('done groups',groups=>{
    //delete excisting groups first
    while(groups_sec.firstChild){groups_sec.removeChild(groups_sec.firstChild)}
    //add the new groups
    groups.forEach(element =>{
      var new_group = document.createElement('button');
          new_group.className = "btn_alone btn ";
          new_group.innerHTML = element["group_name"].valueOf();  
          new_group.value= element["group_name"];
          new_group.onclick=()=>{socket.emit('open chat',{"name":new_group.value})};
   
          new_group.style.marginBottom = '10px';
      groups_sec.appendChild(new_group);

            
    })
    
  })
  
    
 
      // where the messages added
  var chat_room = document.createElement('div');
        chat_room.setAttribute("id","all_messages");
        chat_room.style.marginBottom ="1%";
        
        
      
    
  function insert_msgs(s_group){ 
      chat_room.innerHTML = ""; 
      s_group.msgs.forEach(msg_exist=>{
      chat_room.innerHTML += "<p style = 'display:block; margin-left:2%;,margin-right:1%;'>"+ msg_exist.speaker.valueOf() + " :" + msg_exist.message.valueOf()+ "</p>" })
      ;}



  //input field
  var chat_text = document.createElement('input');
  chat_text.setAttribute("id","write")
  chat_text.onclick=()=>{chat_text.focus()}
  

  //send button
  var send_button = document.createElement('button');
  send_button.setAttribute('id','submit_msg')
  send_button.className = "btn_alone btn";
  send_button.innerHTML = "Send";
  send_button.disabled=true
 
  

  
  socket.on("add chat",grp=>{
            
  //remove all messages
    while (chats.firstChild){chats.removeChild(chats.firstChild)};
    // add chat + input msgs sender btn
    chats.appendChild(chat_room);
    insert_msgs(grp);
    chats.appendChild(chat_text);
    chat_text.value='';
    chats.appendChild(send_button);

    
    chat_text.onkeyup = ()=>{chat_text.focus();
      
        if(chat_text.value.length > 0){
          send_button.disabled = false;}else{
            send_button.disabled=true;}}
  // to let enter sends msgs
    chat_text.onkeydown = (s)=>{
        if(s.keyCode === 13){send_button.focus();chat_text.innerHTML=""}}

    send_button.onclick =()=>{
        socket.emit('instert msgs',{"msg_send":chat_text.value ,"speaker":localStorage.user_name, "group":grp.group_name});
        }
      })

  })
