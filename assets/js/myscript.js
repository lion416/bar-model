var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var isDraging;
var isAligningDraging;
var whichObjIsDrag = 0;
// var isCut = false;
var isCutLineShow;
var isScissorsLineShow;
var isResize;
var isPencil = false;
// var isPaint = false;
var isEraser;
var isSelect;
var isSelectDrag;
var i_ToolIdx = 0;//0:non-select, 1:add object, 2: cutBar selected, 3: pencil selected 4: eraser selected 5: paint selected 6: pencilEraser selected 7: copy selected 8: scissors selected 9: multi select selected...
// var isHorizontalArrow;
// var isUpperDownArrow;
var isHorizaontalArrowDraging;
var isUpperDownArrowDraging;
var isDottedUpperDownArrowDraging;
var im_MathSymbol = 0; // 0: non-select, 1: question mark, 2: equal mark, 3: plus, 4: minus, 5: multiple, 6: divider

var markCnPtX = 300;
var markCnPtY = 300;
var markLn = 200;
var isMarkDraging;

var isTextDraging;
//initialize the array of Objects
var objArray = [];

// pencil draw variables
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

//object draging start position in object coordinate
var i_DragMoveSt = {X : 0 , Y : 0};
// var i_DragStOffset = {X : 0 , Y : 0};
var i_MarkDragStOffset = {X : 0, Y : 0};
var i_SelectStOffset = {X : 0, Y :0};

var curColor = "#000";
// var curColor = "#" + document.getElementById("colorPicker").value;
var clickColor = new Array();

var clickTool = new Array();
var curTool = "crayon";

//cut the object bar variables
var cutClickX = new Array();
var cutClickY = new Array();

var cutClick = new Array();

//scissors the object bar variables
var scissorClickX = new Array();
var scissorClickY = new Array();

var selectClickX = new Array();
var selectClickY = new Array();
 
//size of the line
var barlineSize = 7;
// size of object outline when it selected.
var i_SelOutLineWidth = 7;

// color of the bar
var barColor = "#53575A";
// color of object outline when it selected.
var clr_SelOutLineColor = "#53BE88";

// color of the selected for paint
var currentColor = "#53575A";
barColor = currentColor;

var clickSize = new Array();        // this is the size of the pencil line
var curSize = "10";

var upperdownArrowStX = 200;
var upperdownArrowStY = 220;
var ArrowLineStX = 200;
var ArrowLineStY = 200;
var ArrowLineLn = 300;
var isHorizontalArrowResize;
var isHorizontalArrowResizeL;
var isUpperDownArrowResize;
var isUpperDownArrowResizeL;
var isDottedUpperDownArrowResize;
var isDottedUpperDownArrowResizeL;

var i_SelectAreaStX;
var i_SelectAreaStY;

var isDragAllSelected;

var b_mouseEnteredDustbin;
var cutBarColor = "#0081c6";
var b_ctlBtnClicked;
var nominator;
var denominator;
var hr;

var startingPX = 500;
var startingPY = 500;
var l = 600;
var h = 100;

var b_CorrectTxt;
var whichTxtObj;
var isResizeSticker;
var b_isRecorrectFraction;

var whichFraction = 0;
var b_uploaded = false;

var speedX = 2;
var speedY = 2;

resize();

// resize canvas when window is resized
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}


//this is sidebar menu
$("#menu-close").click(function(e) {
  e.preventDefault();
  $("#sidebar-wrapper").toggleClass("active");
});
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#sidebar-wrapper").toggleClass("active");
});

// Make the pencilToolBox element draggable:
dragElement(document.getElementById("pencilToolBox"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
var fractionStPX = 200;
var fractionStPY = 200;
var fractionFontSize = 35;

$( document ).ready(function() {
  // this is for pencil tool box starting position
  var x = document.body.clientWidth - 200 + "px";
  document.getElementById("pencilToolBox").style.left = x;
  $( window ).resize(function() {
    var x = document.body.clientWidth - 200 + "px";
    document.getElementById("pencilToolBox").style.left = x;
  });

  document.getElementById("valueInput").addEventListener("change",function(){
    currentColor = "#" + document.getElementById("valueInput").value;
    curColor = "#" + document.getElementById("valueInput").value;
    // barColor = "#" + document.getElementById("valueInput").value;
  });

  document.addEventListener('keydown', function(event) {
    // for (var j = 0; j < objArray.length; j++){
    //   if( objArray[j].startingPointX >= i_SelectAreaStX && (objArray[j].startingPointX + objArray[j].length) <= selectClickX[selectClickX.length-1] && ((objArray[j].startingPointY +objArray[j].height) <=selectClickY[selectClickY.length-1])){
    //         objArray[j].b_SelState = true;
    //       }
    // }
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) { // control and z button is clicked
      if(objArray[objArray.length-1].type == "rec" && objArray[objArray.length-1].b_SelState == true && objArray[objArray.length-1].sheetCnt >= 2){
        objArray[objArray.length-1].sheetCnt--;
        objArray[objArray.length-1].sheetColor.pop();
      }
      else{
        var n = clickX.length-1;
        for (var i = n; i >= 0 ; i--){
          tempClickX.push(clickX[i]);
          tempClickY.push(clickY[i]);
          tempClickDrag.push(clickDrag[i]);
          if (clickDrag[i] == false){
            for (var j = i; j <= n; j++){
              clickX.pop();
              clickY.pop();
              clickDrag.pop();
            }
            break;
          }
        }
      }
      drawAllObj();  
    }
    else if (event.code == 'KeyY' && (event.ctrlKey || event.metaKey)){
      clickX.push(tempClickX[tempClickX.length-1]);
      clickY.push(tempClickY[tempClickY.length-1]);
      clickDrag.push(tempClickDrag[tempClickX.length-1]);
      var n = tempClickX.length-2
      for (var i = n; i >= 0; i--){

        if (tempClickDrag[i] == false){
          for (var j = i; j <= n; j++){
            tempClickX.pop();
            tempClickY.pop();
            tempClickDrag.pop();
          }
          break;
        }

        clickX.push(tempClickX[i]);
        clickY.push(tempClickY[i]);
        clickDrag.push(tempClickDrag[i]);
        if (i==0)
        {
          tempClickX = [];
          tempClickY = [];
          tempClickDrag = [];
        }
      }
      drawAllObj();
    }
    else if (event.code == 'Delete'){
      if (objArray.length == 0){
        return;
      }
      // delete button is clicked
      // if(objArray[objArray.length-1].b_SelState == true){
      //   objArray.pop();
      //   whichObjIsDrag--; 
      // }
      // else{
      // for (var j = 0; j < objArray.length; j++){
      //   if (objArray[j].startingPointX >= i_SelectAreaStX && (objArray[j].startingPointX + objArray[j].length) <= selectClickX[selectClickX.length-1]+ i_SelectAreaStX && ((objArray[j].startingPointY +objArray[j].height) <=selectClickY[selectClickY.length-1] + i_SelectAreaStY) && objArray[j].startingPointY >= i_SelectAreaStY) {
      //     objArray.splice(j,1);
      //     j--;
      //   }
      // }
      // }
      //delete selected obj
      for (var j = 0; j < objArray.length; j++){
        if (objArray[j].b_SelState == true) {
          objArray.splice(j,1);
          j--;
        }
      }
    }
    // when the control button is clicked 
    else if ((event.ctrlKey || event.metaKey)){
      b_ctlBtnClicked = true;
    }
    //when the direction button: left, right up and down   clicked
    else if(event.keyCode == "38"){//up
      if (objArray[whichObjIsDrag].b_SelState == true) {
        objArray[whichObjIsDrag].startingPointY -= speedY;
      }
    }
    else if(event.keyCode == "40"){//down
      if (objArray[whichObjIsDrag].b_SelState == true) {
        objArray[whichObjIsDrag].startingPointY += speedY;
      }
    }
    else if(event.keyCode == "37"){//left
      if (objArray[whichObjIsDrag].b_SelState == true) {
        objArray[whichObjIsDrag].startingPointX -= speedX;
      }
    }
    else if(event.keyCode == "39"){//right
      if (objArray[whichObjIsDrag].b_SelState == true) {
        objArray[whichObjIsDrag].startingPointX += speedX;
      }
    }
    //when the enter key is clicked
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      var test = document.getElementById("nominator");
      if(!test)
        return;

      var nomin = document.getElementById("nominator").value;
      var denomin = document.getElementById("denominator").value;

      if(!b_isRecorrectFraction){
        if(objArray.length == 0){   // see if there is a previous bar and give the staringPX and staringPY according to it
          initObj("fraction",fractionStPX,fractionStPY,fractionFontSize,h,null,null,null,nomin,denomin);
        }
        else{
          for (var i = objArray.length-1; i >= 0; i--){
            if(objArray[i].type == "fraction"){
              initObj("fraction",fractionStPX,objArray[i].startingPointY+10+h,fractionFontSize,h,null,null,null,nomin,denomin);
              break;
            }
          }
        }
        var k = false;
        for (var i = objArray.length-1; i >= 0; i--){
          if(objArray[i].type == "fraction"){
            k = true;
          }
        }
        if (k == false){
          initObj("fraction",fractionStPX,fractionStPY,fractionFontSize,h,null,null,null,nomin,denomin);
        }
      }
      else{
        objArray[whichFraction].nomin = nomin;
        objArray[whichFraction].denomin = denomin;
        drawAllObj();
        b_isRecorrectFraction = false;
      }
      document.getElementById("nominator").remove();
      document.getElementById("denominator").remove();
      document.getElementById("hr").remove();
      nominator = null;
      denominator = null;
      hr = null;
    }
      clearObj();
      drawAllObj();
  });
  // when the control button is clicked
  $(document).keyup(function() {
    b_ctlBtnClicked = false;
  });
  //when the restart button clicked
  $("#restart").click(function(){
    $(".bkgr_fricc").show();
  });

  $('#yesBtn').click(function(){
    location.reload();
  });
  
  $(".CloseButton").click(function(){
    $(".bkgr_fricc").hide();
  });
  //color group
  // $("#colorPicker").click(function(){
  //   console.log(document.getElementById("valueInput").value);
  //   currentColor = "#" + document.getElementById("valueInput").value;
  //   curColor = "#" + document.getElementById("valueInput").value;
  //   barColor = "#" + document.getElementById("valueInput").value;
  // });
  $("#clrGroup").children().click(function(){
    if(this.style.marginTop == "-7%"){
      this.style.marginTop = "-3%";
    }
    else{
      for(var i = 0 ; i < $("#clrGroup").children().length; i++){
        $("#clrGroup").children()[i].style.marginTop = "-3%";
      }
      this.style.marginTop = "-7%";
    }
    currentColor = $(this).data('clr');
    curColor = $(this).data('clr');
    // barColor = $(this).data('clr');
  });
  var b_saw = true;
  var b_scissors = true;
  var b_pencil = true;
  var b_paint = true;
  var b_eraser = true;
  $(".tool").click(function(){
    switch($(this).data("tool")){
      case "saw": if(b_saw){
                    document.body.style.cursor = "url('./assets/images/saw_m.png'), auto";
                    unSelectAllObj();
                    i_ToolIdx = 2;

                    b_saw = false;
                    b_scissors = true;
                    b_pencil = true;
                    b_paint = true;
                    b_eraser = true;
                  }
                  else{
                    i_ToolIdx = 0;
                    disableTool();
                    b_saw = true;
                  }
                  break;
      case "scissors":  if(b_scissors){
                            document.body.style.cursor = "url('./assets/images/scissors_m.png'), auto";
                            
                            unSelectAllObj();
                            i_ToolIdx = 8;

                            b_scissors = false;
                            b_saw = true;
                            b_pencil = true;
                            b_paint = true;
                            b_eraser = true;
                        }
                        else{
                          i_ToolIdx = 0;
                          disableTool();
                          b_scissors = true;
                          }
                        break;
      case "pencil":    if(b_pencil){
                          document.body.style.cursor = "url('./assets/images/pencil_m.png'), auto";
                          var x = document.getElementById("pencilToolBox");
                          x.style.display = "block";
                          unSelectAllObj();
                          i_ToolIdx =3;
                          curTool = " ";
                          b_pencil = false;
                          b_scissors = true;
                          b_saw = true;
                          b_paint = true;
                          b_eraser = true;

                        }
                        else{
                          i_ToolIdx = 0;
                          disableTool();
                          b_pencil = true;
                        }
                        break;
      case "paint":     if(b_paint){
                          document.body.style.cursor = "url('./assets/images/paint_m.png'), auto";
                          unSelectAllObj();     
                          i_ToolIdx = 5;
                          b_paint = false;
                          b_scissors = true;
                          b_pencil = true;
                          b_saw = true;
                          b_eraser = true;

                        }
                        else{
                          i_ToolIdx = 0;
                          disableTool();
                          b_paint = true;
                        }
                        break;
      case "eraser": if(b_eraser){
                        document.body.style.cursor = "url('./assets/images/eraser_m.png'), auto";
                        unSelectAllObj();
                        if (i_ToolIdx != 4){
                          i_ToolIdx = 4;
                          isPencil = true;
                          curTool = "eraser";
                        }
                        else{
                          i_ToolIdx = 0;
                          isPencil = false;
                        }
                        b_eraser = false;
                        b_scissors = true;
                        b_pencil = true;
                        b_saw = true;
                        b_paint = true;
                      }
                      else{
                        i_ToolIdx = 0;
                        disableTool();
                        b_eraser = true;
                      }
                    break;
    }
  });

var stickerStPX = 10;
var stickerStPY = 100;
var stickerLen = 70;
var stickerHeight = 90;
  $(".sticker").click(function(){
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
    var stickerImg = this;
    if (this.id == "yellowCar" || this.id == "blueCar" || this.id == "sweets"){
      stickerLen = 90;
      stickerHeight = 70;
    }
    else if(this.id == "question" || this.id == "redquestion" || this.id == "logoclrquestion"){
      stickerLen = 38;
      stickerHeight = 65;
    }
    // else if(this.id == "st_one" || this.id == "st_x" || this.id == "st_y" || this.id == "st_xy"){
    //   stickerLen = 40;
    //   stickerHeight = 90;
    // }
    else if(this.id == "st_bigger" || this.id == "st_smaller" || this.id == "st_biggerequal" || this.id == "st_smallerequal" || this.id == "st_equal" || this.id =="st_notequal"){
      stickerLen = 70;
      stickerHeight = 70;
    }
    else{
      stickerLen = 70;
      stickerHeight = 90;
    }
    // ctx.drawImage(stickerImg, stickerStPX, stickerStPY, stickerLen, stickerHeight);
    
    if(objArray.length == 0){   // see if there is a previous bar and give the staringPX and staringPY according to it
      initObj("sticker",stickerStPX,stickerStPY,stickerLen,stickerHeight,null,null,null,null,null,stickerImg);
    }
    else{
      for (var i = objArray.length-1; i >= 0; i--){
        if(objArray[i].type == "sticker"){
          initObj("sticker",objArray[i].startingPointX+10+stickerLen,stickerStPY,stickerLen,stickerHeight,null,null,null,null,null,stickerImg);
          break;
        }
      }
    }
    var k = false;
    for (var i = objArray.length-1; i >= 0; i--){
      if(objArray[i].type == "sticker"){
        k = true;
      }
    }
    if (k == false){
      initObj("sticker",stickerStPX,stickerStPY,stickerLen,stickerHeight,null,null,null,null,null,stickerImg);
    }
  });

  
  //when the tools is selected
  // $("#tools").children().click(function(){

  // });
  //when the plusbar button clicked
  $("#addBar").click(function(){
    var type = "rec";
    if(objArray.length == 0){   // see if there is a previous bar and give the staringPX and staringPY according to it
      initObj(type,startingPX,startingPY,l,h,null,null,barColor);
    }
    else{
      for (var i = objArray.length-1; i >= 0; i--){
        if(objArray[i].type == "rec"){
          initObj(type,objArray[i].startingPointX,objArray[i].startingPointY + objArray[i].height + 15,l,h,null,null,barColor);
          break;
        }
      }
    }
    var k = false;
    for (var i = objArray.length-1; i >= 0; i--){
      if(objArray[i].type == "rec"){
        k = true;
      }
    }
    if (k == false){
      initObj(type,startingPX,startingPY,l,h,null,null,barColor);
    }
     // output the bar ended
    i_ToolIdx =1;
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
    isDraging = false;
    isCutLineShow = false;
    isResize = false;
    paint = false;
  });

  //when the save button is clicked
  $("#download").click(function(){
    if(objArray.length == 0 && clickX.length == 0){
      alert("Nothing to download");
      return;
    }
    if(!b_uploaded){
      downloadCan();
    }
    else
      makeScreenshot();
  });

  function makeScreenshot(){
    html2canvas(document.getElementById("myCanvas"), {scale: 1}).then(canvas => {
      downloadCanvas(canvas);
    });
  }

  $("#uploadImage").change(function(e) {
    // var URL = window.URL;
    // var url = URL.createObjectURL(e.target.files[0]);
    // make_base(url);
    var file = document.getElementById("uploadImage").files[0];
    var reader = new FileReader();
    reader.onloadend = function(){
      // ctx.globalCompositeOperation='destination-over';
      b_uploaded = true;
      c.style.backgroundImage = "url(" + reader.result + ")";        
    }
    if(file){
      reader.readAsDataURL(file);
    }else{
    }
  });
  //when the upload button is clicked
  
  // function make_base(url)
  // {
  //   base_image = new Image();
  //   base_image.src = url;
  //   base_image.onload = function(){
  //     ctx.drawImage(base_image, 0, 0);
  //   }
  // }

  // when the abc button is clicked
  $("#abc").click(function(){
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
    $('.hover_bkgr_fricc').show();
  });

  $("#detach").click(function(){
    var d_LengthOfCutBarPart = objArray[objArray.length-1].length/objArray[objArray.length-1].sheetCnt;
    var tempStX = objArray[objArray.length-1].startingPointX;
    var tempStY = objArray[objArray.length-1].startingPointY;
    var tempClr = objArray[objArray.length-1].sheetColor;
    var tempCnt = objArray[objArray.length-1].sheetCnt;
    objArray.pop();
    for (var k = 0; k < tempCnt; k++){ 
      // unSelectAllObj();
      initObj("rec",tempStX+k*d_LengthOfCutBarPart,tempStY,d_LengthOfCutBarPart,h,null,null,barColor);
      objArray[objArray.length-1].sheetColor[0] = tempClr[k];
      // objArray[objArray.length-1].b_SelState = true;
    }
    // for (var j = 0; j < tempCnt; j++){
    //   objArray[objArray.length-1-j].b_SelState = true;
    // }
    drawAllObj();
  });

  $('.popupCloseButton').click(function(){
    $('.hover_bkgr_fricc').hide();
  });
  // when the confirm btn is clicked
  var st_StPX = 100;
  var st_StPY = 100;
 
  $("#confirmBtn").click(function(){
    var str = document.getElementById("text").value;
    type = "text";
    var txt_style = document.getElementById("font-style").value;
    var st_l = document.getElementById("font-size").value;
    st_l = parseInt(st_l,10);
    if(b_CorrectTxt){
      objArray[whichTxtObj].text = str;
      objArray[whichTxtObj].length = st_l;
      objArray[whichTxtObj].height = st_l;
      objArray[whichTxtObj].txt_style = txt_style;
      drawAllObj();
    }
    else{
      if(objArray.length == 0){   // see if there is a previous bar and give the staringPX and staringPY according to it
        initObj(type,st_StPX,st_StPY,st_l,st_l,str,txt_style,barColor);
     }
     else{
       for (var i = objArray.length-1; i >= 0; i--){
         if(objArray[i].type == "text"){
           initObj(type,objArray[i].startingPointX,objArray[i].startingPointY+60,st_l,st_l,str,txt_style,barColor);
           break;
         }
       }
     }
     var k = false;
     for (var i = objArray.length-1; i >= 0; i--){
       if(objArray[i].type == "text"){
         k = true;
       }
     }
     if (k == false){
        initObj(type,st_StPX,st_StPY,st_l,st_l,str,txt_style,barColor);
     }
    }
    
    b_CorrectTxt= false;
    $('.hover_bkgr_fricc').hide();
  });
  c.addEventListener('dblclick', function(e){ 
    var x = e.x;
    var y = e.y;
    var rect = c.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;   // these are correct coordinate
    for(var j = 0; j < objArray.length; j++){
      if (objArray[j].type == "text" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX + objArray[j].length * objArray[j].text.length/2) >= x) &&  ((objArray[j].startingPointY-objArray[j].length) <= y) && (objArray[j].startingPointY >= y))
      {
        $('.hover_bkgr_fricc').show();
        whichTxtObj = j;
        b_CorrectTxt = true;
      }
      else if (objArray[j].type == "fraction" && (objArray[j].startingPointX-objArray[j].length/2 <= x) && ((objArray[j].startingPointX+objArray[j].length/2*(len = (objArray[j].nomin.length>objArray[j].denomin.length) ? objArray[j].nomin.length+1 : objArray[j].denomin.length+1)) >= x) && ((objArray[j].startingPointY-objArray[j].length)<=y)&&((objArray[j].startingPointY+2*objArray[j].length)>=y)){
        var testc = document.getElementById("nominator");
        if (testc){
          alert("Input all before editing!");
          return;
        }
        nominator = document.createElement("INPUT");// create nomin input
        // nominator.style.position = "absolute";
        nominator.id = "nominator";
        nominator.style.width = "40px";
        nominator.style.height = "30px";
        nominator.style.textAlign = "center";
        nominator.type = "number";
        nominator.value = objArray[j].nomin;
        document.getElementById("fract").appendChild(nominator);
        hr = document.createElement("hr");
        hr.id = "hr";
        hr.style.width = "80px";
        hr.size = "8";
        hr.style.backgroundColor = "black";
        hr.style.marginLeft = "-20px";
        document.getElementById("fract").appendChild(hr);
        denominator = document.createElement("INPUT"); // create denomin input
        denominator.id = "denominator";
        denominator.style.width = "40px";
        denominator.style.height = "30px";
        denominator.style.textAlign = "center";
        denominator.type = "number";
        denominator.value = objArray[j].denomin;
        document.getElementById("fract").appendChild(denominator);
        b_isRecorrectFraction = true;  // this is boolean for correct fraction when enter button is clicked
        whichFraction = j;

      }
    }
  });
  var tempClickX = new Array();
  var tempClickY = new Array();
  var tempClickDrag = new Array();
  //undo and redo button
  $("#undo").click(function(){
    var n = clickX.length-1
    for (var i = n; i >= 0 ; i--){
      tempClickX.push(clickX[i]);
      tempClickY.push(clickY[i]);
      tempClickDrag.push(clickDrag[i]);


      if (clickDrag[i] == false){
        for (var j = i; j <= n; j++){
          clickX.pop();
          clickY.pop();
          clickDrag.pop();
        }
        break;
      }
    }
    drawAllObj();  
  });

  $("#redo").click(function(){
    clickX.push(tempClickX[tempClickX.length-1]);
    clickY.push(tempClickY[tempClickY.length-1]);
    clickDrag.push(tempClickDrag[tempClickX.length-1]);
    var n = tempClickX.length-2
    for (var i = n; i >= 0; i--){

      if (tempClickDrag[i] == false){
        for (var j = i; j <= n; j++){
          tempClickX.pop();
          tempClickY.pop();
          tempClickDrag.pop();
        }
        break;
      }

      clickX.push(tempClickX[i]);
      clickY.push(tempClickY[i]);
      clickDrag.push(tempClickDrag[i]);
      if (i==0)
      {
        tempClickX = [];
        tempClickY = [];
        tempClickDrag = [];
      }
    }
    drawAllObj();
  });

  $("#hideToolbar").click(function(){
    document.getElementById("pencilToolBox").style.display = "none";
  });

  //when the dustbin button is clicked
  $("#dustbin").click(function(){
    document.body.style.cursor = 'context-menu';
    if (objArray.length == 0){
      return;
    }
    i_ToolIdx = 4;
    // if(objArray[objArray.length-1].b_SelState == true){
    //   objArray.pop();
    //   whichObjIsDrag--;
    // }
    for (var j = 0; j < objArray.length; j++){
      if (objArray[j].b_SelState == true) {
        objArray.splice(j,1);
        j--;
      }
    }
      
    // else
    //   alert("Please select object to remove!");
    clearObj();
    drawAllObj();
  });

  //when  the mouse enters the dustbin
  $("#dustbin").mouseenter(function(){
    b_mouseEnteredDustbin = true;
  });

  $("#dustbin").mouseleave(function(){
    b_mouseEnteredDustbin = false;
  });
  // $("#dustbin").mouseup(function(){
  //   if (b_mouseEnteredDustbin){
  //     console.log("dddddsssaa");
  //     objArray.pop();
  //     drawAllObj();
  //   }
  // });


  //pencil eraser button is clicked
  $("#pencilEraser").click(function(){
    unSelectAllObj();
    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = [];
    clickSize = [];
    clearObj();
    drawAllObj();
  });

  // when copy button is clicked
  $("#copy").click(function(){
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
    if(objArray.length == 0)
      return;
    if (objArray[objArray.length-1].type == "rec" && objArray[objArray.length-1].b_SelState == true){
      // copy(i_DragMoveSt.X,i_DragMoveSt.Y);

      // var tmpCnt = objArray[objArray.length-1].sheetCnt;
      // var tmpClr = objArray[objArray.length-1].sheetColor;
      // unSelectAllObj();
      // initObj("rec",objArray[objArray.length-1].startingPointX,objArray[objArray.length-1].startingPointY+15+objArray[objArray.length-1].height,objArray[objArray.length-1].length,objArray[objArray.length-1].height,null,null,barColor);
      // objArray[objArray.length-1].b_SelState = true;
      // objArray[objArray.length-1].sheetCnt = tmpCnt;
      // ///////////////////////////////////changed by rph///////////////////////////////////////
      // for(var j = 0; j < tmpClr.length; j ++)
      //   objArray[objArray.length-1].sheetColor[j] = tmpClr[j];
      // ////////////////////////////////////////////////////////////////////////////////////////
      // drawAllObj();

      if (objArray[objArray.length-1].sheetCnt <= 1){
        var tmpCnt = objArray[objArray.length-1].sheetCnt;
        var tmpClr = objArray[objArray.length-1].sheetColor;
        unSelectAllObj();
        initObj("rec",objArray[objArray.length-1].startingPointX,objArray[objArray.length-1].startingPointY+15+objArray[objArray.length-1].height,objArray[objArray.length-1].length,objArray[objArray.length-1].height,null,null,barColor);
        objArray[objArray.length-1].b_SelState = true;
        objArray[objArray.length-1].sheetCnt = tmpCnt;
        ///////////////////////////////////changed by rph///////////////////////////////////////
        for(var j = 0; j < tmpClr.length; j ++)
          objArray[objArray.length-1].sheetColor[j] = tmpClr[j];
        ////////////////////////////////////////////////////////////////////////////////////////
        drawAllObj();
      }
      else{
        $('.bkgr_fricc_copy').show();
        

      }

    }
    else{
      alert("Select bar to copy");
    }

  });

  $('#confirmCopy').click(function(){
    if(document.getElementById('wholeBar').checked){
        var tmpCnt = objArray[objArray.length-1].sheetCnt;
        var tmpClr = objArray[objArray.length-1].sheetColor;
        unSelectAllObj();
        initObj("rec",objArray[objArray.length-1].startingPointX,objArray[objArray.length-1].startingPointY+15+objArray[objArray.length-1].height,objArray[objArray.length-1].length,objArray[objArray.length-1].height,null,null,barColor);
        objArray[objArray.length-1].b_SelState = true;
        objArray[objArray.length-1].sheetCnt = tmpCnt;
        ///////////////////////////////////changed by rph///////////////////////////////////////
        for(var k = 0; k < tmpClr.length; k ++)
          objArray[objArray.length-1].sheetColor[k] = tmpClr[k];
        ////////////////////////////////////////////////////////////////////////////////////////
        drawAllObj();
    }
    else{
      var numOfParts = document.getElementById("numberOfParts").value;
      if (numOfParts > objArray[objArray.length-1].sheetCnt){
        alert("Number of the parts you are copying is too big!");
        return;
      }
      var d_LengthOfCutBarPart = objArray[objArray.length-1].length/objArray[objArray.length-1].sheetCnt;
      var tempStX = objArray[objArray.length-1].startingPointX;
      var tempStY = objArray[objArray.length-1].startingPointY;
      var tempClr = objArray[objArray.length-1].sheetColor;
      for (var k = 0; k < numOfParts; k++){ 
        // unSelectAllObj();
        initObj("rec",tempStX+k*d_LengthOfCutBarPart,tempStY+15+h,d_LengthOfCutBarPart,h,null,null,barColor);
        objArray[objArray.length-1].sheetColor[0] = tempClr[k];
      }
      drawAllObj();
      // copy(i_DragMoveSt.X,i_DragMoveSt.Y);
    }
      $('.bkgr_fricc_copy').hide();
  });

  
  $(".CloseButtonCopy").click(function(){
    $('.bkgr_fricc_copy').hide();
  });

  function disableTool(){
    i_ToolIdx = 0;
    document.body.style.cursor = "context-menu";
  }

  $("#dottedSquare").click(function(){
    isSelect = true;
    unSelectAllObj();
    clearObj();
    drawAllObj();
    i_ToolIdx = 9;
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
  });

  // when the horizontal arrow button is clicked
  $("#horizontalarrow").click(function(){
    // isHorizontalArrow = true;
    var type = "horizontalArrow";
    if (objArray.length == 0){
      initObj(type,ArrowLineStX+10,ArrowLineStY,ArrowLineLn,20,null,null,barColor);
    }
    else{
      for (var i = objArray.length-1; i >= 0; i--){
        if(objArray[i].type == "horizontalArrow"){
          initObj(type,objArray[i].startingPointX,objArray[i].startingPointY + objArray[i].height,ArrowLineLn,20,null,null,barColor);
          break;
        }
      }
    }
    var k = false;
    for (var i = objArray.length-1; i >= 0; i--){
      if(objArray[i].type == "horizontalArrow"){
        k = true;
      }
    }
    if (k == false){
      initObj(type,ArrowLineStX+10,ArrowLineStY,ArrowLineLn,20,null,null,barColor);
    }


    // initHorizontalArrow();
    //disable other functions
    isDraging = false;
    isCutLineShow = false;
    isResize = false;
    paint = false;
    i_ToolIdx = 1;
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
  });

  // when the upper down arrow button is clicked
  $("#upperdownarrow").click(function(){
    // isUpperDownArrow = true;
    var type = "upperdownArrow";
    if (objArray.length == 0){
      initObj(type,ArrowLineStX,ArrowLineStY+30,ArrowLineLn,20,null,null,barColor);
    }
    else{
      for (var i = objArray.length-1; i >= 0; i--){
        if(objArray[i].type == "upperdownArrow"){
          initObj(type,objArray[i].startingPointX+objArray[i].height,objArray[i].startingPointY,ArrowLineLn,20,null,null,barColor);
          break;
        }
      }
    }
    var k = false;
    for (var i = objArray.length-1; i >= 0; i--){
      if(objArray[i].type == "upperdownArrow"){
        k = true;
      }
    }
    if (k == false){
      initObj(type,ArrowLineStX,ArrowLineStY+30,ArrowLineLn,20,null,null,barColor);
    }
    // initUpperDownArrrow();
    //disable other functions
    isDraging = false;
    isCutLineShow = false;
    isResize = false;
    paint = false;
    i_ToolIdx = 1;
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
  });

  $("#dottedupperdownarrow").click(function(){
    var type = "dottedupperdownArrow";
    if (objArray.length == 0){
      initObj(type,ArrowLineStX+50,ArrowLineStY,ArrowLineLn,20,null,null,curColor);
    }
    else{
      for (var i = objArray.length-1; i >= 0; i--){
        if(objArray[i].type == "dottedupperdownArrow"){
          initObj(type,objArray[i].startingPointX+50+objArray[i].height,objArray[i].startingPointY,ArrowLineLn,20,null,null,curColor);
          break;
        }
      }
    }
    var k = false;
    for (var i = objArray.length-1; i >= 0; i--){
      if(objArray[i].type == "dottedupperdownArrow"){
        k = true;
      }
    }
    if (k == false){
      initObj(type,ArrowLineStX+50,ArrowLineStY,ArrowLineLn,20,null,null,curColor);
    }
    // initUpperDownArrrow();
    //disable other functions
    isDraging = false;
    isCutLineShow = false;
    isResize = false;
    paint = false;
    i_ToolIdx = 1;
    disableTool();
    b_saw = true;
    b_scissors = true;
    b_pencil = true;
    b_paint = true;
    b_eraser = true;
  });

  //when the question mark is clicked
  $("#questionmark").click(function () {
    // im_MathSymbol = 1;
    var type = "question";
    initObj(type,markCnPtX,markCnPtY,markLn);
  });

  // when the fraction button is clicked
  $("#fraction").click(function (){
    // var type = "fraction";
    // initObj(type,markCnPtX,markCnPtY,markLn);
    nominator = document.createElement("INPUT");// create nomin input
    // nominator.style.position = "absolute";
    nominator.id = "nominator";
    nominator.style.width = "40px";
    nominator.style.height = "30px";
    nominator.style.marginTop = "10px";
    nominator.style.textAlign = "center";
    nominator.type = "number";
    document.getElementById("fract").appendChild(nominator);
    hr = document.createElement("hr");
    hr.id = "hr";
    hr.style.width = "80px";
    hr.size = "8";
    hr.style.backgroundColor = "black";
    hr.style.marginLeft = "-20px";
    document.getElementById("fract").appendChild(hr);
    denominator = document.createElement("INPUT"); // create denomin input
    denominator.id = "denominator";
    denominator.style.width = "40px";
    denominator.style.height = "30px";
    denominator.style.textAlign = "center";
    denominator.type = "number";
    document.getElementById("fract").appendChild(denominator);

  });

  //line size functions
  $("#smallline").click(function(){
    curSize = "10";
  });
  $("#mediumline").click(function(){
    curSize = "20";
  });
  $("#bigline").click(function(){
    curSize = "30";
  });

//unSelect All Object
function unSelectAllObj()
{
  for(var i = 0; i < objArray.length; i++) {
    objArray[i].b_SelState = false;
  }
}
//init Object function
function initObj(type,startingPX,startingPY,l,h,str,txt_style,clr,nomin,denomin,img){
  // here obj means bar
  unSelectAllObj();
  var obj = {
    type: type,
    b_SelState: false,
    startingPointX: startingPX,
    startingPointY: startingPY,
    length: l,
    height: h,
    arrowStartingPointX:1100,
    arrowStartingPointY:585,
    sheetCnt: 1,
    sheetColor: ["white"],
    text: str,
    txt_style: txt_style,
    Color:clr,
    nomin:nomin,
    denomin:denomin,
    img:img
  };
  objArray.push(obj);
  drawAllObj();
}

//make mark obj function
// function makeMarkObj(type,stX,stY) {
//   // body...
// }
function makeClone(type, stX, stY, len,clr)
{
    unSelectAllObj();
    var obj = {
      type: type,
      b_SelState: true,
      startingPointX: stX,
      startingPointY: stY,
      length: len,
      height: h,
      arrowStartingPointX:1100,
      arrowStartingPointY:585,
      sheetCnt: 1,
      sheetColor: [clr]       
    };
  objArray.push(obj);
  drawAllObj();
}

  //draw all objects in the canvas
  function drawAllObj(){
 //   ctx.strokeStyle = barColor;      // here set the color of the bar
    clearObj();       //this is function of all object.
    redraw();
         //this is pencil draw 
    // drawSelArea();
    ctx.setLineDash([1,0]);
    ctx.lineCap = "round";
    for (var i = 0; i < objArray.length; i++){
      // bar
      if (objArray[i].type == "rec"){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = barColor;
        ctx.lineWidth = barlineSize;  // here set the line width of the bar 
        ctx.rect(objArray[i].startingPointX, objArray[i].startingPointY, objArray[i].length, objArray[i].height);
        ctx.stroke();
        ctx.closePath();
//        canvas_arrow(ctx, objArray[i].startingPointX+objArray[i].length, objArray[i].startingPointY+objArray[i].height/2, objArray[i].startingPointX+objArray[i].length, objArray[i].startingPointY+objArray[i].height/2, 20);
        //cut line
        for (var j = 1; j < objArray[i].sheetCnt; j++)
        {
          ctx.beginPath();
          ctx.moveTo(objArray[i].startingPointX+objArray[i].length*j/objArray[i].sheetCnt, objArray[i].startingPointY);
          ctx.lineTo(objArray[i].startingPointX+objArray[i].length*j/objArray[i].sheetCnt, objArray[i].startingPointY + objArray[i].height);
          ctx.stroke();
        }
        //paints the sheets
        // if(isPaint){
        for (var k = 0; k < objArray[i].sheetColor.length; k++)
        {
          ctx.fillStyle = objArray[i].sheetColor[k];
          ctx.beginPath();
          ctx.fillRect(objArray[i].startingPointX+k*objArray[i].length/objArray[i].sheetColor.length+barlineSize/2,objArray[i].startingPointY+barlineSize/2, objArray[i].length/objArray[i].sheetColor.length-barlineSize,objArray[i].height-barlineSize);
          ctx.stroke();        
        }
        // }
        //arrow 
  //      ctx.beginPath();
  //      ctx.fillStyle = barColor; 
  //      ctx.arc(objArray[i].arrowStartingPointX, objArray[i].arrowStartingPointY, 25, 0, 2 * Math.PI);
  //      ctx.stroke();

        //if object is selected
        if (objArray[i].b_SelState == true)        //selected object highlight part.
        {
          ctx.strokeStyle = clr_SelOutLineColor;   // selected outline color
          ctx.lineWidth = i_SelOutLineWidth;  // selected outline width 
          // ctx.arc(objArray[i].arrowStartingPointX, objArray[i].arrowStartingPointY, 25, 0, 2 * Math.PI);
          ctx.beginPath();
          canvas_arrow(ctx, objArray[i].startingPointX+objArray[i].length+i_SelOutLineWidth, objArray[i].startingPointY+objArray[i].height/2, objArray[i].startingPointX+objArray[i].length+i_SelOutLineWidth, objArray[i].startingPointY+objArray[i].height/2, 10);
          // ctx.arc(objArray[i].arrowStartingPointX, objArray[i].arrowStartingPointY, 25, 0, 2 * Math.PI);
          ctx.strokeStyle = clr_SelOutLineColor; 
          ctx.rect(objArray[i].startingPointX-i_SelOutLineWidth, objArray[i].startingPointY-i_SelOutLineWidth, objArray[i].length+2*i_SelOutLineWidth, objArray[i].height+2*i_SelOutLineWidth);
          ctx.stroke();
          ctx.closePath();
        }
        ctx.restore();
      }
      else if (objArray[i].type == "horizontalArrow"){
        drawHorizontalArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"false",objArray[i].Color);
        if (objArray[i].b_SelState == true)        //selected object highlight part.
        {
          ctx.strokeStyle = clr_SelOutLineColor;   // selected outline color
          //ctx.lineWidth = i_SelOutLineWidth;  // selected outline width 
          // ctx.arc(objArray[i].arrowStartingPointX, objArray[i].arrowStartingPointY, 25, 0, 2 * Math.PI);
          ctx.beginPath();
          drawHorizontalArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"true");
          ctx.stroke();
          ctx.closePath();
        }
      }
      else if (objArray[i].type == "upperdownArrow"){
        drawUpperdownArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"false",objArray[i].Color);
        if (objArray[i].b_SelState == true)        //selected object highlight part.
        {
          ctx.strokeStyle = clr_SelOutLineColor;   // selected outline color
          //ctx.lineWidth = i_SelOutLineWidth;  // selected outline width 
          // ctx.arc(objArray[i].arrowStartingPointX, objArray[i].arrowStartingPointY, 25, 0, 2 * Math.PI);
          ctx.beginPath();
          drawUpperdownArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"true");
          ctx.stroke();
          ctx.closePath();
        }
      }
      else if (objArray[i].type == "dottedupperdownArrow"){
        drawDottedUpperdownArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"false",objArray[i].Color);
        if (objArray[i].b_SelState == true)        //selected object highlight part.
        {
          ctx.beginPath();
          drawDottedUpperdownArrow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,"true",clr_SelOutLineColor);
          ctx.stroke();
          ctx.closePath();
        }
      }
      else if (objArray[i].type == "question"){
       questionMark(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length);
      }

      else if (objArray[i].type == "text"){
        textShow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,objArray[i].text,objArray[i].txt_style,objArray[i].Color);
        if (objArray[i].b_SelState == true){
          textShow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,objArray[i].text,objArray[i].txt_style,clr_SelOutLineColor);
        }
      } 
      
      // else if (objArray[i].type == "fraction"){
      //   fraction(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length);
      // }
      else if(objArray[i].type == "fraction"){
        fractionShow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,objArray[i].height,objArray[i].nomin,objArray[i].denomin,"black");
        if (objArray[i].b_SelState == true){
          fractionShow(objArray[i].startingPointX,objArray[i].startingPointY,objArray[i].length,objArray[i].height,objArray[i].nomin,objArray[i].denomin,clr_SelOutLineColor);
        }
      }
      else if(objArray[i].type == "sticker"){
        ctx.drawImage(objArray[i].img, objArray[i].startingPointX, objArray[i].startingPointY, objArray[i].length, objArray[i].height);
        if (objArray[i].b_SelState == true) {
          ctx.strokeStyle = clr_SelOutLineColor;
          ctx.lineWidth = i_SelOutLineWidth/2;
          ctx.beginPath();
          ctx.rect(objArray[i].startingPointX, objArray[i].startingPointY, objArray[i].length, objArray[i].height);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    
    if (isCutLineShow){       // it draws a line when we cut the bar
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = i_SelOutLineWidth;
      ctx.moveTo(cutClickX[0], cutClickY[0]);
      ctx.lineTo(cutClickX[0], cutClickY[cutClickY.length-1]);
      ctx.stroke();
    }
    if (isScissorsLineShow){       // it draws a line when we scissor the bar
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = i_SelOutLineWidth;
      ctx.moveTo(scissorClickX[0]+15, scissorClickY[0]);
      ctx.lineTo(scissorClickX[0]+15, scissorClickY[scissorClickY.length-1]);
      ctx.stroke();
    }
  }


  //drag object function 
  // function dragObj(positionX, positionY)
  // {
  //   if (objArray.length == 0)
  //     return;
  //   objArray[whichObjIsDrag].startingPointX = positionX-objArray[whichObjIsDrag].length/2;
  //   objArray[whichObjIsDrag].startingPointY = positionY-objArray[whichObjIsDrag].height/2;
  //   objArray[whichObjIsDrag].arrowStartingPointX = objArray[whichObjIsDrag].startingPointX + objArray[whichObjIsDrag].length;
  //   objArray[whichObjIsDrag].arrowStartingPointY = objArray[whichObjIsDrag].startingPointY + objArray[whichObjIsDrag].height/2;
  //   drawAllObj();
  // }
  function dragObj(dragStX, dragStY, dragEdX, dragEdY)
  {
    if (objArray.length == 0)
      return;
    var numOfSelected = 0;
    for(k = 0; k < objArray.length ; k ++){
      if(objArray[k].b_SelState == true)
        numOfSelected++;
    }
    var offsetX = dragEdX - dragStX;
    var offsetY = dragEdY - dragStY;
    for(i = 0; i < objArray.length ; i ++)
    {
      if(objArray[i].b_SelState == true)
      {
        objArray[i].startingPointX += offsetX;
        objArray[i].startingPointY += offsetY;
        objArray[i].arrowStartingPointX += offsetX;
        objArray[i].arrowStartingPointY += offsetY;
        if(numOfSelected == 1){
          for (var j = 0; j < objArray.length ; j ++){
            if (objArray[j].type == "rec" && Math.abs(objArray[i].startingPointX-objArray[j].startingPointX) <= 20 && (objArray[i].type != "sticker") && (objArray[i].type != "text") && (objArray[i].type != "upperdownArrow") && (objArray[i].type != "dottedupperdownArrow") && (objArray[i].type != "fraction")){ //this is for aligning the bar
              objArray[i].startingPointX = objArray[j].startingPointX;
            }
            // else if(objArray[j].type == "rec" && Math.abs(objArray[i].startingPointX-objArray[j].length-objArray[j].startingPointX) <= 20 && (objArray[i].type != "sticker") && (objArray[i].type != "text") && (objArray[i].type != "upperdownArrow") && (objArray[i].type != "dottedupperdownArrow") && (objArray[i].type != "fraction")){
            //   objArray[i].startingPointX = (objArray[j].startingPointX+objArray[j].length);
            // }
            
          }
        }
        
      }
    }
    // var numOfSelected = 0;
    // for(k = 0; k < objArray.length ; k ++){
    //   if(objArray[k].b_SelState == true)
    //     numOfSelected++;
    // }
    // if (numOfSelected == 1 && objArray[whichObjIsDrag].b_SelState == true){
    //   for (var j = 0; j < objArray.length ; j ++){
    //     if (objArray[j].type == "rec" && Math.abs(objArray[i].startingPointX-objArray[j].startingPointX) <= 20){ //this is for aligning the bar
    //       objArray[i].startingPointX = objArray[j].startingPointX;
    //     }
    //   }
    // }
    drawAllObj();
  }

  // function dragAlignObj(dragStX, dragStY, dragEdX, dragEdY){
  //   if (objArray.length == 0)
  //     return;
  //   var offsetX = dragEdX - dragStX;
  //   var offsetY = dragEdY - dragStY;
  //   objArray[whichObjIsDrag].startingPointX += offsetX;
  //   objArray[i].startingPointY += offsetY;

  // }
  //get the 

  //drag marks function
  function dragMark(positionX, positionY){
    objArray[whichObjIsDrag].startingPointX = positionX - i_MarkDragStOffset.X;
    objArray[whichObjIsDrag].startingPointY = positionY - i_MarkDragStOffset.Y;
    drawAllObj();
  }

  function dragHorizontalArrow(dragStX, dragStY, dragEdX, dragEdY){
    if (objArray.length == 0)
      return;
    var offsetX = dragEdX - dragStX;
    var offsetY = dragEdY - dragStY;

    for(i = 0; i < objArray.length ; i ++)
    {
      if(objArray[i].b_SelState == true)
      {
        objArray[i].startingPointX += offsetX;
        objArray[i].startingPointY += offsetY;
        objArray[i].arrowStartingPointX += offsetX;
        objArray[i].arrowStartingPointY += offsetY;
      }
    }
    drawAllObj();
  }

  function dragUpperDownArrow(positionX, positionY){
    objArray[whichObjIsDrag].startingPointX = positionX - i_MarkDragStOffset.X;
    objArray[whichObjIsDrag].startingPointY = positionY - i_MarkDragStOffset.Y;
    drawAllObj();
  }

  function dragDottedUpperDownArrow(positionX, positionY){
    objArray[whichObjIsDrag].startingPointX = positionX - i_MarkDragStOffset.X;
    objArray[whichObjIsDrag].startingPointY = positionY - i_MarkDragStOffset.Y;
    drawAllObj();
  }

  //drag Text
  function dragText(positionX,positionY){
    objArray[whichObjIsDrag].startingPointX = positionX - i_MarkDragStOffset.X;
    objArray[whichObjIsDrag].startingPointY = positionY - i_MarkDragStOffset.Y;
    drawAllObj();
  }

  //resize object function
  function resizeObj(positionX, positionY){
    if (objArray.length == 0)
      return;
    objArray[whichObjIsDrag].length = positionX - objArray[whichObjIsDrag].startingPointX;
    objArray[whichObjIsDrag].arrowStartingPointX = positionX;
    if(objArray[whichObjIsDrag].length < 20)
    {
       objArray[whichObjIsDrag].length = 50;
       objArray[whichObjIsDrag].arrowStartingPointX = 50+objArray[whichObjIsDrag].startingPointX;
    }
    clearObj();
    drawAllObj();
  }
  //resize the sticker
  function resizeSticker(positionX,positionY){
    objArray[whichObjIsDrag].length = positionX - objArray[whichObjIsDrag].startingPointX;
    objArray[whichObjIsDrag].height = Math.abs(positionY - objArray[whichObjIsDrag].startingPointY);
    if(objArray[whichObjIsDrag].length < 20)
    {
       objArray[whichObjIsDrag].length = 50;
       objArray[whichObjIsDrag].arrowStartingPointX = 50+objArray[whichObjIsDrag].startingPointX;
    }
    if(objArray[whichObjIsDrag].height < 20)
    {
       objArray[whichObjIsDrag].height = 50;
       objArray[whichObjIsDrag].arrowStartingPointY = 50+objArray[whichObjIsDrag].startingPointY;
    }
    clearObj();
    drawAllObj();
  }

  // clear function
  function clearObj(){
    ctx.clearRect(0, 0, 3000, 3000);
    ctx.beginPath();          //clear Stroke
  }

  //draw arrow function to extend bar length
  function drawArrow(){
    ctx.moveTo(150, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }
  c.addEventListener('touchstart',function(e){
    e.preventDefault(); e.stopPropagation();
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    var rect = c.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top; 
    DownClick(x,y);
  },false);

  //when the mouse is clicked and moved and released
  c.onmousedown = function(e) {
    var x = e.x;
    var y = e.y;
    var rect = c.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;   // these are correct coordinate
    DownClick(x,y);
  };
  function DownClick(x,y){
    for (var j = objArray.length-1; j >= 0; j--){
      if (document.body.style.cursor != 'nw-resize' && objArray[j].type == "rec" && objArray[j].startingPointX < x &&  x < (objArray[j].startingPointX + objArray[j].length-10) && (objArray[j].startingPointY) < y && y < (objArray[j].startingPointY+objArray[j].height) || (objArray[j].type == "horizontalArrow" && objArray[j].startingPointX+20 < x &&  x < (objArray[j].startingPointX + objArray[j].length-25) && (objArray[j].startingPointY-objArray[j].height/2) < y && y < (objArray[j].startingPointY+objArray[j].height/2)) || (objArray[j].type == "upperdownArrow" && objArray[j].startingPointY+20 < y &&  y < (objArray[j].startingPointY + objArray[j].length-20) && (objArray[j].startingPointX-objArray[j].height/2) < x && x < (objArray[j].startingPointX+objArray[j].height/2)) || (objArray[j].type == "dottedupperdownArrow" && objArray[j].startingPointY+20 < y &&  y < (objArray[j].startingPointY + objArray[j].length-20) && (objArray[j].startingPointX-objArray[j].height/2) < x && x < (objArray[j].startingPointX+objArray[j].height/2)) || (objArray[j].type == "text" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX + objArray[j].length * objArray[j].text.length/2) >= x) &&  ((objArray[j].startingPointY-objArray[j].length) <= y) && (objArray[j].startingPointY >= y)) || (objArray[j].type == "fraction" && (objArray[j].startingPointX-objArray[j].length/2 <= x) && ((objArray[j].startingPointX+objArray[j].length/2*(len = (objArray[j].nomin.length>objArray[j].denomin.length) ? objArray[j].nomin.length+1 : objArray[j].denomin.length+1)) >= x) && ((objArray[j].startingPointY-objArray[j].length)<=y)&&((objArray[j].startingPointY+2*objArray[j].length)>=y)) || (objArray[j].type == "sticker" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX+objArray[j].length >= x) && (objArray[j].startingPointY <= y)&&((objArray[j].startingPointY+objArray[j].height)>=y)))) {
        if(objArray[j].b_SelState == true)
        {
          isDraging = true;
        }
        isSelect = false;
      }
    }

    if(isDraging == false && document.body.style.cursor != 'nw-resize'){
      for (var j = objArray.length-1; j >= 0; j--){
        objArray[j].b_SelState = false;
      }
    }

    if(isSelect)
    {
      isSelectDrag = true;
      i_SelectAreaStX = x;
      i_SelectAreaStY = y;
    }

    for (var j = 0; j < objArray.length; j++)  // seach all the bar objects
        {
        
          if (objArray[j].type != "horizontalArrow" && objArray[j].type != "fraction" && (objArray[j].startingPointX+objArray[j].length-10) <= x && (objArray[j].startingPointX+objArray[j].length+15) >= x && (objArray[j].startingPointY+objArray[j].height/2-20)<=y && (objArray[j].startingPointY+objArray[j].height/2+20)>=y)
          {
            unSelectAllObj();
            isResize = true;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
          }

          else if((objArray[j].type == "rec") && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX+objArray[j].length) >= x) && (objArray[j].startingPointY <= y) && ((objArray[j].startingPointY+objArray[j].height) >= y) && i_ToolIdx == 5)
          {
            isDraging = true;
            i_DragMoveSt.X = x;
            i_DragMoveSt.Y = y;
            whichObjIsDrag = j;
            paintBar(x,y);
            //disable the other functions
            // disableTool();
            if(objArray[j].b_SelState == false)
            {
              unSelectAllObj();
              objArray[j].b_SelState = true;
            }
            // $("#cutBar").src = "./assets/images/saw.png";
          }
          else if(document.body.style.cursor != 'nw-resize' && (objArray[j].type == "rec") && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX+objArray[j].length) >= x) && (objArray[j].startingPointY <= y) && ((objArray[j].startingPointY+objArray[j].height) >= y) || ( objArray[j].type == "horizontalArrow" && objArray[j].startingPointX+20 <= x && (objArray[j].startingPointX + objArray[j].length-25) >= x && ((objArray[j].startingPointY - barlineSize/2) <= y) && (objArray[j].startingPointY + barlineSize/2) >= y) ||(objArray[j].type == "upperdownArrow" && objArray[j].startingPointY+20 <= y && (objArray[j].startingPointY + objArray[j].length-20) >= y && ((objArray[j].startingPointX - barlineSize/2) <= x) && (objArray[j].startingPointX + barlineSize/2) >= x ) ||(objArray[j].type == "dottedupperdownArrow" && objArray[j].startingPointY+20 <= y && (objArray[j].startingPointY + objArray[j].length-20) >= y && ((objArray[j].startingPointX - barlineSize/2) <= x) && (objArray[j].startingPointX + barlineSize/2) >= x )|| (objArray[j].type == "text" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX + objArray[j].length * objArray[j].text.length/2) >= x) &&  ((objArray[j].startingPointY-objArray[j].length) <= y) && (objArray[j].startingPointY >= y)) || (objArray[j].type == "sticker" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX+objArray[j].length >= x) && (objArray[j].startingPointY <= y)&&((objArray[j].startingPointY+objArray[j].height)>=y))) || (objArray[j].type == "fraction" && (objArray[j].startingPointX-objArray[j].length/2 <= x) && ((objArray[j].startingPointX+objArray[j].length/2*(len = (objArray[j].nomin.length>objArray[j].denomin.length) ? objArray[j].nomin.length+1 : objArray[j].denomin.length+1)) >= x) && ((objArray[j].startingPointY-objArray[j].length)<=y)&&((objArray[j].startingPointY+2*objArray[j].length)>=y)))
          {
            isDraging = true;
            i_DragMoveSt.X = x
            i_DragMoveSt.Y = y;
            whichObjIsDrag = j;
            //disable the other functions
            // isCut=false;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
            if(objArray[j].b_SelState == false)
            {
              unSelectAllObj();
              objArray[j].b_SelState = true;
            }
            // $("#cutBar").src = "./assets/images/saw.png";
          }

          //search the arrows for resizing
          else if(objArray[j].type == "horizontalArrow" && (((objArray[j].startingPointX-20+objArray[j].length) <= x) && ((objArray[j].startingPointX+20+objArray[j].length) >= x) && ((objArray[j].startingPointY-25) <= y) && ((objArray[j].startingPointY+25) >= y))){
            unSelectAllObj();
            isHorizontalArrowResize = true;
            isHorizontalArrowResizeL = false;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            // i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "horizontalArrow" && (((objArray[j].startingPointX-20) <= x) && ((objArray[j].startingPointX+20) >= x) && ((objArray[j].startingPointY-25) <= y) && ((objArray[j].startingPointY+25) >= y))){
            unSelectAllObj();
            isHorizontalArrowResizeL = true;
            isHorizontalArrowResize = false;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "upperdownArrow" && (((objArray[j].startingPointY-25+objArray[j].length) <= y) && ((objArray[j].startingPointY+25+objArray[j].length) >= y) && ((objArray[j].startingPointX-25) <= x) && ((objArray[j].startingPointX+25) >= x))){
            unSelectAllObj();
            isUpperDownArrowResize = true;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "upperdownArrow" && (((objArray[j].startingPointY-25) <= y) && ((objArray[j].startingPointY+25) >= y) && ((objArray[j].startingPointX-25) <= x) && ((objArray[j].startingPointX+25) >= x))){
            unSelectAllObj();
            isUpperDownArrowResizeL = true;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "dottedupperdownArrow" && (((objArray[j].startingPointY-25+objArray[j].length) <= y) && ((objArray[j].startingPointY+25+objArray[j].length) >= y) && ((objArray[j].startingPointX-25) <= x) && ((objArray[j].startingPointX+25) >= x))){
            unSelectAllObj();
            isDottedUpperDownArrowResize = true;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "dottedupperdownArrow" && (((objArray[j].startingPointY-25) <= y) && ((objArray[j].startingPointY+25) >= y) && ((objArray[j].startingPointX-25) <= x) && ((objArray[j].startingPointX+25) >= x))){
            unSelectAllObj();
            isDottedUpperDownArrowResizeL = true;
            whichObjIsDrag = j;
            objArray[j].b_SelState = true;
            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "fraction" && (objArray[j].startingPointX-objArray[j].length/2 <= x) && ((objArray[j].startingPointX+objArray[j].length/2*(len = (objArray[j].nomin.length>objArray[j].denomin.length) ? objArray[j].nomin.length+1 : objArray[j].denomin.length+1)) >= x) && ((objArray[j].startingPointY-objArray[j].length)<=y)&&((objArray[j].startingPointY+2*objArray[j].length)>=y)){
            unSelectAllObj();
            objArray[j].b_SelState = true;
            isDraging = true;
            i_DragMoveSt.X = x
            i_DragMoveSt.Y = y;
            whichObjIsDrag = j;

            i_ToolIdx = 0;
            disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if(objArray[j].type == "sticker" && document.body.style.cursor == 'nw-resize'){
            isResizeSticker = true;
            unSelectAllObj();
            objArray[j].b_SelState = true;
            // i_DragMoveSt.X = x
            // i_DragMoveSt.Y = y;
            whichObjIsDrag = j;
            isDraging = false;
            i_ToolIdx = 0;
            // disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
          else if((document.body.style.cursor != 'nw-resize') && objArray[j].type == "sticker" && (objArray[j].startingPointX <= x) && ((objArray[j].startingPointX+objArray[j].length >= x) && (objArray[j].startingPointY <= y)&&((objArray[j].startingPointY+objArray[j].height)>=y))){
            unSelectAllObj();
            objArray[j].b_SelState = true;
            isDraging = true;
            i_DragMoveSt.X = x
            i_DragMoveSt.Y = y;
            whichObjIsDrag = j;
            i_ToolIdx = 0;
            // disableTool();
            b_saw = true;
            b_scissors = true;
            b_pencil = true;
            b_paint = true;
            b_eraser = true;
            isPencil = false;
          }
        }
    // sortObjArray();
    stickersUponRectFun();

    //this is for pencil
    if (i_ToolIdx == 3 || isPencil){
      paint = true;
      addClick(x, y, false);
      //redraw();
    }
    // this is for cutting the bar
    if (i_ToolIdx ==2){
      isCutLineShow = true;
      cutClickX.push(x);
      cutClickY.push(y);
    }
    // this is for scissoring the bar
    if (i_ToolIdx == 8){
      isScissorsLineShow = true;
      scissorClickX.push(x);
      scissorClickY.push(y);
    }
    // this is for the paint the bar
    // if (i_ToolIdx  == 5){
    //   paintBar(x,y);
    // }
    drawAllObj();
  }
 
  c.addEventListener('touchmove', function(e) {
    var xx = e.touches[0].clientX;
    var yy = e.touches[0].clientY;
    var rect = c.getBoundingClientRect();
    xx -= rect.left;
    yy -= rect.top; 
    MoveMouse(xx,yy);
  },false);
  c.onmousemove = function(e) {
    var xx = e.x;
    var yy = e.y;
    var rect = c.getBoundingClientRect();
    xx -= rect.left;
    yy -= rect.top;
    MoveMouse(xx,yy);
    // if(objArray.length == 0)
    //     return;
  };

  function MoveMouse(xx,yy){
    for (var j = 0; j < objArray.length; j++){
      if(objArray[j].type == "sticker" && (objArray[j].startingPointX+objArray[j].length-5 <= xx) && ((objArray[j].startingPointX+objArray[j].length+5 >= xx) && (objArray[j].startingPointY+objArray[j].height-5 <= yy)&&((objArray[j].startingPointY+objArray[j].height+5)>=yy))){
        document.body.style.cursor = 'nw-resize';
      }
      else if(i_ToolIdx == 0){
        document.body.style.cursor = 'context-menu';
      }
    }
    //this is for resize the sticker
    if (isResizeSticker){
      resizeSticker(xx,yy);
    }
    //Select area
    if (isSelectDrag){
      DrawDottedSquare(xx,yy);
    }
    if (isDragAllSelected){
      // xx = xx - i_SelectAreaStX;
      // yy = yy - i_SelectAreaStY;
      dragSelectedObj(xx,yy);
    }
    // here drag the bar
    if (isDraging) {
      dragObj(i_DragMoveSt.X, i_DragMoveSt.Y, xx,yy);   
      i_DragMoveSt.X = xx;
      i_DragMoveSt.Y = yy;  
    }
    // here resize the bar
    if (isResize){
      resizeObj(xx,yy); 
      //disable others
      // isCut = false;
      i_ToolIdx = 0;
    }
    //here is pencil
    if(paint){
      addClick(xx, yy, true);
      // redraw();
      drawAllObj();
    }
    // this is for cutting the bar
    if (i_ToolIdx ==2 && isCutLineShow){
      addCutClick(xx,yy);
    }
    //this is for scissoring the bar
    if (i_ToolIdx == 8 && isScissorsLineShow){
      addScissorsClick(xx,yy);
    }
    // this is for resizing the arrows
    if (isHorizontalArrowResize){
      console.log("right");
      console.log(whichObjIsDrag);
      resizeHorizontalArrow(xx);
    }
    if (isHorizontalArrowResizeL){
      console.log("left");
      console.log(whichObjIsDrag);
      console.log("here");
      resizeHorizontalArrowLeft(xx);
    }
    if (isUpperDownArrowResize){
      resizeUpperDownArrow(yy);
    }
    if (isUpperDownArrowResizeL){
      resizeUpperDownArrowLeft(yy);
    }
    if (isDottedUpperDownArrowResize){
      resizeDottedUpperDownArrow(yy);
    }
    if (isDottedUpperDownArrowResizeL){
      resizeDottedUpperDownArrowLeft(yy);
    }
    //drag the marks
    if (isMarkDraging){
      dragMark(xx,yy);
    }
    //drag the text
    if (isTextDraging){
      dragText(xx,yy);
    }

    if (isHorizaontalArrowDraging){
      dragHorizontalArrow(i_DragMoveSt.X, i_DragMoveSt.Y,xx,yy);
      i_DragMoveSt.X = xx;
      i_DragMoveSt.Y = yy;
    }
    if (isUpperDownArrowDraging){
      dragUpperDownArrow(i_DragMoveSt.X, i_DragMoveSt.Y,xx,yy);
      i_DragMoveSt.X = xx;
      i_DragMoveSt.Y = yy;
    }
    if (isDottedUpperDownArrowDraging){
      dragDottedUpperDownArrow(i_DragMoveSt.X, i_DragMoveSt.Y,xx,yy);
      i_DragMoveSt.X = xx;
      i_DragMoveSt.Y = yy;
    }
  }
  c.addEventListener('touchend', function(e) {
      isDraging = false;
      isResizeSticker = false;
      isAligningDraging = false;
      isResize = false;
      paint = false;
      isMarkDraging = false;
      isTextDraging = false;
      if(isSelectDrag == true)
      {
        var xx = e.changedTouches[0].clientX;
        var yy = e.changedTouches[0].clientY;
        var rect = c.getBoundingClientRect();
        xx -= rect.left;
        yy -= rect.top;
        selectMultiObject(xx, yy);
      }
      isSelectDrag = false;
      // isSelect = false;
      isDragAllSelected = false;
      isHorizaontalArrowDraging = false;
      isUpperDownArrowDraging = false;
      isDottedUpperDownArrowDraging = false;
      isHorizontalArrowResize = false;
      isHorizontalArrowResizeL = false;
      isUpperDownArrowResize = false;
      isUpperDownArrowResizeL = false;
      isDottedUpperDownArrowResize = false;
      isDottedUpperDownArrowResizeL = false;
      if (i_ToolIdx ==2){
        isCutLineShow = false;
        cutBar();
        paint = false;
      }
      if (i_ToolIdx == 8){
        isScissorsLineShow = false;
        scissorsBar();
      }

      clearObj();
      drawAllObj();
  },false);
  c.onmouseup = function(e) {   
      // if the drag object mouse click is released rearrage the object array
      isDraging = false;
      isResizeSticker = false;
      isAligningDraging = false;
      isResize = false;
      paint = false;
      isMarkDraging = false;
      isTextDraging = false;
      if(isSelectDrag == true)
      {
         var xx = e.x;
         var yy = e.y;
         var rect = c.getBoundingClientRect();
         xx -= rect.left;
         yy -= rect.top;        
         selectMultiObject(xx, yy);
      }
      isSelectDrag = false;
      // isSelect = false;
      isDragAllSelected = false;
      isHorizaontalArrowDraging = false;
      isUpperDownArrowDraging = false;
      isDottedUpperDownArrowDraging = false;
      isHorizontalArrowResize = false;
      isHorizontalArrowResizeL = false;
      isUpperDownArrowResize = false;
      isUpperDownArrowResizeL = false;
      isDottedUpperDownArrowResize = false;
      isDottedUpperDownArrowResizeL = false;
      if (i_ToolIdx ==2){
        isCutLineShow = false;
        cutBar();
      }
      if (i_ToolIdx == 8){
        isScissorsLineShow = false;
        scissorsBar();
      }

      clearObj();
      drawAllObj();
  };

  c.onmouseleave = function(e){
    // paint = false;
  };
  // this is the function to reset the sheetCtn in obj bar
  function cutBar(){
    // this is for from bottom to top
    if (cutClickY[0] > cutClickY[cutClickY.length-1]){
      var temp = cutClickY[0];
      cutClickY[0] = cutClickY[cutClickY.length-1];
      cutClickY[cutClickY.length-1] = temp;
    }
    // first find which bar is to cut
    for (var j = 0; j < objArray.length; j++)  
    {
      if ((objArray[j].startingPointX <= cutClickX[0]) && ((objArray[j].startingPointX+objArray[j].length) >= cutClickX[0]) && (objArray[j].startingPointY >= cutClickY[0]) && ((objArray[j].startingPointY+objArray[j].height) <= cutClickY[cutClickY.length-1]) && i_ToolIdx!=3)
      {
        objArray[j].sheetCnt++;
        objArray[j].sheetColor.push("white");
      }
    }
    cutClickX = [];
    cutClickY = [];
    clearObj();
    drawAllObj();
  }

  function dragSelectedObj(x,y){
  for (var j = 0; j < objArray.length; j++){
      if(objArray[j].b_SelState == true){
        //change the staring points of the obj
        objArray[j].startingPointX = objArray[j].startingPointX + 1;
        objArray[j].startingPointY = objArray[j].startingPointY + 2;
      }
  }
    drawAllObj();
  }

  function scissorsBar(){
    //this is for bottom to top
    if (scissorClickY[0] > scissorClickY[scissorClickY.length-1]){
      var temp = scissorClickY[0];
      scissorClickY[0] = scissorClickY[scissorClickY.length-1];
      scissorClickY[scissorClickY.length-1] = temp;
    }
    // console.log("this is fdfsafdsafsfdsfsafsa");
    // console.log(scissorClickY[0]);
    // console.log(scissorClickY[scissorClickY.length-1]);
    var len = objArray.length;
    for (var j = 0; j < len; j++)  
    {
      if (objArray[j].type == "rec" && (objArray[j].startingPointX <= scissorClickX[0]+15) && ((objArray[j].startingPointX+objArray[j].length) >= scissorClickX[0]+15) && (objArray[j].startingPointY >= scissorClickY[0]) && ((objArray[j].startingPointY+objArray[j].height) <= scissorClickY[scissorClickY.length-1]) && i_ToolIdx!=3)
      {
        // detach the bar into two parts so make new obj bar
        var type = "rec";
        initObj(type,objArray[j].startingPointX,objArray[j].startingPointY,scissorClickX[0]+15-objArray[j].startingPointX,objArray[j].height,null,null,objArray[j].Color);
        initObj(type,scissorClickX[0]+15,objArray[j].startingPointY,objArray[j].length-scissorClickX[0]+objArray[j].startingPointX,objArray[j].height,null,null,objArray[j].Color);
        objArray.splice(j,1);
        j--;
        len--;
      }
    }
    scissorClickX = [];
    scissorClickY = [];
    drawAllObj();
  }

  function copy(x,y) {
    var d_LengthOfCutBarPart = objArray[whichObjIsDrag].length/objArray[whichObjIsDrag].sheetCnt;
    var i_WhichPartToCopy = parseInt((x-objArray[whichObjIsDrag].startingPointX)/d_LengthOfCutBarPart, 10) +1;
    // clone the part here
    var i_stOffset = 15;
    if(d_LengthOfCutBarPart == objArray[whichObjIsDrag].length)
      i_WhichPartToCopy = 1;
    var temp_stPX = objArray[whichObjIsDrag].startingPointX + d_LengthOfCutBarPart * (i_WhichPartToCopy-1);
    var temp_stPY = objArray[whichObjIsDrag].startingPointY + objArray[whichObjIsDrag].height + i_stOffset;
    //makeClone("rec",objArray[whichObjIsDrag].startingPointX+ objArray[whichObjIsDrag].length/objArray[whichObjIsDrag].sheetCnt*(i_WhichPartToCopy-1)+i_stOffset,objArray[whichObjIsDrag].startingPointY + i_stOffset,100 , objArray[whichObjIsDrag].length/i_WhichPartToCopy, objArray[whichObjIsDrag].sheetColor[i_WhichPartToCopy-1]);
    makeClone("rec",temp_stPX,temp_stPY,d_LengthOfCutBarPart,objArray[whichObjIsDrag].sheetColor[i_WhichPartToCopy-1]);
    //disable the copy
    i_ToolIdx = 0;

  }

  function sortObjArray(){
  if(whichObjIsDrag>objArray.length)
    return;
  if(objArray[whichObjIsDrag]==null)
    return;
  var tmp = objArray[whichObjIsDrag];
  for(var i = whichObjIsDrag ; i < objArray.length-1 ; i ++)
  {
    objArray[i] = objArray[i+1];
  }
  objArray[objArray.length-1] = tmp;
  whichObjIsDrag = objArray.length-1;
  }

  function stickersUponRectFun(){
    if (objArray.length==0)
      return;
    if(whichObjIsDrag>objArray.length)
      return;
    if(objArray[whichObjIsDrag]==null)
      return;
    var tmp = objArray[whichObjIsDrag];
    for(var i = whichObjIsDrag ; i < objArray.length-1 ; i ++)
    {
      objArray[i] = objArray[i+1];
    }
    objArray[objArray.length-1] = tmp;
    whichObjIsDrag = objArray.length-1;
    var tempObjArray = [];
    var tempBaseObj = objArray[whichObjIsDrag];
    if(objArray[whichObjIsDrag].type == "rec"){
      for(var j = 0;j<objArray.length;j++){
        if(objArray[j].type == "sticker" && objArray[j].startingPointX > tempBaseObj.startingPointX && objArray[j].length < tempBaseObj.length && objArray[j].startingPointY> tempBaseObj.startingPointY && objArray[j].length < tempBaseObj.length){
          tempObjArray.push(objArray[j]);
          objArray.splice(j,1);
          j--;
        }
      }
    }
    for (var k = 0; k < tempObjArray.length; k++){
      objArray.push(tempObjArray[k]);
    }
    // selectMultiObject(objArray[tempBaseObj].startingPointX,);
    // console.log("ddddddddddddddfffffffffffffffffffffffffffffffffffffff");
    // console.log(objArray);
  }

  function paintBar(x,y)
  {
    if (objArray.length == 0)
      return;
    for (var i = 0; i < objArray[whichObjIsDrag].sheetCnt; i++)
    {
      if ((objArray[whichObjIsDrag].startingPointY < y) && ((objArray[whichObjIsDrag].startingPointY+objArray[whichObjIsDrag].height) > y) && (objArray[whichObjIsDrag].startingPointX < x) && ((objArray[whichObjIsDrag].startingPointX+objArray[whichObjIsDrag].length*(i+1)/objArray[whichObjIsDrag].sheetCnt ) > x))
        {
          objArray[whichObjIsDrag].sheetColor[i] = currentColor;
          break;
        }
    }
    // drawAllObj();
  }
  function DrawDottedSquare(xx,yy){
    clearObj();
    drawAllObj();
    
    ctx.strokeStyle = "#22AAAA";
    ctx.setLineDash([5, 7]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(i_SelectAreaStX, i_SelectAreaStY, xx - i_SelectAreaStX, yy - i_SelectAreaStY);
    ctx.stroke();
    ctx.closePath();
  }
  //select ranged object
  function selectMultiObject(xx, yy)
  {
    unSelectAllObj();
    var stX, stY, edX, edY;
    stX = i_SelectAreaStX < xx ? i_SelectAreaStX : xx;
    stY = i_SelectAreaStY < yy ? i_SelectAreaStY : yy;
    edX = i_SelectAreaStX > xx ? i_SelectAreaStX : xx;
    edY = i_SelectAreaStY > yy ? i_SelectAreaStY : yy;
    for (var i = 0; i < objArray.length ; i ++)
    {
      if(objArray[i].type != "upperdownArrow" && objArray[i].type != "dottedupperdownArrow" && objArray[i].startingPointX >= stX &&
        objArray[i].startingPointY >= stY &&
        objArray[i].startingPointX+objArray[i].length <= edX &&
        objArray[i].startingPointY+objArray[i].height <= edY)
      {
        objArray[i].b_SelState = true;
      }
      else if (objArray[i].type == "upperdownArrow" && objArray[i].startingPointX >= stX &&
      objArray[i].startingPointY >= stY &&
      objArray[i].startingPointX+objArray[i].height <= edX &&
      objArray[i].startingPointY+objArray[i].length <= edY){
         objArray[i].b_SelState = true;
      }
      else if (objArray[i].type == "dottedupperdownArrow" && objArray[i].startingPointX >= stX &&
      objArray[i].startingPointY >= stY &&
      objArray[i].startingPointX+objArray[i].height <= edX &&
      objArray[i].startingPointY+objArray[i].length <= edY){
         objArray[i].b_SelState = true;
      }
    } 
  }
  // function drawSelArea(){
  //   ctx.beginPath();
  //   ctx.setLineDash([5]);
  //   ctx.rect(i_SelectAreaStX,i_SelectAreaStY,selectClickX[selectClickX.length-1],selectClickY[selectClickY.length-1]);
  //   ctx.stroke();
  // }
  function addCutClick(x,y){
    cutClickX.push(x);
    cutClickY.push(y);
    clearObj();
    // if (isCutLineShow){
    //   ctx.beginPath();
    //   var yyy = y
    //   ctx.moveTo(cutClickX[0], y);
    //   ctx.lineTo(cutClickX[0], y+1);
    //   ctx.stroke();
    // }
    drawAllObj();
  }

  function addScissorsClick(x,y){
    scissorClickX.push(x);
    scissorClickY.push(y);
    drawAllObj();
  }

  //resize Horizontal and UpperDown Arrows
  function resizeHorizontalArrow(x){
    objArray[whichObjIsDrag].length = x - objArray[whichObjIsDrag].startingPointX;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    for (var j = 0; j < objArray.length ; j ++){
      
      if(objArray[j].type == "rec" && Math.abs(objArray[whichObjIsDrag].startingPointX+objArray[whichObjIsDrag].length-objArray[j].length-objArray[j].startingPointX) <= 20 && (objArray[whichObjIsDrag].type != "sticker") && (objArray[whichObjIsDrag].type != "text") && (objArray[whichObjIsDrag].type != "upperdownArrow") && (objArray[whichObjIsDrag].type != "dottedupperdownArrow") && (objArray[whichObjIsDrag].type != "fraction")){
        objArray[whichObjIsDrag].length =   objArray[j].startingPointX+objArray[j].length -  objArray[whichObjIsDrag].startingPointX;
      }  
    }
    clearObj();
    drawAllObj();
  }
  function resizeHorizontalArrowLeft(x){
    var temp = objArray[whichObjIsDrag].startingPointX;
    objArray[whichObjIsDrag].startingPointX = x;
    objArray[whichObjIsDrag].length = objArray[whichObjIsDrag].length+temp-x;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    clearObj();
    drawAllObj();
  }

  function resizeUpperDownArrow(y){
    objArray[whichObjIsDrag].length = y - objArray[whichObjIsDrag].startingPointY;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    clearObj();
    drawAllObj();
  }

  function resizeUpperDownArrowLeft(y){
    var temp = objArray[whichObjIsDrag].startingPointY;
    objArray[whichObjIsDrag].startingPointY = y;
    objArray[whichObjIsDrag].length = objArray[whichObjIsDrag].length+temp-y;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    clearObj();
    drawAllObj();
  }

  function resizeDottedUpperDownArrow(y){
    objArray[whichObjIsDrag].length = y - objArray[whichObjIsDrag].startingPointY;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    clearObj();
    drawAllObj();
  }

  function resizeDottedUpperDownArrowLeft(y){
    var temp = objArray[whichObjIsDrag].startingPointY;
    objArray[whichObjIsDrag].startingPointY = y;
    objArray[whichObjIsDrag].length = objArray[whichObjIsDrag].length+temp-y;
    if(objArray[whichObjIsDrag].length < 30){
      objArray[whichObjIsDrag].length = 40;
    }
    clearObj();
    drawAllObj();
  }

  // pencil 

  function redraw(){
    // context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    
    // ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = "round";
    // ctx.lineWidth = curSize;
    // ctx.strokeStyle = currentColor; 
    for(var i=0; i < clickX.length; i++) {		
      ctx.beginPath();
      if(clickDrag[i] && i){
        ctx.moveTo(clickX[i-1], clickY[i-1]);
        }
      else{
        ctx.moveTo(clickX[i]-1, clickY[i]);
      }
        
      ctx.strokeStyle = clickColor[i];
      ctx.lineWidth = clickSize[i];     // this is the size of the pencil line
      ctx.lineTo(clickX[i], clickY[i]);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.lineTo(clickX[clickX.length-1], clickY[clickY.length-1]);
    ctx.stroke();
  }

  function addClick(x, y, dragging)
  {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    if(curTool == "eraser"){
      // ctx.lineWidth = 50;
      clickColor.push("white");
    }else{
      clickColor.push(curColor);
    }
    clickSize.push(curSize);         // this is the size of the pencil line
  }

  function canvas_arrow(context, fromx, fromy, tox, toy, r){
    var x_center = tox;
    var y_center = toy;
    
    var angle;
    var x;
    var y;
    context.fillStyle = barColor;
    context.strokeStyle = barColor;
    
    context.beginPath();
    
    angle = Math.atan2(toy-fromy,tox-fromx)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;
  
    context.moveTo(x, y);
    
    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;
    
    context.lineTo(x, y);
    
    angle += (1/3)*(2*Math.PI)
    x = r*Math.cos(angle) + x_center;
    y = r*Math.sin(angle) + y_center;
    
    context.lineTo(x, y);
    
    context.closePath();
    
    context.fill();
  }
  // drawHorizontalArrow(30,150,700);
  function drawHorizontalArrow(x,y,length,selected,clr){
    if (selected == "true")
      ctx.strokeStyle = clr_SelOutLineColor;
    else
      ctx.strokeStyle = clr;
    ctx.lineWidth = barlineSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x+length, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y-20);
    ctx.lineTo(x,y+20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x+length,y-20);
    ctx.lineTo(x+length,y+20);
    ctx.stroke();

  }
 
  function drawUpperdownArrow(x,y,length,selected,clr){
    if (selected == "true")
      ctx.strokeStyle = clr_SelOutLineColor;
    else
      ctx.strokeStyle = clr;
    ctx.lineWidth = barlineSize;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+length);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x-20,y);
    ctx.lineTo(x+20,y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x-20,y+length);
    ctx.lineTo(x+20,y+length);
    ctx.stroke();

  }
  function drawDottedUpperdownArrow(x,y,length,selected,clr){
    // if (selected == "true")
    //   ctx.strokeStyle = clr_SelOutLineColor;
    // else
      ctx.strokeStyle = clr;
    ctx.lineWidth = barlineSize;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+length);
    ctx.stroke();
    ctx.setLineDash([]);
    // ctx.beginPath();
    // ctx.moveTo(x-20,y);
    // ctx.lineTo(x+20,y);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(x-20,y+length);
    // ctx.lineTo(x+20,y+length);
    // ctx.stroke();

  }

  function questionMark(x,y,l){
    ctx.strokeStyle = barColor;
    ctx.lineWidth = barlineSize;
    ctx.beginPath();    
    ctx.font = l+"px Arial";
    ctx.fillText("?", x, y);
    ctx.stroke();
  }

  function fractionShow(x,y,len,height,nomin,denomin,clr){

    var lineLength;
    var offset = 0;
    if(nomin.length>= denomin.length)
      lineLength = nomin.length;
    else 
      lineLength = denomin.length;
    if(denomin.length > nomin.length){
      offset = len/2 * (denomin.length - nomin.length)/2;
    }
    ctx.fillStyle = clr;
    ctx.lineWidth = 5;
    ctx.beginPath();   
    ctx.font = len+"px Times New Roman";
    ctx.fillText(nomin, x+offset, y);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();// this is the line between the nomin and denomin
    ctx.strokeStyle = clr;
    ctx.moveTo(x-len/2, y+len/2);
    ctx.lineTo(x+len/2*lineLength+len/2, y+len/2);
    ctx.stroke();
    ctx.beginPath();   
    ctx.font = len+"px Times New Roman";
    ctx.fillText(denomin, x,y+len+len/2 );
    ctx.stroke();
    ctx.closePath();
  }

  function textShow(x,y,l,str,style,clr){
    // ctx.save();
    ctx.fillStyle = clr;      // here we can change the color of the text 
    ctx.lineWidth = barlineSize;
    ctx.beginPath();   
    ctx.font = l+"px " + style;
    ctx.fillText(str, x, y);
    ctx.stroke();
    ctx.closePath();
    // ctx.restore();
  }


  function downloadCanvas(canvas){      
      // get canvas data 
     var image = canvas.toDataURL();       
     // create temporary link      
     var tmpLink = document.createElement( 'a' );      
     tmpLink.download = 'image.png'; // set the name of the download file     
     tmpLink.href = image;        
     // temporarily add link to body and initiate the download      
     document.body.appendChild( tmpLink );      
     tmpLink.click();      
    //  document.body.removeChild( tmpLink );  
 }
 function downloadCan(){
  var image = c.toDataURL();       
  // create temporary link      
  var tmpLink = document.createElement( 'a' );      
  tmpLink.download = 'image.png'; // set the name of the download file     
  tmpLink.href = image;        
  // temporarily add link to body and initiate the download      
  document.body.appendChild( tmpLink );      
  tmpLink.click();   
 }

});
