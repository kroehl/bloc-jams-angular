var setSong = function(songNumber){
    //if a sound is already playing, stop it.
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    //convert value to integer
    currentlyPlayingSongNumber = parseInt(songNumber);
    //retrieve array of songs from current album and get index (if song number is 5, the index will be 4) We subtract 1 because songNumbers in the DOM are not zero-based and arrays are zero-based
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    //assign Buzz sound object by passing the audio file via audioURL
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         //all of our songs are mp3s so we only include the mp3 string
         formats: [ 'mp3' ],
        //tells Buzz to load mp3s as soon as page loads 
        preload: true
     });
    
    setVolume(currentVolume);
 };
//method to change the current song's playback location
var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}
 
var setVolume = function(volume) {
    //check if sound file exists
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
 };

var setCurrentTimeInPlayerBar = function(currentTime){
    
    currentSoundFile.bind('timeupdate', function(event) {
          
        var timeOfSoundFile = currentSoundFile.getTime();
        $currentTime.text(filterTimeCode(timeOfSoundFile));
        
    });
    
   
};

// currentTime = "240"
// setCurrentTimeInPlayerBar(currentTime); // player bar now says 240
// filterTimeCode(currentTime); // 4:00
// setCurrentTimeInPlayerBar(filterTimeCode(currentTime)); // player bar now says 4:00

var setTotalTimeInPlayerBar = function(totalTime){
 
    $totalTime.text(filterTimeCode(currentSongFromAlbum.duration));
    
};


var filterTimeCode = function (timeInSeconds){
    //convert seconds to number form
    var time = parseFloat(timeInSeconds);
    
    //calc seconds to minutes
    var wholeMinutes = Math.floor(time / 60);
    //calc remainder of seconds as wholeSeconds
    var wholeSeconds = Math.floor(time % 60);
    
   
    var formattedTime = wholeMinutes+':'+wholeSeconds;
    return formattedTime;

   
};
  


var getSongNumberCell= function(number){
    // Return the element with a class of "song-item-number" and an attribute of "data-song-number" that has a value of `number`
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile === null) {
        return;
    }
    
    var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()){
        
        //change songNumberCell to pause button
        songNumberCell.html(pauseButtonTemplate);
        // Change the HTML of the player bar play button to a pause button
        $playPauseButton.html(playerBarPauseButton);
        //play the sound
        currentSoundFile.play();
    }
    
    else {
        //change songNumberCell to play button
        songNumberCell.html(playButtonTemplate);
        // Change the HTML of the player bar pause button to a play button
        $playPauseButton.html(playerBarPlayButton);
        //pause the sound
        currentSoundFile.pause();
        // we do a couple of other things
        // when we pause
    }
};

var createSongRow = function (songNumber, songName, songLength) {
    
    
    var template = 
        '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        // clickHandler called when event listener fires
        
         //debugger;
        
        //Pulling the song number value off of the attribute called "data-song-number" of the element that fired the event
        // e.g. if the number in song row 1 was clicked `this` is equal to that number.
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        // if the song that was clicked is not the one that is currently playing
        if (currentlyPlayingSongNumber !== songNumber) {
            // Set the HTML of this element (the element
            // that fired the event) to a pause button
            $(this).html(pauseButtonTemplate);
            // Set the currentlyPlayingSongNumber variable to the songNumber of the element that was clicked and set the currentSongFromAlbum equal to the clicked song number
            setSong(songNumber);
            //play the currentSoundFile
            currentSoundFile.play();
            //continuously update seek bar
            updateSeekBarWhileSongPlays();
            
            //sett CSS of vol seek to current vol
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            // update the player bar song information
            updatePlayerBarSong();
        }
        // If the song that was clicked is the one that is currently playing
        else if (currentlyPlayingSongNumber === songNumber) {
    
            //if the song is paused, play it
            if (currentSoundFile.isPaused()){
                //Change the HTML of this element to a pause button (we are playing)
                $(this).html(pauseButtonTemplate);
                // Change the HTML of the player bar play button to a pause button
                $playPauseButton.html(playerBarPauseButton);
                //play the music
                 currentSoundFile.play();
            //if the song is not paused, pause it        
            } else {
                //Change the HTML of this element to a play button (we are pausing)
                $(this).html(playButtonTemplate);
                // Change the HTML of the player bar pause button to a play button
                $playPauseButton.html(playerBarPlayButton);
                //pause the music
                currentSoundFile.pause();
                currentlyPlayingSongNumber = null;
                }
           }

        
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(playButtonTemplate);
        }
        
    };
    var offHover = function(event) {
         //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        
       
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');   
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
   
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
    }
   
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
         //timeupdate is Buzz event that fires repeatedly while time elapses during playback
        currentSoundFile.bind('timeupdate', function(event) {
             //get current time and the duration for song with Buzz methods
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};


//multiply ration by 100 to determine percentage
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    //percentage should be less more than 0 but less than 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    //convert percentage to a string
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    var $playerBar = $('.player-bar .control-group currently-playing');
    var $volumeBar = $('.playerBar .control-group volume')
 
    $seekBars.click(function(event) {
         //pagex hold the horizontal coordinate at the event
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        
        var seekBarFillRatio = offsetX / barWidth;
        
        //if this had a parent class of seek-control
        if($(this).parent().attr('class') == 'seek-control') {
            //execute seek function to seek to position of song where seekBarFillRatio x the length of song = time
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
 
        //pass this as the seekbar argument as well as the ratio
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    //find all elements with .thumb in seekBars and add event
    $seekBars.find('.thumb').mousedown(function(event) {
         //this is .thumb node clicked and the parent is whichever seek bar the node belongs to
        var $seekBar = $(this).parent();
 
         //attached mousemove to doc to ensure we can drag the node after mousing down wherever our mouse drifts on page
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
         //unbind removes previous event listeners in order for the thumb and fill to be released on mouseup
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    setCurrentTimeInPlayerBar();
    setTotalTimeInPlayerBar();
    
};

var nextSong = function (){

    //get previous song index
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    //increment. if currentIndex is last song, next song is index 0
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex +1);
    
    //play songs when skipping
    currentSoundFile.play();
    //continuously update seek bar
    updateSeekBarWhileSongPlays();
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    // decrementing the song (index)
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
  
    // Set a new current song
    setSong(currentSongIndex +1);
    //play songs when skipping
    currentSoundFile.play();
    //Continuously update seek bar
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';


var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var $playPauseButton = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $totalTime = $('.total-time');
var $currentTime = $('.current-time');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    
    //on click execure togglePlayPauseButton
    $playPauseButton.click(togglePlayFromPlayerBar);
});

    
var albums = [albumPicasso, albumMarconi, albumKing]; 
var index = 1;
        
$albumImage.addEventListener("click", function(event){       //set eventListener to each array object
    setCurrentAlbum(albums[index]);
    index++;
        
    if(index == albums.length){
        index = 0;
    }
});

