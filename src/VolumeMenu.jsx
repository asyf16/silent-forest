import { useEffect, useRef, useState } from "react";
import { FaCheck, FaLeaf, FaTimes, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import "./VolumeMenu.css";

// Replace these files (or paths) when the three songs are ready.
const songs = [
  { name: "Forest Lo-Fi", src: "/music/bgm.mp3" },
  { name: "Jazzy Leaves", src: "/music/bgm2.mp3" },
  { name: "Soft Piano", src: "/music/bgm3.mp3" },
  { name: "24/7 lofi cafe", embed: "https://loficafe.net/embed/studying" },
];

function VolumeMenu({ soundOn, onSoundChange }) {
  const audioRef = useRef(null);
  const [selectedSong, setSelectedSong] = useState(0);
  const selectedTrack = songs[selectedSong];

  useEffect(() => {
    if (!soundOn || selectedTrack.embed) return;
    const audio = audioRef.current;
    // Empty song slots stay silent until their files are added.
    audio.play().catch(() => {});
    return () => {
      audio.pause();
    };
  }, [soundOn, selectedTrack]);

  useEffect(() => {
    audioRef.current.volume = 0.5;
  }, []);

  return (
    <div className="volume-menu">
      <audio ref={audioRef} src={selectedTrack.src} loop preload="none" />
      <button
        type="button"
        className="volume-trigger"
        popovertarget="volume-popup"
        aria-label="Open sound settings"
        title="Forest sounds"
      >
        {soundOn ? <FaVolumeUp aria-hidden="true" /> : <FaVolumeMute aria-hidden="true" />}
      </button>
      <section id="volume-popup" className="volume-popup" popover="auto" aria-labelledby="volume-title">
        <div className="volume-heading">
          <FaLeaf aria-hidden="true" />
          <h2 id="volume-title">Forest sounds</h2>
          <button
            type="button"
            className="volume-mute"
            aria-label={soundOn ? "Mute all sounds" : "Unmute all sounds"}
            aria-pressed={!soundOn}
            title={soundOn ? "Mute" : "Unmute"}
            onClick={() => onSoundChange(!soundOn)}
          >
            {soundOn ? <FaVolumeUp aria-hidden="true" /> : <FaVolumeMute aria-hidden="true" />}
          </button>
          <button type="button" className="volume-close" popovertarget="volume-popup" popovertargetaction="hide" aria-label="Close sound settings">
            <FaTimes aria-hidden="true" />
          </button>
        </div>
        <fieldset className="volume-songs" aria-label="Background song">
          {songs.map((song, index) => (
            <label className="volume-song" key={song.src || song.embed}>
              <input type="radio" name="forest-song" value={index} checked={selectedSong === index} onChange={() => setSelectedSong(index)} />
              <span>{song.name}</span>
              <FaCheck aria-hidden="true" />
            </label>
          ))}
        </fieldset>
        {selectedTrack.embed && (
          soundOn ? (
            <iframe
              className="volume-radio"
              title="24/7 Lofi Cafe radio player"
              src={selectedTrack.embed}
              height="80"
              allow="autoplay"
            />
          ) : (
            <p className="volume-radio-hint">Unmute to load the radio, then press play.</p>
          )
        )}
      </section>
    </div>
  );
}

// Keep the control contract checked without an additional runtime dependency.
VolumeMenu.propTypes = {
  soundOn: (props, name) => typeof props[name] === "boolean" ? null : new Error(`${name} must be a boolean`),
  onSoundChange: (props, name) => typeof props[name] === "function" ? null : new Error(`${name} must be a function`),
};

export default VolumeMenu;
