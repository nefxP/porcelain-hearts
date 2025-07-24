document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const musicListElement = document.getElementById("music-list");
  const audioPlayer = document.getElementById("audio-player");
  const trackTitle = document.getElementById("track-title");
  const volumeSlider = document.getElementById("volume-slider");
  const progressSlider = document.getElementById("progress-slider");
  const muteBtn = document.getElementById("mute-btn");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const backgroundContainer = document.getElementById("background-container");

  let currentTrackIndex = null;
  let backgroundIndex = 0;
  let musicList = [];
  let backgroundImages = [];

  // get music list from backend
  fetch("/api/music")
    .then(response => response.json())
    .then(data => {
      musicList = data;

      musicList.forEach((track, index) => {
        const li = document.createElement("li");
        li.textContent = track.title;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          playTrack(index);
          updateActiveTrack(index);
        });
        musicListElement.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Müzik listesi alınamadı:", error);
    });

  // active song list in list
  function updateActiveTrack(index) {
    const lis = musicListElement.querySelectorAll("li");
    lis.forEach((li, i) => {
      if (i === index) li.classList.add("active");
      else li.classList.remove("active");
    });
  }

  // play the song
  function playTrack(index) {
    const track = musicList[index];
    audioPlayer.src = `/music/${track.file}`;
    audioPlayer.play();
    trackTitle.textContent = track.title;
    currentTrackIndex = index;
  }

  // slider and mute buttons
  volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
    if (audioPlayer.volume === 0) {
      muteBtn.textContent = "🔇";
    } else {
      muteBtn.textContent = "🔈";
    }
  });

  muteBtn.addEventListener("click", () => {
    if (audioPlayer.muted) {
      audioPlayer.muted = false;
      muteBtn.textContent = "🔈";
      volumeSlider.value = audioPlayer.volume;
    } else {
      audioPlayer.muted = true;
      muteBtn.textContent = "🔇";
      volumeSlider.value = 0;
    }
  });

  // progress bar
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      progressSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
  });

  // prgoress bar jump
  progressSlider.addEventListener("input", () => {
    if (!isNaN(audioPlayer.duration)) {
      audioPlayer.currentTime = (progressSlider.value / 100) * audioPlayer.duration;
    }
  });

  // Play / Pause button
  playPauseBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.textContent = "⏸️";
    } else {
      audioPlayer.pause();
      playPauseBtn.textContent = "▶️";
    }
  });

  // set button icon
  audioPlayer.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸️";
  });

  audioPlayer.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶️";
  });

  // get images from backend
  fetch("/api/backgrounds")
    .then(response => response.json())
    .then(images => {
      backgroundImages = images;
      if (backgroundImages.length > 0) {
        changeBackground();
        setInterval(changeBackground, 10000);
      }
    })
    .catch(error => {
      console.error("Arkaplan görselleri alınamadı:", error);
    });

  // change bg function
  function changeBackground() {
    if (backgroundImages.length === 0) return;
    backgroundContainer.style.backgroundImage = `url('${backgroundImages[backgroundIndex]}')`;
    backgroundIndex = (backgroundIndex + 1) % backgroundImages.length;
  }
});
