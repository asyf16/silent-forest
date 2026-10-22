import { useEffect, useRef, useState } from "react";
import { FaCheck, FaLeaf, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import "./VolumeMenu.css";

// Replace these files (or paths) when the three songs are ready.
const songs = [
  { name: "Song 1", src: "/bgm.mp3" },
  { name: "Song 2", src: "/music/song-2.mp3" },
  { name: "Song 3", src: "/music/song-3.mp3" },
];

function VolumeMenu({ soundOn, onSoundChange, volume, onVolumeChange }) {
  const audioRef = useRef(null);
  const [selectedSong, setSelectedSong] = useState(0);

  useEffect(() => {
    if (!soundOn) return;
    const audio = audioRef.current;
    let active = true;
    audio.play().catch((error) => {
      if (!active || error.name === "AbortError") return;
    });
    return () => {
      active = false;
      audio.pause();
    };
  }, [soundOn, selectedSong]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  return (
    <div className="volume-menu">
      <audio ref={audioRef} src={songs[selectedSong].src} loop preload="none" />
      <button
        type="button"
        className="volume-trigger"
        popovertarget="volume-popup"
        aria-label="Open sound settings"
        title="Forest sounds"
      >
        {soundOn && volume > 0 ? <FaVolumeUp aria-hidden="true" /> : <FaVolumeMute aria-hidden="true" />}
      </button>
      <section id="volume-popup" className="volume-popup" popover="auto" aria-labelledby="volume-title">
        <button type="button" className="volume-close" popovertarget="volume-popup" popovertargetaction="hide" aria-label="Close sound settings">
          <FaTimes aria-hidden="true" />
        </button>
        <div className="volume-heading">
          <FaLeaf aria-hidden="true" />
          <h2 id="volume-title">Forest sounds</h2>
        </div>
        <div className="volume-controls">
          <button
            type="button"
            className="volume-mute"
            aria-label={soundOn ? "Mute all sounds" : "Unmute all sounds"}
            aria-pressed={!soundOn}
            onClick={() => {
              if (!soundOn && volume === 0) onVolumeChange(0.5);
              onSoundChange(!soundOn);
            }}
          >
            {soundOn ? <FaVolumeUp aria-hidden="true" /> : <FaVolumeMute aria-hidden="true" />}
            <span>{soundOn ? "Mute" : "Unmute"}</span>
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            aria-label="Sound volume"
            aria-valuetext={`${Math.round(volume * 100)} percent`}
            onChange={(event) => {
              const nextVolume = Number(event.target.value) / 100;
              onVolumeChange(nextVolume);
              onSoundChange(nextVolume > 0);
            }}
          />
        </div>
        <fieldset className="volume-songs">
          {songs.map((song, index) => (
            <label className="volume-song" key={song.src}>
              <input type="radio" name="forest-song" value={index} checked={selectedSong === index} onChange={() => {
                setMessage("");
                setSelectedSong(index);
              }} />
              <span>{song.name}</span>
              <FaCheck aria-hidden="true" />
            </label>
          ))}
        </fieldset>
      </section>
    </div>
  );
}

// Keep the control contract checked without an additional runtime dependency.
VolumeMenu.propTypes = {
  soundOn: (props, name) => typeof props[name] === "boolean" ? null : new Error(`${name} must be a boolean`),
  onSoundChange: (props, name) => typeof props[name] === "function" ? null : new Error(`${name} must be a function`),
  volume: (props, name) => typeof props[name] === "number" ? null : new Error(`${name} must be a number`),
  onVolumeChange: (props, name) => typeof props[name] === "function" ? null : new Error(`${name} must be a function`),
};

export default VolumeMenu;
