const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const playList = document.getElementById("playList");
const songTitleEl = document.getElementById("song-title");
const volumeSlider = document.getElementById("volume");
const volumeIcon = document.getElementById("volume-icon");
const mainVolumeControl = document.querySelector(".main-volume-control");

const songs = [
  { file: "Aee Jii Oo Jii.mp3", name: "Aee Jii Oo Jii" },
  { file: "Beautiful Billo.mp3", name: "Beautiful Billo" },
  { file: "Disco Singh.mp3", name: "Disco Singh" },
  { file: "Faisley.mp3", name: "Faisley" },
  { file: "Happy Birthday.mp3", name: "Happy Birthday" },
  { file: "Latto.mp3", name: "Latto" },
  { file: "Naina_Diljit_Dosanjh.mp3", name: "Naina Diljit Dosanjh" },
  { file: "Sweetoo.mp3", name: "Sweetoo" },
  { file: "128-Nasha - Raid 2 128 Kbps.mp3", name: "Nasha - Raid 2" },
  { file: "128-O Maahi - Dunki 128 Kbps.mp3", name: "O Maahi - Dunki" },
  { file: "128-Ruaan - Tiger 3 128 Kbps.mp3", name: "Ruaan - Tiger 3" },
  {
    file: "128-100 Million - Karan Aujla 128 Kbps.mp3",
    name: "100 Million - Karan Aujla",
  },
  {
    file: "128-Aaj Ki Raat - Stree 2 128 Kbps.mp3",
    name: "Aaj Ki Raat - Stree 2",
  },
  {
    file: "128-Aaj Se Teri - Padman 128 Kbps.mp3",
    name: "Aaj Se Teri - Padman",
  },
  {
    file: "128-Abrars Entry Jamal Kudu - Animal 128 Kbps.mp3",
    name: "Abrars Entry Jamal Kudu - Animal",
  },
  {
    file: "128-Arjan Vailly - Animal 128 Kbps.mp3",
    name: "Arjan Vailly - Animal",
  },
  {
    file: "128-Baarish Ke Aane Se - Shreya Ghoshal 128 Kbps.mp3",
    name: "Baarish Ke Aane Se - Shreya Ghoshal",
  },
  {
    file: "128-Chor Bazari Phir Se - Bhool Chuk Maaf 128 Kbps.mp3",
    name: "Chor Bazari Phir Se - Bhool Chuk Maaf",
  },
  {
    file: "128-Gaadi Kaali - Neha Kakkar 128 Kbps.mp3",
    name: "Gaadi Kaali - Neha Kakkar",
  },
  {
    file: "128-Hua Main - Animal 128 Kbps.mp3",
    name: "Hua Main - Animal",
  },
  {
    file: "128-Hum Toh Deewane - Yasser Desai 128 Kbps.mp3",
    name: "Hum Toh Deewane - Yasser Desai",
  },
  {
    file: "128-Ishq Jaisa Kuch - Fighter 128 Kbps.mp3",
    name: "Ishq Jaisa Kuch - Fighter",
  },
  {
    file: "128-Lutt Putt Gaya - Dunki 128 Kbps.mp3",
    name: "Lutt Putt Gaya - Dunki",
  },
  {
    file: "128-Sher Khul Gaye - Fighter 128 Kbps.mp3",
    name: "Sher Khul Gaye - Fighter",
  },
  {
    file: "128-Sooraj Hi Chhaon Banke - Salaar 128 Kbps.mp3",
    name: "Sooraj Hi Chhaon Banke - Salaar",
  },
  {
    file: "128-Tu Hain Toh Main Hoon - Sky Force 128 Kbps.mp3",
    name: "Tu Hain Toh Main Hoon - Sky Force",
  },
  {
    file: "320-Ilzaam - Jewel Thief The Heist Begins 320 Kbps.mp3",
    name: "Ilzaam - Jewel Thief The Heist Begins",
  },
  {
    file: "Hass_Hass_Diljit_Dosanjh_Sia.mp3",
    name: "Hass Hass - Diljit Dosanjh & Sia",
  },
  {
    file: "Jhol_Maanu_Annural_Khalid.mp3",
    name: "Jhol - Maanu & Annural Khalid",
  },
  {
    file: "Russian_Bandana_Dhanda_Nyoliwala.mp3",
    name: "Russian Bandana - Dhanda Nyoliwala",
  },
];

let currentSongIndex = 0;
let isPlaying = false;

// Load song
function loadSong(index) {
  currentSongIndex = index;
  audio.src = `songs/${songs[index].file}`;
  audio.load();
  updatePlayButton(false);

  // Update the song title when a new song is loaded
  if (songTitleEl) {
    songTitleEl.textContent = songs[index].name;
  }
}

// Play/pause
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    updatePlayButton(false);
  } else {
    audio.play();
    updatePlayButton(true);
  }
  isPlaying = !isPlaying;
}

// Update play button UI
function updatePlayButton(playing) {
  const playIcon = document.getElementById("play-icon");
  if (playing) {
    playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
  } else {
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
  }
}

// Previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  isPlaying = true;
  updatePlayButton(true);
  updatePlaylistUI(currentSongIndex);
}

// Next song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  isPlaying = true;
  updatePlayButton(true);
  updatePlaylistUI(currentSongIndex);
}

// Format time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

let isDraggingVolume = false;

// Update progress and time
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
  progress.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progress.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Seek
progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// Autoplay next song
audio.addEventListener("ended", nextSong);

// Playlist generate
function generatePlayList() {
  playList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${song.name}`;
    li.style.cursor = "pointer";
    li.classList.add("songItem");
    li.addEventListener("click", () => {
      loadSong(index);
      audio.play();
      isPlaying = true;
      updatePlayButton(true);
      updatePlaylistUI(index);
    });
    playList.appendChild(li);
  });
}

// Function to update the UI of the playlist (add 'active' class, etc.)
function updatePlaylistUI(activeSongIndex) {
  const listItems = playList.querySelectorAll("li.songItem");
  listItems.forEach((item, index) => {
    if (index === activeSongIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Also update the song-title element if you have one
  if (songTitleEl) {
    songTitleEl.textContent = songs[activeSongIndex].name;
  }
}

// Add event listener for volume slider (existing)
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  if (audio.volume === 0) {
    volumeIcon.textContent = "🔇";
  } else if (audio.volume < 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
});

// New JavaScript for hover behavior
mainVolumeControl.addEventListener("mouseenter", () => {});

mainVolumeControl.addEventListener("mouseleave", () => {
  if (!isDraggingVolume) {
    volumeSlider.style.width = "1";
    volumeSlider.style.opacity = "1";
  }
});

// Prevent slider from hiding while dragging
volumeSlider.addEventListener("mousedown", () => {
  isDraggingVolume = true;
  volumeSlider.style.width = "100";
  volumeSlider.style.opacity = "1";
});

volumeSlider.addEventListener("mouseup", () => {
  isDraggingVolume = false;
  volumeSlider.style.width = "1";
  volumeSlider.style.opacity = "1";
});

// Initial volume icon setup
audio.volume = volumeSlider.value;
if (audio.volume === 0) {
  volumeIcon.textContent = "🔇";
} else if (audio.volume < 0.5) {
  volumeIcon.textContent = "🔉";
} else {
  volumeIcon.textContent = "🔊";
}

// Event listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Initial setup
generatePlayList();
loadSong(currentSongIndex);
updatePlaylistUI(currentSongIndex);
