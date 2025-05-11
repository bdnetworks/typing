// Copyright Normunds Andersons

var ColorGameBorder = '#b0bdcc';
var ColorGameBorderError = 'red';

var Blocks = [];
var Keys = [];
var Timer;
var ErrorTimer;
var Lives = 0;
var Score = 0;
var BlockQty = 200;
var Position = 0;
var Goal = 0;
var MaxTime = 20;
var Time = MaxTime;


function OnKeyPress(e)
{
  if (Lives <= 0)
    return;

  var keynum = window.event ? e.keyCode : e.which;
  var keychar = String.fromCharCode(keynum);
  e.returnValue = false;
  
  var ways = GetNear(Position);
  for (var i in ways)
  {
    var k = ways[i];
    if (Blocks[k] == keychar)
    {
      Position = k;
      
      if (Position == Goal) 
      {
        if (Time > 0) {
          clearTimeout(Timer);
        }
        
        SetGoal();
        Score += Time;

        Time = MaxTime;
        Timer = setTimeout("TimerEvent()", 1000);
      }

      ShowBlocks();
      
      return;
    }
  }

  --Lives;
  
  ShowError();

  ShowBlocks();
}

function SetGoal()
{
  Goal = Rnd(BlockQty - 1);
  var ways = GetNear(Position);
  if (InArray(Goal, ways)) {
    SetGoal();
  }
}

function GetNear(pos)
{
  var x = 20;
  var y = 10;

  var arr = new Array();

  // top
  if (pos >= x) {
    arr.push(pos - x);
  }
  // bottom
  if (pos < x * (y - 1)) {
    arr.push(pos + x);
  }
  // left
  if (pos % x != 0) {
    arr.push(pos - 1);
  }
  // right
  if ((pos + 1) % x != 0) {
    arr.push(pos + 1);
  }
  
  return arr;
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
  Lives = 5;
  Score = 0;

  EnableStartPanel(false);

  Blocks.length = 0;
  
  Position = Rnd(BlockQty - 1);
  SetGoal();
  
  Keys = document.getElementById('lesson_select').value.split('');
  for (var i = 0; i < BlockQty; ++i)
  {
    CreateBlock();
  }
    
  ShowBlocks();
  Timer = setTimeout("TimerEvent()", 1000);
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
    s = '<div id="game_border">';
    var ways = GetNear(Position);
    
    for (var i in Blocks)
    {
      s += '<div class="game_brick';
      if (i == Position) {
        s += ' game_position';
      }
      else if (i == Goal) {
        s += ' game_goal';
      }
      else if (InArray(i, ways)) {
        s += ' game_way';
      }
      s += '">' + Blocks[i] + '</div>';
    }
    s += '<div class="clr"></div></div>';
  }

  document.getElementById('game_board').innerHTML = s;
  document.getElementById('game_score').innerHTML = Score;
  document.getElementById('game_lives').innerHTML = Lives;
  document.getElementById('game_time').innerHTML = Time;
}

function CreateBlock()
{
  var size = Keys.length;
  var pos = Blocks.length;
  
  var busy = new Array();
  var a1 = GetNear(pos);
  for (var i in a1)
  {
    if (a1[i] < pos)
    {
      var a2 = GetNear(a1[i]);
      for (var k in a2)
      {
        if (a2[k] < pos)
          busy.push(Blocks[a2[k]]);
      }
    }
  }

  var key;
  do
  {
    key = Keys[Rnd(size)];
  } 
  while (InArray(key, busy))

  Blocks.push(key);
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

function TimerEvent()
{
  --Time;
  document.getElementById('game_time').innerHTML = Time;
  if (Time > 0) {
    Timer = setTimeout("TimerEvent()", 1000);
  }
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

function InArray(val, arr)
{
  for (var i in arr)
  {
    if (arr[i] == val)
      return true;
  }
  return false;
}
