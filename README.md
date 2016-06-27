# Micro Audio Player for React

## Usage

```javascript
import Player from 'micro-react-audio-player';

const MyCustomComponent = React.createClass({
    render() {
        const source = 'http://www.w3schools.com/html/horse.ogg';
        const play = <span>Play</span>;
        const pause = <span>Pause</span>
        const shouldAutoplay = true;
        return <Player source={source} sourceType="audio/ogg"
            playElement={play} pauseElement={pause}
            autoPlay={shouldAutoplay} />;
    }
});
```
