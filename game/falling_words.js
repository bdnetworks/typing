// Copyright Normunds Andersons

var ColorGameBorder = '#b0bdcc';
var ColorGameBorderError = 'red';
var BlockSize = 26;

var Words = [];
var Word = '';
var Blocks = [];
var Timer;
var ErrorTimer;
var Interval = 0;
var Lives = 5;
var Score = 0;


function OnKeyPress(e)
{
  if (Interval == 0)
    return true;

  if (Lives <= 0)
    return true;

  var keynum = window.event ? e.keyCode : e.which;
  
  if (keynum == 13) 
  {
    for (var i in Blocks)
    {
      if (Blocks[i]['word'] == Word)
      {
        Blocks.splice(i, 1);
        
        Score += Word.length;
        
        if (Blocks.length < 2)
        {
          CreateBlock();
        }
        ShowBlocks();
        
        Word = '';

        return false;
      }
    }

    Word = '';
    --Lives;
    
    ShowError();
  }
  else if (keynum != 8) {
    Word += String.fromCharCode(keynum);
  }
  
  ShowBlocks();
  
  return false;
}

function OnKeyDown(e)
{
  var keynum = window.event ? e.keyCode : e.which;
  
  if (keynum == 8) // backspace
  {
    e.returnValue = false;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;

    if (Word.length > 0)
    {
      Word = Word.substring(0, Word.length - 1);
    }
    
    return false;
  }
  else
    return true;
}

function Init()
{
  document.onkeypress = function(e) {
    if (!e)
      e = window.event;
    e.returnValue = false;
    OnKeyPress(e);
  }
  document.onkeydown = function(e) {
    if (!e)
      e = window.event;
    OnKeyDown(e);
  }
}

function DoGame(layout_id)
{
  Interval = 6000;
  Lives = 5;
  Score = 0;
  Word = '';

  EnableStartPanel(false);
  
  AjaxRequest(layout_id);

  Blocks.length = 0;
  clearTimeout(Timer);

  TimerEvent();

  ShowBlocks();
}


function TimerEvent()
{
  var board = document.getElementById('game_board');
  
  while (Blocks.length > 0)
  {
    if (board.offsetHeight - BlockSize - 3 < Blocks[0]['y'])
    {
      Blocks.shift();
      --Lives;
      
      ShowError();
    }
    else
      break;
  }
  
  for (var i in Blocks)
  {
    ++Blocks[i]['y'];
  }

  var b = true;
  if (Interval % 50 == 0)
  {
    b = NextBlock();
  }

  if (Lives > 0)
  {
    Timer = setTimeout("TimerEvent()", Interval > 100 ? Math.ceil(Interval / 100) : 1);
    --Interval;
  }

  ShowBlocks();
}


function NextBlock()
{
  if (!CreateBlock())
    return false;
    
  ShowBlocks();
  
  return true;
}


function ShowBlocks()
{
  var s = '';
  
  if (Lives <= 0)
  {
    clearTimeout(Timer);
    EnableStartPanel(true);
    
    s = '<div id="game_caption">' + document.getElementById('game_over').innerHTML + '</div>';
  }
  else
  {
    for (var i in Blocks)
    {
      s += '<div class="game_box" style="';
      s += 'top:' + Blocks[i]['y'] + 'px;';
      s += 'left:' + Blocks[i]['x'] + 'px;';
      s += '">' + Blocks[i]['word']  + '</div>';
    }
    s += '<div id="game_input">' + Word + '&nbsp;</div>';
  }
  

  document.getElementById('game_board').innerHTML = s;
  document.getElementById('game_score').innerHTML = Score;
  document.getElementById('game_lives').innerHTML = Lives;
}

function CreateBlock()
{
  var size = Words.length;
  if (size == 0)
    return false;
  
  var word = Words[Rnd(size)];

  var board = document.getElementById('game_board');
  var width_test = document.getElementById('width_test');
  width_test.innerHTML = word;

  var block = new Array();
  block['word'] = word;

  block['x'] = Rnd(board.offsetWidth - width_test.clientWidth - 4);
  block['y'] = 1 - BlockSize;

  Blocks.push(block);
  
  return true;
}

function ShowError()
{
  document.getElementById('game_board').style.borderColor = ColorGameBorderError;
  clearTimeout(ErrorTimer);
  ErrorTimer = setTimeout("ErrorTimerEvent()", 200);  
}

function ErrorTimerEvent()
{
  document.getElementById('game_board').style.borderColor = ColorGameBorder;
}

function EnableStartPanel(b)
{
  document.getElementById('game_start').disabled = !b;
  document.getElementById('lesson_select').disabled = !b;

  document.getElementById('game_start').blur();
}

function Rnd(max)
{
  return Math.floor(Math.random() * max);
}

function GetXmlHttpObject()
{
  if (window.XMLHttpRequest)
  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    return new XMLHttpRequest();
  }
  if (window.ActiveXObject)
  {
    // code for IE6, IE5
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
  return null;
}

function StateChanged()
{
  if (xmlhttp.readyState == 4)
  {
    Words = eval(xmlhttp.responseText);
  }
}

function AjaxRequest(layout_id)
{
  var level_id = document.getElementById('lesson_select').value;

  xmlhttp = GetXmlHttpObject();
  if (xmlhttp == null)
  {
    alert ("Your browser does not support AJAX!");
    return;
  }

  xmlhttp.onreadystatechange = StateChanged;
  xmlhttp.open('GET', gAjaxUrl + '?level_id=' + level_id + '&layout_id=' + layout_id, false);
  xmlhttp.send();
}