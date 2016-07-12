(function() {
    function SongPlayer() {
        var SongPlayer = {};
        
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
                formats: ['mps'],
                preload: true
            });
            //set newly chosen song as current
            currentSong = song
        };
        
        SongPlayer.play = function(song) {
            //if the currently playing song is not the song clicked
            if (currentSong !== song) {
                
                setSong(song);
                //play song
                currentBuzzObject.play(); 
                song.playing = true;
            //if currently playing song is the song clicked
            } else if (currentSong === song){
                //check to see if song is paused and play
                if (currentBuzzObject.isPaused()){
                    currentBuzzObject.play();
                }
            }
            
        };
        
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