import {songsList} from '../data/songs.js';
import PlayInfo from './play-info.js';
import TrackBar from './track-bar.js';
const Playlist = (_=>{
//data

let songs = songsList;
let currentlyPlayingIndex = 0;
let currentSong = new Audio(songs[currentlyPlayingIndex].url);


//cache de DOM
const  playlistEl = document.querySelector(".playlist");


const init =_=>{
    render();
    listeners();
    PlayInfo.setState({
        songsLength: songs.length,
        isPlaying: !currentSong.paused
    })
}

const flip = _ =>{
    togglePlayPause();
    render();
}

const changeAudioSrc = _ =>{
    currentSong.src = songs[currentlyPlayingIndex].url;
}
const togglePlayPause = _ =>{
    return currentSong.paused ? currentSong.play():currentSong.pause();
}
const mainPlay = clickedIndex=>{
if(currentlyPlayingIndex===clickedIndex){
    //toggle play or pause
    togglePlayPause();
    }else{
        currentlyPlayingIndex=clickedIndex;
        changeAudioSrc();
        togglePlayPause();
}
    PlayInfo.setState({
    songsLength: songs.length,
    isPlaying: !currentSong.paused
})
}

const playNext = _=>{
    if(songs[currentlyPlayingIndex+1]){
    currentlyPlayingIndex++;
    changeAudioSrc();
    togglePlayPause();
    render();
    }else{
        console.log("last song");
    }
}

const listeners = _ =>{
 //1.get the index of the li tag
 //2. change the currentplaying index to index of the li tag
 //3.play or pause
 //4.if it s not the same song , then change the src to that new song after changing the current playing index
 playlistEl.addEventListener("click",event =>{
     if(event.target && event.target.matches(".fa")){
         const listElem = event.target.parentNode.parentNode;
        const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);
         mainPlay(listElemIndex);
         render();
     }
 })
currentSong.addEventListener("timeupdate", _=>{
    TrackBar.setState(currentSong);
})
 currentSong.addEventListener("ended",_=>{
    //play next
    playNext();
 })

}

const render = _ =>{
    let markup=``;
    const toggleIcon = (itemIndex)=>{
        if(currentlyPlayingIndex===itemIndex){
            return currentSong.paused ? 'fa-play' : 'fa-pause';
        }else{
            return 'fa-music';
        }
    }
    songs.forEach((songObj,index)=>{
        markup+=`<li class="playlist__song ${index === currentlyPlayingIndex ? 'playlist__song--active' : ''}">
        <div class="play-pause">
          <i class="fa ${toggleIcon(index)} pp-icon"></i>
        </div>
        <div class="playlist__song-details">
          <span class="playlist__song-name">${songObj.title}</span>
          <br>
          <span class="playlist__song-artist">${songObj.artist}</span>
        </div>
        <div class="playlist__song-duration">
         ${songObj.time}
        </div>
      </li>`;
    })
    playlistEl.innerHTML=markup;
}

    return {
        init,
        flip
    }
})();


export default Playlist;