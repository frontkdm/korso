function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}(function () {
  console.log('Lazyload is ready');
})();

(function () {

  if ($('.slide').length > 1) {
    $('.slider-controls').css({ display: 'flex' });
    var topSlider = $('.top-slider').slick({
      arrows: false,
      dots: false,
      slidesToScroll: 1,
      slidesToShow: 1,
      fade: true,
      lazyLoad: 'ondemand' });

  }

  var rowSlider = $('.row-slider').slick({
    arrows: false,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
    {
      breakpoint: 840,
      settings: {
        slidesToShow: 2 } },


    {
      breakpoint: 580,
      settings: {
        slidesToShow: 1 } }] });





  var mainSlider = $('.video-slider').slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1 });


  $('.slider-controls').click(function (e) {
    var target = e.target.dataset.move;
    $(this).
    parent().
    children('.page-slider').
    slick("slick".concat(target));
  });

  var body = $('body');
  var drawer = $('.drawer');
  $('.header-menu').click(function () {
    body.addClass('noflow');
    drawer.addClass('open');
  });

  var closeDrawer = $('.drawer-close');
  closeDrawer.click(function () {
    body.removeClass('noflow');
    drawer.removeClass('open');
  });

  $(document).on('click', 'a[href^="#"]', function (e) {
    var id = $(this).attr('href');
    var $id = $(id);
    if ($id.length === 0) {
      return;
    }
    var pos = $id.offset().top;

    e.preventDefault();

    body.removeClass('noflow');
    drawer.removeClass('open');
    $('body, html').animate({ scrollTop: pos }, 1500);
  });

  $(document).keyup(function (e) {
    if (e.key === 'Escape') {
      body.removeClass('noflow');
      $('.modal').removeClass('show');
      // $('.modal').removeClass('show')
      $('.modal-form').trigger('reset');
    }
  });

  var timer;
  function detectScroll(e) {
    clearTimeout(timer);
    if (!$('body').has('disable-hover')) {
      $('body').addClass('disable-hover');
    }

    timer = setTimeout(function () {
      $('body').removeClass('disable-hover');
    }, 200);

  }

  $(window).scroll(detectScroll);

  $(document).click(function (e) {
    var target = e.target.classList[0];
    if (target === 'modal') {
      body.removeClass('noflow');
      $('.modal').removeClass('show');
    }
  });

  $('.btn-modal').click(function (e) {
    var formType = $(this).data('modal-type');
    body.addClass('noflow');
    $('.modal').addClass('show');

    console.log(formType);
  });

  console.log('The main script is ready');
})();


(function () {

  // Аудио проигрыватель
  var playerRange = $('.player-range');
  var tracks = [
  {
    id: 0,
    title: "Higher lies",
    cover_url: "./images/covers/paraphine_higher_hies.jpg",
    audio_src: "./tracks/Paraphine - Good Times.mp3" },

  {
    id: 1,
    title: "Say it out loud",
    cover_url: "./images/covers/paraphine_say_it_out_loud.jpg",
    audio_src: "./tracks/Paraphine - Say It Out Loud.mp3" }];





  var audio = new Audio();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  $('.player-controls').on('click', function (e) {
    var control = e.target.dataset.control;
    switch (control) {
      case 'play':
        audioPlay();
        break;
      case 'stop':
        audioStop();
        break;
      case 'pause':
        audioPause();
        break;}

  });

  $('.track-controls').click(function (e) {
    var trackId = parseInt(e.target.dataset.track);
    if (trackId >= 0) {
      var trackInfo = tracks.filter(function (track) {return track.id === trackId;});

      if (trackInfo.length) {
        setTrackInfo.apply(void 0, _toConsumableArray(trackInfo));
        $('#player').addClass('active');
      }

    }
  });

  function setTrackInfo(_ref) {var title = _ref.title,cover_url = _ref.cover_url,audio_src = _ref.audio_src;
    $('.player-image img').attr('src', cover_url);
    $('.player-info p').text(title);
    audio.src = audio_src;
    initTrack();
  }

  function initTrack() {
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    audio.play();
  }



  var canvas = $('#player-visual')[0];
  canvas.width = window.innerWidth;
  canvas.height = $('#player').height();
  var ctx = canvas.getContext('2d');

  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 256;

  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var width = canvas.width;
  var height = canvas.height;
  var barWidth = width / bufferLength * 2;
  var barHeight = 0;

  // Инициализация драг и клик евентов ползунка плеера
  playerRange.on('mousedown', function (e) {
    e.preventDefault();
    var rectWidth = e.target.getBoundingClientRect().width;

    var onMouseMove = function onMouseMove() {
      var shiftX = event.clientX - playerRange[0].getBoundingClientRect().left;
      var handPosition = parseInt(shiftX / rectWidth * 100);

      if (shiftX > rectWidth || shiftX <= 0) {return;}

      setPlayerHand(handPosition);
    };

    var onMouseUp = function onMouseUp() {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  playerRange.on('click', function (e) {
    var rectWidth = e.target.getBoundingClientRect().width;
    var shiftX = event.clientX - playerRange[0].getBoundingClientRect().left;
    var handPosition = parseInt(shiftX / rectWidth * 100);

    if (shiftX > rectWidth || shiftX < 0) {return;}

    setPlayerHand(handPosition);
  });

  playerRange.on('dragstart', function () {return false;});

  var setPlayerHand = function setPlayerHand(handPosition) {

    audio.currentTime = handPosition * audio.duration / 100;
    $('.range-handle').css({ transform: "translateX(".concat(-100 + handPosition, "%)") });


  };

  function render() {
    requestAnimationFrame(render);
    var currentTime = parseInt(audio.currentTime);
    var currentTime2 = parseInt(currentTime / Math.floor(audio.duration) * 100);
    barCount = 0;

    if (!currentTime2) return;
    $('.range-handle').css({ transform: "translateX(".concat(-100 + currentTime2, "%)") });

    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 4;
      // var r = 250 - i - 128;
      // var g = 49 - i - 128;
      // var b = 31 - i - 128;

      var r = 255;
      var g = 255;
      var b = 255;

      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(barCount, height - barHeight, barWidth, barHeight);

      barCount += barWidth + 1;
    }

  }



  var audioPlay = function audioPlay() {
    audio.play();
  };

  var audioStop = function audioStop() {
    audio.pause();
    audio.currentTime = 0;
    $('.range-handle').css({ transform: "translateX(".concat(-100 + 0, "%)") });
    $('#player').removeClass('active');
  };

  var audioPause = function audioPause() {
    audio.pause();
  };

  render();

  console.log('Init player');
})();