(function() {
    function SongPlayer() {
        var SongPlayer = {};
        /**
        * @desc song object currently playing
        * @type {Object}
        */
        var currentSong = null;
        
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
            //if the currently playing song is not the song clicked, stop the song
            if(currentBuzzObject){
                currentBuzzObject.stop();
                currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            //set newly chosen song as current
            currentSong = song;
        };
        /**
        * @function playSong
        * @description Plays the audio file that is set as the currentBuzzObject and updates boolean
        * @param {Object} song
        */
        var playSong = function(song){
            currentBuzzObject.play();
            song.playing = true;
        }
        /**
        *@function play
        *@description Creates a new Buzz object and calls play method on object
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            //if the currently playing song is not the song clicked
            if (currentSong !== song) {
                setSong(song);
                //play song
                playSong(song);
                
            //if currently playing song is the song clicked
            } else if (currentSong === song){
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
            currentBuzzObject.pause();
            song.playing = false;
        }
        
        return SongPlayer;
    }
 
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();