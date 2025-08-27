document.addEventListener("DOMContentLoaded", () => {
  // State management
  const state = {
    songs: [],
    playlists: [],
    recentlyPlayed: [],
    currentSongIndex: 0,
    isPlaying: false,
    contextMenuSongId: null,
  };

  // DOM Elements
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const progress = document.getElementById("progress");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const playListContainer = document.getElementById("playList");
  const volumeSlider = document.getElementById("volume");
  const volumeIcon = document.getElementById("volume-icon").querySelector("i");

  // Playbar Info Elements
  const songTitleEl = document.getElementById("song-title");
  const songArtistEl = document.getElementById("song-artist");
  const songCoverEl = document.getElementById("song-cover");

  // Views
  const mainContent = document.getElementById("mainContent");
  const searchBox = document.getElementById("searchBox");
  const artistSongsSection = document.getElementById("artistSongsSection");
  const playlistViewSection = document.getElementById("playlistViewSection");

  // Left Panel & Navigation
  const homeBtn = document.getElementById("homeBtn");
  const openSearchBtn = document.getElementById("openSearchBtn");
  const backBtn = document.getElementById("backBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const songListHeader = document.querySelector(".songList h4");

  // Artist Elements
  const artistCardsContainer = document.getElementById("artistCardsContainer");
  const carouselPrev = document.getElementById("carouselPrev");
  const carouselNext = document.getElementById("carouselNext");

  // Search Elements
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Playlist Elements
  const addPlaylistBtn = document.getElementById("add-playlist-btn");
  const createPlaylistModal = document.getElementById("createPlaylistModal");
  const createPlaylistForm = document.getElementById("createPlaylistForm");
  const playlistsListContainer = document.getElementById("playlistsList");

  // Context Menu
  const contextMenu = document.getElementById("contextMenu");
  const playlistSubmenu = document.getElementById("playlistSubmenu");

  // Responsive
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const leftPanel = document.querySelector(".left");
  const closeLibraryBtn = document.querySelector(".close-library-btn");

  // --- DATA INITIALIZATION ---
  function initializeApp() {
    state.songs = [...songs];
    loadPlaylists();
    loadRecentlyPlayed();
    renderArtists();
    renderPlaylistsInLibrary();
    renderRecentlyPlayed();
    if (state.songs.length > 0) {
      loadSong(0);
    }
    setupEventListeners();

    // Initial state for history
    history.replaceState({ view: "mainContent" }, "", "#mainContent");
    updateNavButtons();
  }

  // --- VIEW MANAGEMENT & NAVIGATION ---
  function showView(viewToShow, addToHistory = true) {
    [mainContent, searchBox, artistSongsSection, playlistViewSection].forEach(
      (view) => {
        view.classList.toggle("hidden", view.id !== viewToShow);
      }
    );

    if (addToHistory) {
      history.pushState({ view: viewToShow }, "", `#${viewToShow}`);
    }
    updateNavButtons();

    if (leftPanel.classList.contains("open")) {
      leftPanel.classList.remove("open");
    }
  }

  function updateNavButtons() {
    // This requires a more complex history management than just back/forward buttons
    // For now, we disable them as the browser handles the history stack
    backBtn.classList.toggle("disabled", history.length <= 1);
    forwardBtn.style.opacity = "0.3"; // Forward is harder to manage reliably
  }

  // --- AUDIO PLAYER LOGIC ---
  function loadSong(index) {
    state.currentSongIndex = index;
    const song = state.songs[index];
    if (!song) return;

    audio.src = `songs/${song.file}`;

    songTitleEl.textContent = song.title;
    songArtistEl.textContent = song.artist;

    const artist = artists.find((a) => a.id === song.artistId);
    songCoverEl.src = artist
      ? artist.image
      : "https://placehold.co/60x60/181818/b3b3b3?text=Beatify";

    updatePlaylistUI();
  }

  function togglePlay() {
    if (!audio.src || audio.src.endsWith("#")) {
      if (state.songs.length > 0) playSongByIndex(0);
      else return;
    }
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    updatePlayButton();
  }

  function updatePlayButton() {
    playIcon.classList.toggle("fa-play", !state.isPlaying);
    playIcon.classList.toggle("fa-pause", state.isPlaying);
  }

  function playSongByIndex(index) {
    loadSong(index);
    state.isPlaying = true;
    audio.play();
    updatePlayButton();

    // Recently Played Logic
    const songId = state.songs[index].id;
    addSongToRecentlyPlayed(songId);
  }

  function prevSong() {
    const newIndex =
      (state.currentSongIndex - 1 + state.songs.length) % state.songs.length;
    playSongByIndex(newIndex);
  }

  function nextSong() {
    const newIndex = (state.currentSongIndex + 1) % state.songs.length;
    playSongByIndex(newIndex);
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function updateProgressBar() {
    const current = audio.currentTime;
    const duration = audio.duration;
    if (!isNaN(duration)) {
      const percent = (current / duration) * 100;
      progress.value = current;

      // 👇 ye line add kar
      progress.style.setProperty("--value-percent", `${percent}%`);

      currentTimeEl.textContent = formatTime(current);
      durationEl.textContent = formatTime(duration);
    }
  }

  function updateVolumeBar() {
    const percent = volumeSlider.value * 100;

    // 👇 ye line add kar
    volumeSlider.style.setProperty("--value-percent", `${percent}%`);
  }

  // --- UI RENDERING ---

  function renderArtists() {
    artistCardsContainer.innerHTML = "";
    artists.forEach((artist) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
      <img src="${artist.image}" alt="${artist.name}" />
      <div class="artist-info">
        <h2>${artist.name}</h2>
        <p>${artist.tagline}</p>
      </div>
    `;
      card.addEventListener("click", () => showArtistSongs(artist));
      artistCardsContainer.appendChild(card);
    });
  }

  function updatePlaylistUI() {
    const currentSongId = state.songs[state.currentSongIndex]?.id;
    if (!currentSongId) return;

    Array.from(playListContainer.children).forEach((item) => {
      const songId = parseInt(item.dataset.songId);
      item.classList.toggle("active", songId === currentSongId);
    });
  }

  function createSongItemHTML(song, artistImage) {
    return `
            <img src="${artistImage}" alt="cover" />
            <div class="info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <i class="fas fa-play play-icon"></i>
        `;
  }

  function showArtistSongs(artist) {
    const artistSongs = state.songs.filter(
      (song) => song.artistId === artist.id
    );
    artistSongsSection.innerHTML = `
            <div class="song-list-header">
                <img src="${artist.image}" alt="${artist.name}">
                <div class="info">
                    <p>Artist</p>
                    <h1>${artist.name}</h1>
                </div>
            </div>
            <div class="song-list-view">
                ${
                  artistSongs.length > 0
                    ? artistSongs
                        .map(
                          (song) => `
                    <div class="songItem" data-song-id="${song.id}">
                        ${createSongItemHTML(song, artist.image)}
                    </div>
                `
                        )
                        .join("")
                    : "<p>No songs found for this artist.</p>"
                }
            </div>
        `;

    artistSongsSection.querySelectorAll(".songItem").forEach((item) => {
      item.addEventListener("click", () => {
        const songId = parseInt(item.dataset.songId);
        const songIndex = state.songs.findIndex((s) => s.id === songId);
        if (songIndex !== -1) playSongByIndex(songIndex);
      });
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        state.contextMenuSongId = parseInt(item.dataset.songId);
        showContextMenu(e.pageX, e.pageY);
      });
    });
    showView("artistSongsSection");
  }

  // --- RECENTLY PLAYED ---
  function loadRecentlyPlayed() {
    const recent = localStorage.getItem("beatifyRecentlyPlayed");
    state.recentlyPlayed = recent ? JSON.parse(recent) : [];
  }

  function saveRecentlyPlayed() {
    localStorage.setItem(
      "beatifyRecentlyPlayed",
      JSON.stringify(state.recentlyPlayed)
    );
  }

  function addSongToRecentlyPlayed(songId) {
    // Remove if it already exists to move it to the top
    state.recentlyPlayed = state.recentlyPlayed.filter((id) => id !== songId);
    // Add to the beginning
    state.recentlyPlayed.unshift(songId);
    // Limit to 15 songs
    state.recentlyPlayed = state.recentlyPlayed.slice(0, 15);
    saveRecentlyPlayed();
    renderRecentlyPlayed();
  }

  function renderRecentlyPlayed() {
    playListContainer.innerHTML = "";
    songListHeader.textContent = "Recently Played";
    if (state.recentlyPlayed.length === 0) {
      playListContainer.innerHTML = "<li>No recently played songs.</li>";
      return;
    }

    state.recentlyPlayed.forEach((songId) => {
      const song = state.songs.find((s) => s.id === songId);
      if (song) {
        const li = document.createElement("li");
        li.className = "songItem";
        li.textContent = `${song.title} - ${song.artist}`;
        li.dataset.songId = song.id;

        li.addEventListener("click", () => {
          const songIndex = state.songs.findIndex((s) => s.id === songId);
          if (songIndex !== -1) playSongByIndex(songIndex);
        });
        li.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          state.contextMenuSongId = song.id;
          showContextMenu(e.pageX, e.pageY);
        });
        playListContainer.appendChild(li);
      }
    });
    updatePlaylistUI();
  }

  // --- SEARCH LOGIC ---
  function filterResults(query) {
    const lowerCaseQuery = query.toLowerCase();
    const filteredSongs = state.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerCaseQuery) ||
        song.artist.toLowerCase().includes(lowerCaseQuery)
    );

    searchResults.innerHTML = "";
    if (filteredSongs.length > 0) {
      filteredSongs.forEach((song) => {
        const artist = artists.find((a) => a.id === song.artistId) || {
          image: "Logo/Beatify-Logo-Rounded.png",
        };
        const songItem = document.createElement("div");
        songItem.className = "songItem";
        songItem.innerHTML = createSongItemHTML(song, artist.image);
        songItem.addEventListener("click", () => {
          const songIndex = state.songs.findIndex((s) => s.file === song.file);
          if (songIndex !== -1) playSongByIndex(songIndex);
          showView("mainContent");
        });
        searchResults.appendChild(songItem);
      });
    } else {
      searchResults.innerHTML =
        '<p style="text-align:center; padding: 20px;">No results found.</p>';
    }
  }

  // --- PLAYLIST LOGIC ---
  function loadPlaylists() {
    state.playlists =
      JSON.parse(localStorage.getItem("beatifyPlaylists")) || [];
  }

  function savePlaylists() {
    localStorage.setItem("beatifyPlaylists", JSON.stringify(state.playlists));
  }

  function renderPlaylistsInLibrary() {
    playlistsListContainer.innerHTML = "";
    state.playlists.forEach((playlist) => {
      const li = document.createElement("li");
      li.textContent = playlist.name;
      li.dataset.playlistId = playlist.id;
      li.addEventListener("click", () => showPlaylistView(playlist.id));
      playlistsListContainer.appendChild(li);
    });
  }

  function createPlaylist(name) {
    const newPlaylist = {
      id: Date.now(),
      name: name,
      songs: [], // Array of song IDs
    };
    state.playlists.push(newPlaylist);
    savePlaylists();
    renderPlaylistsInLibrary();
  }

  function addSongToPlaylist(songId, playlistId) {
    const playlist = state.playlists.find((p) => p.id === playlistId);
    if (playlist && !playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      savePlaylists();
      alert(`Song added to ${playlist.name}`);
    } else if (playlist) {
      alert("Song is already in this playlist.");
    }
  }

  function showPlaylistView(playlistId) {
    const playlist = state.playlists.find((p) => p.id === playlistId);
    if (!playlist) return;

    const playlistSongs = playlist.songs
      .map((songId) => state.songs.find((s) => s.id === songId))
      .filter(Boolean);

    playlistViewSection.innerHTML = `
            <div class="song-list-header">
                <div class="info">
                    <p>Playlist</p>
                    <h1>${playlist.name}</h1>
                </div>
            </div>
            <div class="song-list-view">
                ${
                  playlistSongs.length > 0
                    ? playlistSongs
                        .map((song) => {
                          const artist = artists.find(
                            (a) => a.id === song.artistId
                          ) || { image: "Logo/Beatify-Logo-Rounded.png" };
                          return `<div class="songItem" data-song-id="${
                            song.id
                          }">${createSongItemHTML(song, artist.image)}</div>`;
                        })
                        .join("")
                    : "<p>This playlist is empty. Right-click on a song to add it.</p>"
                }
            </div>
        `;

    playlistViewSection.querySelectorAll(".songItem").forEach((item) => {
      item.addEventListener("click", () => {
        const songId = parseInt(item.dataset.songId);
        const songIndex = state.songs.findIndex((s) => s.id === songId);
        if (songIndex !== -1) playSongByIndex(songIndex);
      });
    });
    showView("playlistViewSection");
  }

  // --- CONTEXT MENU LOGIC ---
  function showContextMenu(x, y) {
    playlistSubmenu.innerHTML = "";
    if (state.playlists.length > 0) {
      state.playlists.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = p.name;
        li.addEventListener("click", () => {
          addSongToPlaylist(state.contextMenuSongId, p.id);
          hideContextMenu();
        });
        playlistSubmenu.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "No playlists available";
      li.style.pointerEvents = "none";
      playlistSubmenu.appendChild(li);
    }

    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.remove("hidden");
  }

  function hideContextMenu() {
    contextMenu.classList.add("hidden");
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    playBtn.addEventListener("click", togglePlay);
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);

    audio.addEventListener("ended", nextSong);
    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
      progress.max = audio.duration;
    });
    audio.addEventListener("timeupdate", updateProgressBar);
    audio.addEventListener("loadedmetadata", updateProgressBar);

    progress.addEventListener(
      "input",
      () => (audio.currentTime = progress.value)
    );

    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value;
      updateVolumeBar(); // 👈 fill update karega

      if (audio.volume === 0) volumeIcon.className = "fas fa-volume-mute";
      else if (audio.volume < 0.5) volumeIcon.className = "fas fa-volume-down";
      else volumeIcon.className = "fas fa-volume-up";
    });

    // Navigation
    homeBtn.addEventListener("click", () => showView("mainContent"));
    openSearchBtn.addEventListener("click", () => showView("searchBox"));
    searchInput.addEventListener("input", (e) => filterResults(e.target.value));

    backBtn.addEventListener("click", () => history.back());
    forwardBtn.addEventListener("click", () => history.forward());
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.view) {
        showView(e.state.view, false);
      }
    });

    // Artist Carousel
    // In buttons ko comment kar diya gaya hai kyunki yeh HTML mein maujood nahi hain aur error de rahe the.
    /*
    carouselNext.addEventListener("click", () => {
      artistCardsContainer.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    });
    carouselPrev.addEventListener("click", () => {
      artistCardsContainer.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    });
    */

    // Playlist Creation
    addPlaylistBtn.addEventListener(
      "click",
      () =>
        (document.getElementById("createPlaylistModal").style.display = "flex")
    );
    document
      .querySelector('.close-button[data-modal="createPlaylistModal"]')
      .addEventListener(
        "click",
        () =>
          (document.getElementById("createPlaylistModal").style.display =
            "none")
      );
    createPlaylistForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const playlistName = document.getElementById("playlistName").value.trim();
      if (playlistName) {
        createPlaylist(playlistName);
        createPlaylistForm.reset();
        document.getElementById("createPlaylistModal").style.display = "none";
      }
    });

    // Context Menu
    document.addEventListener("click", hideContextMenu);

    // Responsive
    hamburgerMenu.addEventListener("click", () =>
      leftPanel.classList.add("open")
    );
    closeLibraryBtn.addEventListener("click", () =>
      leftPanel.classList.remove("open")
    );
  }

  initializeApp();
  updateVolumeBar();
});
