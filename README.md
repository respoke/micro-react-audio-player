# Micro Audio Player for React

![minimal html5 audio player for react](player-example.gif)

## Usage

```bash
npm i micro-react-audio-player -S
```

```javascript
import Player from 'micro-react-audio-player';

const MyCustomComponent = React.createClass({
    render() {
        const source = 'http://www.w3schools.com/html/horse.ogg';
        const play = <span>Play</span>; // optional
        const pause = <span>Pause</span>; // optional
        const shouldAutoplay = true; // optional
        return <Player source={source} sourceType="audio/ogg"
            playElement={play} pauseElement={pause}
            autoPlay={shouldAutoplay} />;
    }
});
```
