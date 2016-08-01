(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        /**
        * @desc 
        * @type
        */
        var currentAlbum = Fixtures.getAlbum();
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */        
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song){
            if(currentBuzzObject){
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            //set newly chosen song as current
            SongPlayer.currentSong = song;
        };
        /**
        * @function playSong
        * @desc Plays the audio file that is set as the currentBuzzObject and updates boolean
        * @param {Object} song
        */
        var playSong = function(song){
            currentBuzzObject.play();
            song.playing = true;
        }
        /**
        * @function getSongIndex
        * @desc
        * @param {Object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        /**
        * @function stopSong
        * @desc
        */
        var stopSong = function(song){
            currentBuzzObject.stop();
            song.playing = null;
        }
        /**
        * @desc song object currently playing
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        /*
        * @desc volume of current song
        * @type {object}
        */
        SongPlayer.volume = null;
        /**
        *@function play
        *@description Creates a new Buzz object and calls play method on object
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            //if the currently playing song is not the song clicked
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                //play song
                playSong(song);
                
            //if currently playing song is the song clicked
            } else if (SongPlayer.currentSong === song){
                //check to see if song is paused and play
                if (currentBuzzObject.isPaused()){
                    playSong(song);
                }
            }
            
        };
        /**
        *@function pause
        *@description Calls pause method on object and updates boolean
        * @param {Object} song
        */
        SongPlayer.pause = function(song){
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc
        * @param
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if(currentSongIndex < 0){
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        
        };
        
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > currentAlbum.length){
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        SongPlayer.setVolume = function (volume){
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };
        
        SongPlayer.mute = function () {
           currentBuzzObject.setVolume(0);
        };
        
        
        return SongPlayer;
    }
 
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();