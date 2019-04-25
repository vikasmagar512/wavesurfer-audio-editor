
/**
 * Variables.
 */
export var contextMenuClassName = "context-menu",
  contextMenuItemClassName = "context-menu__item",
contextMenuLinkClassName = "context-menu__link",
contextMenuActive = "context-menu--active",

taskItemClassName = "wavesurfer-region",

taskItemInContext,

clickCoords,
clickCoordsX,
clickCoordsY,

/*var menu = document.querySelector("#context-menu");
var menuItems = menu.querySelectorAll(".context-menu__item");
*/
menu,
menuItems,
menuState = 0,
menuWidth,
menuHeight,
menuPosition,
menuPositionX,
menuPositionY,

windowWidth,
windowHeight;


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// H E L P E R    F U N C T I O N S
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/**
 * Function to check if we clicked inside an element with a particular class
 * name.
 *
 * @param {Object} e The event
 * @param {String} className The class name to check against
 * @return {Boolean}
 */
export const clickInsideElement=( e, className ) =>{
  var el = e.srcElement || e.target;

  if ( el.classList.contains(className) ) {
    return el;
  } else {
    while ( el = el.parentNode ) {
      if ( el.classList && el.classList.contains(className) ) {
        return el;
      }
    }
  }

  return false;
}

/**
 * Get's exact position of event.
 *
 * @param {Object} e The event passed in
 * @return {Object} Returns the x and y position
 */
export const getPosition=(e)=> {
  var posx = 0;
  var posy = 0;

  if (!e) var e = window.event;

  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return {
    x: posx,
    y: posy
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//
// C O R E    F U N C T I O N S
//
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


/**
 * Initialise our application's code.
 *//*
export const init=()=> {
  console.log('init method')
  this.menu = document.querySelector("#context-menu");
  this.menuItems = this.menu.querySelectorAll(".context-menu__item");
  debugger
  this.contextListener();
  this.clickListener();
  this.keyupListener();
  this.resizeListener();
}*/

/**
 * Listens for contextmenu events.
 */
export const contextListener=()=> {
  let k = this
  document.addEventListener( "contextmenu", function(e) {
    k.taskItemInContext = clickInsideElement.bind( k, e, taskItemClassName )();

    if ( k.taskItemInContext ) {
      e.preventDefault();
      toggleMenuOn.bind(k)();
      positionMenu.bind(k,e)();
    } else {
      k.taskItemInContext = null;
      toggleMenuOff.bind(k)();
    }
  });
}

/**
 * Listens for click events.
 */
export const clickListener=()=> {
  let k = this
  document.addEventListener( "click", (e)=> {
    var clickeElIsLink = k.clickInsideElement( e, k.contextMenuLinkClassName );

    if ( clickeElIsLink ) {
      e.preventDefault();
      k.menuItemListener( clickeElIsLink );
      e.stopImmediatePropagation()
      // e.stopPropagation()
    } else {
      var button = e.which || e.button;
      if ( button === 1 ) {
        toggleMenuOff.bind(k)();
      }
    }
  });
}

/**
 * Listens for keyup events.
 */
export const keyupListener=() =>{
  let k = this
  window.onkeyup = function(e) {
    if ( e.keyCode === 27 ) {
      toggleMenuOff.bind(k)();
    }
  }
}

/**
 * Window resize event listener
 */
export const resizeListener=()=> {
  let k = this
  window.onresize = function(e) {
    toggleMenuOff.bind(k)();
  };
}

/**
 * Turns the custom context menu on.
 */
export const toggleMenuOn=()=> {
  if ( this.menuState !== 1 ) {
    this.menuState = 1;
    this.menu.classList.add( this.contextMenuActive );
  }
}

/**
 * Turns the custom context menu off.
 */
export const toggleMenuOff=() =>{
  if ( this.menuState !== 0 ) {
    this.menuState = 0;
    this.menu.classList.remove( this.contextMenuActive );
  }
}

/**
 * Positions the menu properly.
 *
 * @param {Object} e The event
 */
export const positionMenu=(e)=> {
  this.clickCoords = this.getPosition(e);
  this.clickCoordsX = this.clickCoords.x;
  this.clickCoordsY = this.clickCoords.y;

  this.menuWidth = this.menu.offsetWidth + 4;
  this.menuHeight = this.menu.offsetHeight + 4;

  this.windowWidth = window.innerWidth;
  this.windowHeight = window.innerHeight;

  if ( (this.windowWidth - this.clickCoordsX) < this.menuWidth ) {
    this.menu.style.left = this.windowWidth - this.menuWidth + "px";
  } else {
    this.menu.style.left = this.clickCoordsX + "px";
  }

  if ( (this.mwindowHeight - this.mclickCoordsY) < this.menuHeight ) {
    this.menu.style.top = this.windowHeight - this.menuHeight + "px";
  } else {
    this.menu.style.top = this.clickCoordsY + "px";
  }
}

/**
 * Dummy action function that logs an action when a menu item link is clicked
 *
 * @param {HTMLElement} link The link that was clicked
 */
export const menuItemListener=( link )=> {
  console.log( "Task ID - " + this.taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
  debugger
  if(link.getAttribute("data-action") === 'copy'){
    alert('copy')
    debugger
    if(!this.selectedRegion){
      this.selectedRegion = this.wavesurfer.regions.list[this.taskItemInContext.getAttribute("data-id") ]
    }
    debugger
    this.copyAndReturnSegment(this.selectedRegion)
  }else  if(link.getAttribute("data-action") === 'cut'){
    alert('cut')
    if(!this.selectedRegion){
      this.selectedRegion = this.wavesurfer.regions.list[this.taskItemInContext.getAttribute("data-id") ]
    }
    this.cutAndReturnAudioBuffer(this.selectedRegion)
  }else if(link.getAttribute("data-action") === 'paste'){
    alert('paste')
    this.pasteAndReturnAudioBuffer()
  }
  this.toggleMenuOff();
}
