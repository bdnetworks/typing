// Copyright Normunds Andersons

var ColorGameBorder = '#b0bdcc';
var ColorGameBorderError = 'red';

var Blocks = [];
var Keys = [];
var Timer;
var ErrorTimer;
var TimeCreateNext;
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
  Interval = 3000;
  Lives = 5;
  Score = 0;

  EnableStartPanel(false);

  Blocks.length = 0;
  clearTimeout(Timer);
  
  var now = new Date();
  TimeCreateNext = new Date(now.getTime() + Interval);
  
  Keys = document.getElementById('lesson_select').value.split('');

  NextBlock();
  
  TimerEvent();
  
  ShowBlocks();
}


function TimerEvent()
{
  var now = new Date();
    
  while (Blocks.length > 0)
  {
    if (now > Blocks[0]['time'])
    {
      Blocks.shift();
      --Lives;
      
      ShowError();
    }
    else
      break;
  }
  

  if (now > TimeCreateNext)
  {
    NextBlock();
  }

  if (Lives > 0)
  {
    Timer = setTimeout("TimerEvent()", 100);
    --Interval;
  }

  ShowBlocks();
}


function NextBlock()
{
  CreateBlock();
  ShowBlocks();
  
  var now = new Date();
  TimeCreateNext = new Date(now.getTime() + Interval);
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
  var size = 24;
  
  var block = new Array();
  block['keychar'] = keychar;
  block['x'] = Rnd(board.offsetWidth - size);
  block['y'] = Rnd(board.offsetHeight - size);
  var now = new Date();
  block['time'] = new Date(now.getTime() + (Interval * 2));
  
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