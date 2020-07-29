"use strict";

var bswVersion = "V0.33";

var BSW = {
  // given the parent button group with class 'bsw-group'
  // create a toggle button
  // @parId is the id of the button group containing the class 'bsw-group'
  // @toggleMode is specified by 'bsw-toggle-mode' option
  //   toggleMode == 0: clicking an active button does nothing
  //   toggleMode == 1: clicking an active button also toggles it
  //   toggleMode == 2: clicking an active button also toggles it, and hides the inactive button
  // @onClass is the style when the button is on (can be one of "", "default", "primary", "info", "success", "warning", "danger")
  // @offClass is the style when the button is off (can be one of "", "default", "primary", "info", "success", "warning", "danger")
  // @clickHandler is specified by 'bsw-click-handler'
  // specifies what to do after the user click the button group
  create: function(parId, toggleMode, onClass, offClass, clickHandler)
  {
    var par = $('#' + parId)[0];
    if ( !par ) {
      alert("BSW.create: " + parId + " doesn't exist");
      return;
    }
    $(par).addClass('bsw-group');

    // save the toggle mode
    par.toggleMode = toggleMode;
    par.opts = $('#' + parId + ' > .bsw');

    // decorate the class name
    if ( onClass.length > 0 && onClass.substring(0, 4) !== 'btn-' ) {
      onClass = 'btn-' + onClass;
    }
    par.onClass = onClass;
    if ( offClass.length > 0 && offClass.substring(0, 4) !== 'btn-' ) {
      offClass = 'btn-' + offClass;
    }
    par.offClass = offClass;

    // install the user-specified handler
    par.clickHandler = clickHandler;

    // choose a child button with "bsw-active" class
    var activeChild = $('#' + parId + ' > .bsw.bsw-active')[0];
    if ( !activeChild ) {
      alert("BSW.create: " + parId + ' has no active child, please use one of the labels, bsw-active, bsw-inactive, bsw-toggle');
      return;
    }
    par.active = activeChild;
    BSW.choose( activeChild );

    $(par).children('.bsw-active');
    $(par).children('.bsw-inactive');

    if ( par.toggleMode == 2 ) {
      // in mode 2, show active, hide inactive
      $(par).children('.bsw-active').show();
      $(par).children('.bsw-inactive').hide();
    }

    // install function in response to clicking
    par.opts.on('click', function(e) {
      var changed;
      if ( par.toggleMode == 0 ) {
        // choose the current option, even it is already active
        changed = BSW.choose( this );
      } else {
        // toggle the current option, active <-> inactive
        changed = BSW.toggle(par.id);
      }
      if ( par.clickHandler ) {
        par.clickHandler(e, changed);
      }
    });
    BSW.render(par.id);
  }
  ,

  render: function(parId)
  {
    var par = $('#' + parId)[0];

    if ( par.toggleMode == 0 || par.toggleMode == 1 )
    {
      $(par).children('.bsw-active').removeClass(par.offClass).addClass(par.onClass);
      $(par).children('.bsw-inactive').removeClass(par.onClass).addClass(par.offClass);
      $(par).children('.bsw-toggle').removeClass(par.offClass).addClass(par.onClass);
    }
    else if ( par.toggleMode == 2 )
    {
      // the toggle button changes button according to whether the "on" button is "active"
      var elemActive = $(par).children('.bsw-active')[0];
      if ( $(par).children('.bsw-on')[0] == elemActive ) {
        // the button is turned on, clicking it means to turn it off, so we paint it with the off style
        $(par).children().removeClass(par.onClass).addClass(par.offClass);
      } else {
        $(par).children().removeClass(par.offClass).addClass(par.onClass);
      }
      // in mode 2, show active, hide inactive
      $(par).children('.bsw-active').show();
      $(par).children('.bsw-inactive').hide();
    }
  }
  ,

  // change the active to inactive, vise versa
  // return true (state changed)
  toggle: function(parId)
  {
    var par = $('#' + parId)[0];
    par.prevActive = par.active;
    $(par).children('.bsw-active, .bsw-inactive').each(function () {
      if ( $(this).hasClass('bsw-active') ) {
        $(this).removeClass('bsw-active').addClass('bsw-inactive');
      } else if ( $(this).hasClass('bsw-inactive') ) {
        $(this).removeClass('bsw-inactive').addClass('bsw-active');
        par.active = this;
      }
    });
    BSW.render(parId);
    return true;
  }
  ,

  // simulate the user click event
  userToggle: function(parId)
  {
    var par = $('#' + parId)[0], child;
    if ( par.toggleMode == 0 ) { // click the inactive button to turn it on
      child = '.bsw-inactive';
    } else { // click the active button, because the inactive button is hidden
      child = '.bsw-active';
    }
    $(par).children(child).click();
  }
  ,

  // pick a state
  // return if the state has been changed
  choose: function(opt)
  {
    var par = $(opt).parent()[0];
    // clicking a neutral button means to toggle it
    if ( !$(opt).hasClass('bsw-active') && !$(opt).hasClass('bsw-inactive') ) {
      return BSW.toggle(par.id);
    }

    par.prevActive = par.active;
    $(par).children('.bsw-active, .bsw-inactive').each(function () {
      if ( this === opt ) {
        $(this).removeClass('bsw-inactive').addClass('bsw-active');
        par.active = this;
      } else {
        $(this).removeClass('bsw-active').addClass('bsw-inactive');
      }
    });
    BSW.render(par.id);
    return par.prevActive !== par.active;
  }
  ,

  chooseById: function(id)
  {
    var opt = $('#' + id)[0];
    BSW.choose(opt);
  }
  ,

  getChoice: function(parId)
  {
    var opt = $('#' + parId + ' > .bsw-active')[0];
    if ( !opt ) {
      alert("BSW.getChoice: " + parId + " has no active member, define it use the class name bsw-active");
    }
    return opt;
  }
  ,

  isOn: function(parId)
  {
    var opt = BSW.getChoice(parId);
    return $(opt).hasClass('bsw-on');
  }
  ,
};

/* install switches with bsw-group class on starting */
$(document).ready(function() {
  $('.bsw-group').each( function(i, el) {
    // read the toggle mode if user has defined one
    var toggleMode = +$(el).attr("data-bsw-toggle-mode"); // the '+' turns the string to a number
    if ( isNaN(toggleMode) ) {
      toggleMode = 0;
    }

    // read the onClass and offClass
    var onClass = $(el).attr("data-bsw-on-style");
    if ( !onClass ) {
      onClass = 'primary';
    }
    var offClass = $(el).attr("data-bsw-off-style");
    if ( !offClass ) {
      offClass = '';
    }

    // read the click-handler if the user has defined one
    var ch = $(el).attr("data-bsw-click-handler");
    var clickHandler = undefined;
    if ( ch ) {
      var func = window[ch];
      if ( typeof func === 'function' ) {
      clickHandler = func;
      }
    }

    if ( el.id.length == 0 ) {
      el.id = "bsw-" + i;
    }
    BSW.create(el.id, toggleMode, onClass, offClass, clickHandler);
  });
});

