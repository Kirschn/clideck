var blessed = require("blessed");
var fs = require("fs");
function init (cfgFile) {
  var screen = blessed.screen({
    smartCSR: true,
    autoPadding: false,
    warnings: true,
    dockBorders: true,
    debug: true
  });
  var config = null;
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
    keys : true,
    mouse: true,
    parent: screen,
    scrollable:true,
    alwaysScroll: true,
    left: getFullTimelineWidth() + "+1",
    top: 1,
    label: ' ' + name + ' ',
    width: width + "+1",
    height: "95%",
    border: {
      type: 'line',
      left: true,
      top: true,
      right: true,
      bottom: true
    },
    content: "loading",
    scrollbar: {
      ch: ' ',
      inverse: true,
      bg: 'yellow'
    }

   });
   return timelines.push({ content: "loading... ", "width": width, object: timeline}) - 1;
  }
  function newTimeline(tlConf, file) {
    config.timelines.push(tlConf);
    if (file == undefined) {
      file = "config.json";
    }
    fs.writeFileSync(file, "utf8");
    screen.destroy();
    init();
  }

  function generateTweetinTimeline(tlIndex, author_screen, author, text, media, favs, rts, priv) {
   var newString = author_screen + " (" + ((priv) ? "p" : "") + "@" + author + "): " + text + "\n Fav: " + favs + " | RTs: " + rts + "\n";
   //screen.destroy();
   //console.log (timelines[tlIndex]);
   for (var i=0; i < timelines[tlIndex].object.lpos.width - 3; i++) {
    newString += "_";
   }
   newString += "\n";
   timelines[tlIndex].content = newString + timelines[tlIndex].content;
   timelines[tlIndex].object.content = timelines[tlIndex].content;
   screen.render();
  }

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

  function newTimelineInputForm() {
    var form = blessed.form({
      parent: screen,
      mouse: true,
      keys: true,
      vi: true,
      left: "center",
      top: "center",
      width: '50%',
      height: "50%",
      draggable: true,
      //height: 12,
      style: {
        bg: 'blue',
        // border: {
        //   inverse: true
        // },
        scrollbar: {
          inverse: true
        }
      },
      content: '',
      label: " Add new Timeline ",
      scrollable: true,
      border: {
        type: 'line',
        left: true,
        top: true,
        right: true,
        bottom: true
      },
      scrollbar: {
        ch: ' '
      }
      //alwaysScroll: true
    });
    var cancel = blessed.button({
      parent:form,
      content: "Cancel",
      mouse: true,
      width: "10%",
      height: "10%",
      bottom: "10%",
      right: "10%",
      border: {
        type: 'line',
        left: true,
        top: true,
        right: true,
        bottom: true
      }
    })
    cancel.on("press", function() {
      screen.debug("Form Cancel");
      form.destroy();
    })
  }
  //create bottom bar
  function createBottomBar() {
   var bar = blessed.listbar({
     parent: screen,
     bottom: 0,
     left: 3,
     right: 3,
     height: 3,
     mouse: true,
     keys: true,
     autoCommandKeys: true,
     border: 'line',
     vi: true,
     style: {
       bg: 'green',
       item: {
         bg: 'red',
         hover: {
           bg: 'blue'
         },
         //focus: {
         //  bg: 'blue'
         //}
       },
       selected: {
         bg: 'blue'
       }
     },
     commands: {
       '<-': {
         keys: ['left'],
         callback: function() {
           scrollRight();
         }
       },
       '->': {
         keys: ['right'],
         callback: function() {
           scrollLeft();
         }
       },
       'New TL': function() {
        newTimelineInputForm();
       }
   }});
   screen.render();
  }

  function createClientFromConfig(file) {
    //check if config file, use default one?
    if (file == undefined) {
      file = "config.json";
    }
    //read config file
    config = JSON.parse(fs.readFileSync(file));

    //generate timelines 

    config.timelines.forEach(function (currentTimelineConfig) {
      console.log(currentTimelineConfig)
      // generate UI element

      var timelineIndex = createTimeline(currentTimelineConfig.width, currentTimelineConfig.name);
      screen.render();
      if (currentTimelineConfig.type == "testHome") {
        // test home timeline
        setInterval(() => {generateTweetinTimeline(timelineIndex, "UwU", "uwukek", "i mog sterbn", false, 1, 2, false);}, 200);
      } else if (currentTimelineConfig.type == "home") {
        // normal home timeline
        //TODO: Create Tweet Stream
        // Check which client this timeline is for!
      }
    });
  }

  createBottomBar();
  createClientFromConfig(cfgFile);
  screen.render();
}
init();