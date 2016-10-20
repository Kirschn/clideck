var blessed = require("blessed");
var screen = blessed.screen({
	smartCSR: true,
	autoPadding: false,
	warnings: true,
	dockBorders: true,
	debug: true
});

screen.title = "clideck";

// exit when the user wants to
screen.key(["escape"], function(ch, key) {
 return process.exit(0);
});

var timelines = [],
    scrollLines = 2,
    currentScrollIndex = 0;
function getFullTimelineWidth() {
 var width = 0;
 timelines.forEach(function(current) {
  width += current.width;
 });
 return width;
}
//funtion to create a timeline
function createTimeline(width, name) {
 var timeline = blessed.box({
  parent: screen,
  scrollbar: {
   bg: "white",
   ch: " "
  },
  left: getFullTimelineWidth() + "-1",
  top: 1,
  label: ' ' + name + ' ',
  width: width + "+1",
  height: "100%",
  border: {
    type: 'line',
    left: true,
    top: true,
    right: true,
    bottom: false
  },
  content: "loading"
 });
 timelines.push({ content: "loading... ", "width": width, object: timeline})
}

function generateTweetinTimeline(tlIndex, author_screen, author, text, media, favs, rts, priv) {
 var newString = author_screen + " (" + ((priv) ? "p" : "") + "@" + author + "): " + text + "\n Fav: " + favs + " | RTs: " + rts + "\n ------\n";
 timelines[tlIndex].content = newString + timelines[tlIndex].content;
 timelines[tlIndex].object.content = timelines[tlIndex].content;
 screen.render();
}

createTimeline(200, "lul");
createTimeline(200, "kek");

createTimeline(200, "kek1");

createTimeline(200, "kek2");

createTimeline(200, "kek3");

createTimeline(200, "kek4");

createTimeline(200, "kek5");

createTimeline(200, "kek6");

createTimeline(200, "kek7");

createTimeline(200, "kek8");

screen.render();

setInterval(() => {generateTweetinTimeline(0, "UwU", "uwukek", "i mog sterbn", false, 1, 2, false);}, 1000);

function scrollLeft() {
  if (timelines[timelines.length - 1].object.lpos.xi > 0) {
   timelines.forEach(function (currentTL) {
    currentTL.object.left -= scrollLines;
   });
   currentScrollIndex -= scrollLines;
  }
  screen.render();
  screen.debug("scroll left, index: " + currentScrollIndex + ", last left: " + timelines[timelines.length - 1].object.lpos.xi);
}

function scrollRight() {
  if (currentScrollIndex + scrollLines <= 0) {
   timelines.forEach(function (currentTL) {
    currentTL.object.left += scrollLines;
   });
   currentScrollIndex += scrollLines;
   screen.render();
  }
  screen.debug("scroll right, index: " + currentScrollIndex);
}

screen.key(["r"], () => {scrollLeft()});
screen.key(["l"], () => {scrollRight()});

//setInterval(function() {scrollLeft()}, 1000);

