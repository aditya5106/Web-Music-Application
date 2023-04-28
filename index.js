const cardsContainer = document.querySelector(".video-container");
const searchInput = document.querySelector("#input-music");
let playpause_btn = document.querySelector(".playpause-track");
let seek_slider = document.querySelector(".seek_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let music_cover = document.querySelector(".cover-img");
let music_title = document.querySelector("#title");
let middle = document.querySelector(".middle");
let curr_track = document.createElement('audio');

let isPlaying = false;
var Music_index = 0;
var Musiclist;
let updateTimer;
let indexCount = 24;


function show(searchValue) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0b37c077bamsh11ebd2f4e63edddp1f185djsnc1d1cf50124d',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    searchValue = (searchValue === undefined) ? "arijit singh" : searchValue;

    fetch(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${searchValue}&index=${indexCount}`, options)
        .then(response => response.json())
        .then(response => ShowMusicList(response))
        .catch(err => console.error(err));

   

    let dataStore = "";
    function ShowMusicList(music) {
        Musiclist = music;
        for (let key in music.data) {
            dataStore +=
                ` <div class="video-content-cover">
                    <div class="video-content">
                            <a href="#" class="video-box">
                               <img src="${music.data[key].album.cover_big}" alt="" style="border-radius: 5px;">
                               <div class="middle">
                                    <i class="fa fa-play-circle fa-3x" onclick="changeTrack(${key})" style="color: white;"></i>
                               </div>
                            </a>
                        <div class="video-details">
                             <h4 id='title' style="margin: 0px; width: 100%;">${music.data[key].title} 
                                    <div id='subtitle'>${music.data[key].artist.name}</div>
                             </h4>
                        </div>
                    </div>
                </div>
            `}
        cardsContainer.innerHTML = dataStore;
        loadTrack(Music_index, music);
    }
}


function SearchMusic() {
    if(document.forms['frm'].question.value === ""){
        alert("Please Enter artist name");
    }else{
        show(searchInput.value);
         cardsContainer.innerHTML = ' ';
    }
    
}

function changeTrack(num) {
    loadTrack(num, Musiclist);

     curr_track.play();
    isPlaying = true;

    // Replace icon with the pause icon
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-3x" style="color:white"></i>';
}

function loadTrack(index, music) {
    music_cover.src = music.data[index].album.cover;
    music_cover.style.visibility = "visible";
    music_title.innerHTML = music.data[index].title;
    // Clear the previous seek timer
    clearInterval(updateTimer);
    resetValues();

    // Load a new track
    curr_track.src = music.data[index].preview;
    curr_track.load();

    // Set an interval of 1000 milliseconds
    // for updating the seek slider
    updateTimer = setInterval(seekUpdate, 1000);
}


function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playpauseTrack() {
    // Switch between playing and pausing
    // depending on the current state
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    // Play the loaded track
    curr_track.play();
    isPlaying = true;

    // Replace icon with the pause icon
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-3x" style="color:white"></i>';
}

function pauseTrack() {
    // Pause the loaded track
    curr_track.pause();
    isPlaying = false;

    // Replace icon with the play icon
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-3x" style="color:white"></i>';
}

function nextTrack() {
    Music_index += 1;

    // Load and play the new track
    loadTrack(Music_index, Musiclist);
    playTrack();
}

function prevTrack() {
    Music_index -= 1;

    // Load and play the new track
    loadTrack(Music_index, Musiclist);
    playTrack();
}

function seekTo() {
    // Calculate the seek position by the
    // percentage of the seek slider
    // and get the relative duration to the track
    seekto = curr_track.duration * (seek_slider.value / 100);

    // Set the current track position to the calculated seek position
    curr_track.currentTime = seekto;
}

function seekUpdate() {
    let seekPosition = 0;

    // Check if the current track duration is a legible number
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        // Display the updated duration
        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}