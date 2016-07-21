const React = require('react');
const PropTypes = React.PropTypes;

const defaultPlay = <span>&#9654;</span>;
const defaultPause = <span>&#9611;&#9611;</span>;

const playerContainerStyles = {
  display: 'block',
  width: '100%'
};
const playPauseButtonLayoutStyles = {
  display: 'inline-block',
  marginTop: '9px',
  width: '14%',
  verticalAlign: 'top',
  cursor: 'pointer'
};
const playProgressLayoutWrapperStyles = {
  display: 'inline-block',
  width: '84%'
};
const audioProgressBarContainerStyles = () => ({
  display: 'block',
  width: '0%',
  height: '21px',
  marginTop: '8px',
  background: 'transparent',
  borderLeft: '1px solid #777',
  borderRight: '1px solid #777'
});
const audioPlayerLineStyles = {
  width: '100%',
  height: '0px',
  paddingTop: '10px',
  display: 'block',
  background: 'transparent',
  borderBottom: '1px solid #777'
};

const AudioPlayer = React.createClass({
  propTypes: {
    source: PropTypes.string.isRequired,
    sourceType: PropTypes.string.isRequired,
    playElement: PropTypes.object,
    pauseElement: PropTypes.object,
    autoPlay: PropTypes.any,
    onPlay: PropTypes.func
  },
  getInitialState() {
    return {
      fileFinishedDownloading: false,
      mediaDownloadProgressPercent: 0,
      mediaRequest: null,
      mediaFile: null,
      canPlay: false,
      paused: true,
      progressStyles: {}
    };
  },
  componentDidMount() {
    // The media is loaded as a blob to work around issues with Safari, for some reason,
    // not being able to play a wav file when it is an audio source. This makes no sense.
    // The other upside of having the file as a blob vs audio source is we can make
    // clicking the audio progress bar do a seek. For some reason, that only worked on
    // Firefox using an audio source.
    const mediaRequest = new XMLHttpRequest();
    this.setState({ mediaRequest });
    mediaRequest.open('GET', this.props.source, true);
    mediaRequest.responseType = 'blob';
    mediaRequest.onload = () => {
      const mediaFile = window.URL.createObjectURL(mediaRequest.response);
      this.setState({
        mediaFile,
        mediaRequest: null,
        fileFinishedDownloading: true,
        mediaDownloadProgressPercent: 0
      });
    };
    mediaRequest.onprogress = (e) => {
      this.setState({
        mediaDownloadProgressPercent: (e.loaded / e.total) * 100
      });
    };
    mediaRequest.send();
  },
  componentWillUnmount() {
    if (this.state.mediaRequest) {
      this.state.mediaRequest.abort();
    }
  },
  togglePlaying(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.refs.audioElement.paused) {
      this.refs.audioElement.play();
      this.setState({
        paused: false
      });
      if (this.props.onPlay) {
        this.props.onPlay();
      }
    } else {
      this.refs.audioElement.pause();
      this.setState({
        paused: true
      });
    }
  },
  setAudioProgress() {
    const progressStyles = {
      position: 'relative',
      display: 'inline-block',
      borderRight: '1px solid #777',
      height: '21px',
      padding: '0px',
      top: '-11px',
      left: '0'
    };

    const width = (
      this.refs.audioElement.currentTime / this.refs.audioElement.duration
    ) * 100;
    progressStyles.left = `${width}%`;
    if (width > 98) {
      this.setState({
        paused: true
      });
    }
    this.setState({ progressStyles });
  },
  replay(e) {
    e.stopPropagation();
    e.preventDefault();
    const x = e.pageX - e.target.offsetLeft;
    const howFarOverCursorX = Math.min((x / e.target.clientWidth), 1);
    const newDuration = howFarOverCursorX * this.refs.audioElement.duration;
    this.refs.audioElement.currentTime = newDuration;
    this.setState({
      paused: false
    });
  },
  onCanPlay() {
    this.setState({
      canPlay: true
    });
    if (this.props.autoPlay) {
      this.refs.audioElement.play();
      this.setState({
        paused: false
      });
    }
  },
  render() {
    const fileFinishedDownloading = this.state.fileFinishedDownloading;
    const mediaDownloadProgressPercent = this.state.mediaDownloadProgressPercent;
    const canPlay = this.state.canPlay;
    const paused = this.state.paused;
    const progressStyles = this.state.progressStyles;
    const mediaFile = this.state.mediaFile;
    const sourceType = this.state.sourceType;
    const playElement = this.props.playElement || defaultPlay;
    const pauseElement = this.props.pauseElement || defaultPause;

    const playPauseButtonInternals = paused ? playElement : pauseElement;

    const playPauseButton = (<span style={playPauseButtonLayoutStyles}
      disabled={canPlay}
      onClick={this.togglePlaying}>
      {playPauseButtonInternals}
    </span>);

    const progressContainerStyles = audioProgressBarContainerStyles();
    const playProgress = (<div style={progressContainerStyles} onClick={this.replay}>
      <span style={audioPlayerLineStyles} />
      <span style={progressStyles} />
    </div>);

    // audio player line is not even added until you press play and it fully loads
    let audioElement = null;

    if (!fileFinishedDownloading) {
      progressContainerStyles.width = `${mediaDownloadProgressPercent}%`;
    } else {
      progressContainerStyles.width = '100%';

      audioElement = (<audio onCanPlay={this.onCanPlay}
        onTimeUpdate={this.setAudioProgress}
        ref="audioElement">
        <source src={mediaFile} type={sourceType} />
      </audio>);
    }

    return (
      <div style={playerContainerStyles}>
        {audioElement}
        {playPauseButton}
        <span style={playProgressLayoutWrapperStyles}>{playProgress}</span>
      </div>
    );
  }
});

module.exports = AudioPlayer;
