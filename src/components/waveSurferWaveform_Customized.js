import React from 'react'
import ReactDOM from 'react-dom'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from "wavesurfer.js/src/plugin/regions";
import CursorPlugin from "wavesurfer.js/src/plugin/cursor";
import TimelinePlugin from "wavesurfer.js/src/plugin/timeline";
import { copy, cut, paste } from "../utils/waveSurferOperation";
export default class WaveSurferWaveform extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pos: 0,
      playing:props.playing,
    }
    this.cutSelection = null
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);


    /**
     * Variables.
     */
    this.contextMenuClassName = "context-menu";
    this.contextMenuItemClassName = "context-menu__item";
    this.contextMenuLinkClassName = "context-menu__link";
    this.contextMenuActive = "context-menu--active";

    this.taskItemClassName = "wavesurfer-region";

  }
  selectedRegion=null

  taskItemInContext;

  clickCoords;
  clickCoordsX;
  clickCoordsY;

  /*var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  */
  menu;
  menuItems;
  menuState = 0;
  menuWidth;
  menuHeight;
  menuPosition;
  menuPositionX;
  menuPositionY;

  windowWidth;
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
  clickInsideElement=( e, className ) =>{
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
  getPosition=(e)=> {
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
   */
  init=()=> {
    console.log('init method')
    this.menu = document.querySelector("#context-menu");
    this.menuItems = this.menu.querySelectorAll(".context-menu__item");
    debugger
    this.contextListener();
    this.clickListener();
    this.keyupListener();
    this.resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  contextListener=()=> {
    let k = this
    document.addEventListener( "contextmenu", function(e) {
      k.taskItemInContext = k.clickInsideElement( e, k.taskItemClassName );

      if ( k.taskItemInContext ) {
        e.preventDefault();
        k.toggleMenuOn();
        k.positionMenu(e);
      } else {
        k.taskItemInContext = null;
        k.toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  clickListener=()=> {
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
          k.toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  keyupListener=() =>{
    let k = this
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        k.toggleMenuOff();
      }
    }
  }

  /**
   * Window resize event listener
   */
  resizeListener=()=> {
    let k = this
    window.onresize = function(e) {
      k.toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  toggleMenuOn=()=> {
    if ( this.menuState !== 1 ) {
      this.menuState = 1;
      this.menu.classList.add( this.contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  toggleMenuOff=() =>{
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
  positionMenu=(e)=> {
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
  menuItemListener=( link )=> {
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


  handleTogglePlay() {
    const { id, onChange } = this.props;
    if(this.props.playing){
      this.setState({playing:!this.state.playing})
    } else{
      onChange(id);
    }
  }
  removeAllRegions() {
    console.log("Clearing all regions - yay!");
    this.wavesurfer.clearRegions();
  }
  handlePosChange(e) {
    this.setState({
      pos: e.originalArgs[0]
    });
  }
  zoomWaveform(event){
    var zoomLevel = Number(event.target.value);
    this.wavesurfer.zoom(zoomLevel);
  };
  // Convert a audio-buffer segment to a Blob using WAVE representation
  // The returned Object URL can be set directly as a source for an Auido element.

  bufferToWave(abuffer, offset, len) {

    var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // update data chunk
        pos += 2;
      }
      offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], {type: "audio/mpeg"});

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  copyAndReturnSegment(region){
    this.cutSelection = copy(region,this.wavesurfer)
    // instance.loadDecodedBuffer(emptySegment);

    var arraybuffer = this.bufferToWave(this.cutSelection,0,this.cutSelection.length);//Will create a new Blob with
    let url = URL.createObjectURL(arraybuffer)
    debugger

    var audio = new Audio(url);
    audio.controls = true;
    audio.volume = 0.5;
    audio.autoplay = true;
    //playSound(abuffer);
    document.body.appendChild(audio);
    debugger
    this.props.onSetCutSelection({cutSelection:this.cutSelection, key:this.state.pos})
  }
  cutAndReturnAudioBuffer(region){
    let k = cut(region,this.wavesurfer)
    let newAudioBuffer = k.newAudioBuffer
    this.cutSelection = k.cutSelection
    this.wavesurfer.loadDecodedBuffer(newAudioBuffer);

    // var arraybuffer = this.bufferToWave(newAudioBuffer,0,newAudioBuffer.length);//Will create a new Blob with
    var arraybuffer = this.bufferToWave(this.cutSelection ,0,this.cutSelection.length);//Will create a new Blob with
    let url = URL.createObjectURL(arraybuffer)

    var audio = new Audio(url);
    audio.controls = true;
    audio.volume = 0.5;
    audio.autoplay = true;
    document.body.appendChild(audio);
  }

  pasteAndReturnAudioBuffer(){
    debugger
    let newAudioBuffer = paste(this.wavesurfer,this.cutSelection)
    this.wavesurfer.loadDecodedBuffer(newAudioBuffer);
  }
  componentDidMount() {
    debugger
    this.$el = ReactDOM.findDOMNode(this)
    this.$waveform = this.$el.querySelector('.wave')
    this.wavesurfer = WaveSurfer.create({
      container: this.$waveform,
      waveColor: 'violet',
      progressColor: 'purple',
      mediaControls: true,
      responsive: true,
      scrollParent: true,
      //hideScrollbar:true,
      normalize: true,
      minimap: true,
      // splitChannels: true,
      plugins: [
        RegionsPlugin.create({
          regions: [
            {
              start: 1,
              end: 3,
              color: 'hsla(400, 100%, 30%, 0.5)'
            }, {
              start: 5,
              end: 7,
              color: 'hsla(200, 50%, 70%, 0.4)'
            }
          ],
          dragSelection: {
            slop: 5
          },
          useSelection:true
        }),
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            'background-color': '#000',
            color: '#fff',
            padding: '2px',
            'font-size': '10px'
          }
        }),
        TimelinePlugin.create({
          container: ".wave-timeline"
        }),
      ]
    })
    // go back 2 seconds
    this.wavesurfer.skip(12);

    // this.wavesurfer.load  ("./audio/Vocals30.mp3")
    this.wavesurfer.load(this.props.src)
    this.wavesurfer.on('ready', ()=> {
      if(this.state.playing){
        this.wavesurfer.play();
        this.wavesurfer.enableDragSelection({
          drag: true,
          resize: true,
          loop: true,
        });
      }else{
        this.wavesurfer.pause();
      }
    });
    this.wavesurfer.on('pause',  ()=> {
      this.wavesurfer.params.container.style.opacity = 0.9;
    });
    // onDrag
    this.wavesurfer.on('region-click', (region, e)=> {
      console.log('region-click start'+ region.start);
      console.log('region-click end'+ region.end);
      // e.stopPropagation();
      // this.wavesurfer.play(region.start, region.end);
    });

    this.wavesurfer.on('region-dblclick', (region, event)=>{
      console.log("Region clicked - (backend startPos=" + this.wavesurfer.backend.startPosition+") and region start(region start = "+region.start+")");
      // this.cutAndReturnAudioBuffer(region,this.wavesurfer)
      // this.copyAndReturnSegment(region,this.wavesurfer)
      // region.remove();

      this.selectedRegion = region
      /*this.taskItemInContext = this.clickInsideElement( event, this.taskItemClassName );

      if ( this.taskItemInContext ) {
        event.preventDefault();
        this.toggleMenuOn();
        this.positionMenu(event);
      } else {
        this.taskItemInContext = null;
        this.toggleMenuOff();
      }*/
    });

    // this.wavesurfer.on('region-update-end', (region, event)=> {
    //   console.log("Region created - (backend startPos=" + this.wavesurfer.backend.startPosition+") and region start(region start = "+region.start+")");
    //   this.wavesurfer.backend.startPosition = region.start * this.wavesurfer.backend.startPosition;
    //   this.wavesurfer.seekTo(region.start * this.wavesurfer.backend.startPosition);
    //   event.stopPropagation();
    // });

    /*this.wavesurfer.addRegion({
      start: 0, // time in seconds
      end: 3, // time in seconds
      color: 'hsla(100, 100%, 30%, 0.1)'
    });*/

    //
    //
    // // Drag'n'drop
    // var toggleActive = function(e, toggle) {
    //   e.stopPropagation();
    //   e.preventDefault();
    //   toggle
    //     ? e.target.classList.add('wavesurfer-dragover')
    //     : e.target.classList.remove('wavesurfer-dragover');
    // };

/*    var handlers = {
      // Drop event
      drop: function(e) {
        toggleActive(e, false);

        // Load the file into wavesurfer
        if (e.dataTransfer.files.length) {
          this.wavesurfer.loadBlob(e.dataTransfer.files[0]);
        } else {
          this.wavesurfer.fireEvent('error', 'Not a file');
        }
      },

      // Drag-over event
      dragover: function(e) {
        toggleActive(e, true);
      },

      // Drag-leave event
      dragleave: function(e) {
        toggleActive(e, false);
      }
    };

    var dropTarget = document.querySelector('#drop');
    Object.keys(handlers).forEach(function(event) {
      dropTarget.addEventListener(event, handlers[event]);
    });*/

/*    var taskItems = document.querySelectorAll(".wavesurfer-region");

    for ( var i = 0, len = taskItems.length; i < len; i++ ) {
      var taskItem = taskItems[i];
      contextMenuListener(taskItem);
    }

    function contextMenuListener(el) {
      el.addEventListener( "contextmenu", function(e) {
        console.log(e, el);
      });
    }*/
    setTimeout(()=>{
      // contextRightClickModule.init(this.copyAndReturnSegment,this.cutAndReturnAudioBuffer,this.pasteAndReturnAudioBuffer)
      this.init()
    },1500)


  }
  /*componentDidMount() {
    debugger
    this.$el = ReactDOM.findDOMNode(this)
    this.$waveform = this.$el.querySelector('.wave')
    this.wavesurfer = WaveSurfer.create({
      container: this.$waveform,
      waveColor: 'violet',

      backend: 'MediaElement',
      mediaType:'audio',
      normalize: true,
      barWidth: 3,

      progressColor: 'purple',
      mediaControls: true,
      responsive: true,
      // splitChannels: true,
      plugins: [
        RegionsPlugin.create({
          dragSelection: {
            slop: 5
          },
          useSelection:true
        }),
        CursorPlugin.create({
          showTime: true,
          opacity: 1,
          customShowTimeStyle: {
            'background-color': '#000',
            color: '#fff',
            padding: '2px',
            'font-size': '10px'
          }
        }),
        TimelinePlugin.create({
          container: ".wave-timeline"
        })
      ]
    })

    //Set song
    this.wavesurfer.song = "http://www.stephaniequinn.com/Music/Allegro%20from%20Duet%20in%20C%20Major.mp3"

    //Set peaks
    this.wavesurfer.backend.peaks = [0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538, 0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218, 0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621, 0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984, 0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833, 0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108];

    //Draw peaks
    this.wavesurfer.drawBuffer();

    //Variable to check if song is loaded
    this.wavesurfer.loaded = false;

    // this.wavesurfer.load  ("./audio/Vocals30.mp3")
    // this.wavesurfer.load(this.props.src)
    this.wavesurfer.on('ready', ()=> {
      if(this.props.playing){
        if(!this.wavesurfer.loaded) {
          this.wavesurfer.loaded = true;
          this.wavesurfer.play();

          this.wavesurfer.enableDragSelection({
            drag: true,
            resize: true,
            loop: true,
          });
        }
      }
    });
    //Load song when play is pressed
    this.wavesurfer.on("play", function () {
      if(!this.wavesurfer.loaded) {
        this.wavesurfer.load(this.wavesurfer.song, this.wavesurfer.backend.peaks);
      }
    });
    this.wavesurfer.on('pause',  ()=> {
      this.wavesurfer.params.container.style.opacity = 0.9;
    });
    // onDrag
    this.wavesurfer.on('region-click', (region, e)=> {
      console.log(region.start);
      console.log(region.end);
      e.stopPropagation();
      // this.wavesurfer.play(region.start, region.end);
    });
    /!*this.wavesurfer.addRegion({
      start: 0, // time in seconds
      end: 3, // time in seconds
      color: 'hsla(100, 100%, 30%, 0.1)'
    });*!/
  }*/

  componentWillReceiveProps(nextProps) {
    debugger
    if(nextProps.cutSelectionData.key !== this.props.id) {
      if(JSON.stringify(this.cutSelection) !== JSON.stringify(nextProps.cutSelectionData.cutSelection)) {
        this.cutSelection = nextProps.cutSelectionData.cutSelection
      }
    }
    if(this.state.playing !== nextProps.playing){
      this.setState({ playing: nextProps.playing })
    }
    debugger
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.playing){
      this.wavesurfer.play();
    }else{
      this.wavesurfer.pause();
    }
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if(nextProps){
      debugger
    }
    return true
  }

  render() {
    let width100 ={
      width:'100%'
    }
    return (
      <div>
        <div className='waveform'>
        <div className="wave-timeline"/>
        <div className='wave'/>
        <button onClick={this.handleTogglePlay}>{this.state.playing ? 'Pause' : 'play'}</button>
        <div className="row">
          <div className="col-xs-1">
            {/*<i className="glyphicon glyphicon-zoom-in"></i>*/}
          </div>

          <div className="col-xs-10">
            <input id="slider" type="range" min="1" max="200" className={width100} onInput={(e)=>this.zoomWaveform(e)}/>
          </div>

          <div className="col-xs-1">
            {/*<i className="glyphicon glyphicon-zoom-out"></i>*/}
          </div>
        </div>
        <button className="btn btn-primary" onClick={()=>this.removeAllRegions()}>
          {/*<i className="glyphicon glyphicon-play"></i>*/}
          Remove All Regions
        </button>
        {/*<p className="lead pull-center" id="drop">
          Drag'n'drop your
          <i className="glyphicon glyphicon-music"></i>-file
          here!
        </p>*/}
        <button onClick={()=>this.copyAndReturnSegment(this.wavesurfer)}> Cut </button>
        <button onClick={()=>this.pasteAndReturnAudioBuffer()}> Paste </button>
        <button onClick={()=>this.cutAndReturnAudioBuffer(this.wavesurfer)}> Trim </button>

      </div>

      </div>

    )
  }
}

WaveSurferWaveform.defaultProps = {
  src: ""
}
