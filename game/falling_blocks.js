// Copyright Normunds Andersons

var ColorGameBorder = '#b0bdcc';
var ColorGameBorderError = 'red';
var BlockSize = 26;

var Blocks = [];
var Keys = [];
var Timer;
var ErrorTimer;
var Interval = 0;
var Lives = 5;
var Score = 0;


function OnKeyPress(e)
{
  if (Interval == 0)
    return;

  if (Lives <= 0)
    return;

  var keynum = window.event ? e.keyCode : e.which;
  var keychar = String.fromCharCode(keynum);
  e.returnValue = false;

  for (var i in Blocks)
  {
    if (Blocks[i]['keychar'] == keychar)
    {
      Blocks.splice(i, 1);
      
      ++Score;
      
      if (Blocks.length < 2)
      {
        CreateBlock();
      }
      ShowBlocks();
      
      return;
    }
  }

  --Lives;
  
  ShowError();

  ShowBlocks();
}


function Init()
{
  document.onkeypress = function(e) {
    if (!e)
      e = window.event;
    e.returnValue = false;
    OnKeyPress(e);
  }
}

function DoGame()
{
  Interval = 6000;
  Lives = 5;
  Score = 0;

  EnableStartPanel(false);

  Blocks.length = 0;
  clearTimeout(Timer);
  
  Keys = document.getElementById('lesson_select').value.split('');

  NextBlock();
  
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
  
  if (Interval % 50 == 0)
  {
    NextBlock();
  }

  if (Lives > 0)
  {
    Timer = setTimeout("TimerEvent()", 
      Interval > 100 ? Math.ceil(Interval / 100) : 1);
    --Interval;
  }

  ShowBlocks();
}


function NextBlock()
{
  CreateBlock();
  ShowBlocks();
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
      s += '<div class="game_block" style="';
      s += 'position:absolute;';
      s += 'top:' + Blocks[i]['y'] + 'px;';
      s += 'left:' + Blocks[i]['x'] + 'px;';
      s += '">' + Blocks[i]['keychar'] + '</div>';
    }
  }
  

  document.getElementById('game_board').innerHTML = s;
  document.getElementById('game_score').innerHTML = Score;
  document.getElementById('game_lives').innerHTML = Lives;
}

function CreateBlock()
{
  var size = Keys.length;
  var keychar = Keys[Rnd(size)];

  var board = document.getElementById('game_board');
  
  var block = new Array();
  block['keychar'] = keychar;
  block['x'] = Rnd(board.offsetWidth - BlockSize);
  block['y'] = 1 - BlockSize;
  
  Blocks.push(block);
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