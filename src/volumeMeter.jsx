import { useEffect, useRef } from "react";

const MicrophoneDecibelMeter = ({ onDecibelUpdate }) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    let audioStream = null;

    const setupMicrophone = async () => {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;

        const source =
          audioContextRef.current.createMediaStreamSource(audioStream);
        source.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        intervalIdRef.current = setInterval(analyzeAudio, 50);
      } catch (error) {
        console.error("Microphone access error:", error);
      }
    };

    const analyzeAudio = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
        const average = sum / dataArrayRef.current.length;

        const decibelValue = parseFloat(average.toFixed(2));

        if (onDecibelUpdate) {
          onDecibelUpdate(decibelValue);
        }
      }
    };

    setupMicrophone();

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);
};

export default MicrophoneDecibelMeter;
