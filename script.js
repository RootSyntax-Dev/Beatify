document.addEventListener("DOMContentLoaded", () => {
  // State management
  const state = {
    songs: [],
    playlists: [],
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
  const songTitleEl = document.getElementById("song-title");
  const volumeSlider = document.getElementById("volume");
  const volumeIcon = document.getElementById("volume-icon").querySelector("i");

  // Views
  const mainContent = document.getElementById("mainContent");
  const searchBox = document.getElementById("searchBox");
  const artistSongsSection = document.getElementById("artistSongsSection");
  const playlistViewSection = document.getElementById("playlistViewSection");

  // Left Panel
  const homeBtn = document.getElementById("homeBtn");
  const openSearchBtn = document.getElementById("openSearchBtn");

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
    renderAllSongsInLibrary();
    renderArtists();
    renderPlaylistsInLibrary();
    loadSong(state.currentSongIndex);
    setupEventListeners();
  }

  // --- VIEW MANAGEMENT ---
  function showView(viewToShow) {
    [mainContent, searchBox, artistSongsSection, playlistViewSection].forEach(
      (view) => {
        if (view.id === viewToShow) {
          view.classList.remove("hidden");
        } else {
          view.classList.add("hidden");
        }
      }
    );
    if (leftPanel.classList.contains("open")) {
      leftPanel.classList.remove("open");
    }
  }

  // --- AUDIO PLAYER LOGIC ---
  function loadSong(index) {
    state.currentSongIndex = index;
    const song = state.songs[index];
    audio.src = `songs/${song.file}`;
    songTitleEl.textContent = `${song.title} - ${song.artist}`;
    updatePlaylistUI(index);
  }

  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    updatePlayButton();
  }

  function updatePlayButton() {
    if (state.isPlaying) {
      playIcon.classList.remove("fa-play");
      playIcon.classList.add("fa-pause");
    } else {
      playIcon.classList.add("fa-play");
      playIcon.classList.remove("fa-pause");
    }
  }

  function playSongByIndex(index) {
    loadSong(index);
    state.isPlaying = true;
    audio.play();
    updatePlayButton();
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
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // --- UI RENDERING ---
  function renderAllSongsInLibrary() {
    playListContainer.innerHTML = "";
    state.songs.forEach((song, index) => {
      const li = document.createElement("li");
      li.className = "songItem";
      li.textContent = `${song.title} - ${song.artist}`;
      li.dataset.songIndex = index;

      li.addEventListener("click", () => playSongByIndex(index));

      li.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        state.contextMenuSongId = song.id;
        showContextMenu(e.pageX, e.pageY);
      });
      playListContainer.appendChild(li);
    });
  }

  function renderArtists() {
    artistCardsContainer.innerHTML = "";
    artists.forEach((artist) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<img src="${artist.image}" alt="${artist.name}" /><h2>${artist.name}</h2><p>${artist.tagline}</p>`;
      card.addEventListener("click", () => showArtistSongs(artist));
      artistCardsContainer.appendChild(card);
    });
  }

  function updatePlaylistUI(activeIndex) {
    Array.from(playListContainer.children).forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
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
    } else {
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
    audio.addEventListener("timeupdate", () => {
      progress.value = audio.currentTime;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    progress.addEventListener(
      "input",
      () => (audio.currentTime = progress.value)
    );

    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value;
      if (audio.volume === 0) volumeIcon.className = "fas fa-volume-mute";
      else if (audio.volume < 0.5) volumeIcon.className = "fas fa-volume-down";
      else volumeIcon.className = "fas fa-volume-up";
    });

    // Navigation
    homeBtn.addEventListener("click", () => showView("mainContent"));
    openSearchBtn.addEventListener("click", () => showView("searchBox"));
    searchInput.addEventListener("input", (e) => filterResults(e.target.value));

    // Artist Carousel
    carouselNext.addEventListener("click", () => {
      artistCardsContainer.scrollBy({
        left: artistCardsContainer.clientWidth,
        behavior: "smooth",
      });
    });
    carouselPrev.addEventListener("click", () => {
      artistCardsContainer.scrollBy({
        left: -artistCardsContainer.clientWidth,
        behavior: "smooth",
      });
    });

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
});
