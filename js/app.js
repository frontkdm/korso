(function() {
  console.log('Lazyload is ready')
})();

(function () {
  if ($('.slide').length > 1) {
    $('.slider-controls').css({ display: 'flex' });
    const topSlider = $('.top-slider').slick({
      arrows: false,
      dots: false,
      slidesToScroll: 1,
      slidesToShow: 1,
      fade: true,
      lazyLoad: 'ondemand'
    });
  }

  const rowSlider = $('.row-slider').slick({
    arrows: false,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1
  });

  $('.slider-controls').click(function (e) {
    const target = e.target.dataset.move;
    $(this)
      .parent()
      .children('.page-slider')
      .slick(`slick${target}`);
  });



  console.log('The main script is ready');
})();


(function () {

  // Аудио проигрыватель
  const playerRange = $('.player-range');
  const tracks = [
    {
      id: 0,
      title: "Higher lies",
      cover_url: "./images/covers/paraphine_higher_hies.jpg",
      audio_src: "./tracks/Paraphine - Good Times.mp3"
    },
    {
      id: 1,
      title: "Say it out loud",
      cover_url: "./images/covers/paraphine_say_it_out_loud.jpg",
      audio_src: "./tracks/Paraphine - Say It Out Loud.mp3"
    }
  ]
  const audio = new Audio();
  const context = new AudioContext();
  const src = context.createMediaElementSource(audio);
  const analyser = context.createAnalyser();

  $('.track-controls').click(function (e) {
    const trackId = parseInt(e.target.dataset.track)
    if (trackId >= 0) {
      const trackInfo = tracks.filter(track => track.id === trackId)

      if (trackInfo.length) {
        setTrackInfo(...trackInfo)
        $('#player').addClass('active');
      }

    }
  })

  function setTrackInfo({ title, cover_url, audio_src }) {
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



  const canvas = $('#player-visual')[0];
  canvas.width = window.innerWidth;
  canvas.height = $('#player').height();
  const ctx = canvas.getContext('2d');

  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  const width = canvas.width;
  const height = canvas.height;
  const barWidth = (width / bufferLength) * 2;
  let barHeight = 0;

  // Инициализация драг и клик евентов ползунка плеера
  playerRange.on('mousedown', function (e) {
    e.preventDefault();
    let rectWidth = e.target.getBoundingClientRect().width;

    const onMouseMove = function () {
      let shiftX = event.clientX - playerRange[0].getBoundingClientRect().left;
      let handPosition = parseInt((shiftX / rectWidth) * 100);

      if (shiftX > rectWidth || shiftX <= 0) { return }

      setPlayerHand(handPosition);
      console.log(shiftX)
    }

    const onMouseUp = function () {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  })

  playerRange.on('click', function (e) {
    let rectWidth = e.target.getBoundingClientRect().width;
    let shiftX = event.clientX - playerRange[0].getBoundingClientRect().left;
    let handPosition = parseInt((shiftX / rectWidth) * 100);

    if (shiftX > rectWidth || shiftX < 0) { return }

    setPlayerHand(handPosition);
  })

  playerRange.on('dragstart', function () { return false; });

  const setPlayerHand = function (handPosition) {

    audio.currentTime = (handPosition * audio.duration) / 100
    $('.range-handle').css({ transform: `translateX(${-100 + handPosition}%)` });


  };

  function render() {
    requestAnimationFrame(render);
    const currentTime = parseInt(audio.currentTime);
    const currentTime2 = parseInt(currentTime / Math.floor(audio.duration) * 100);
    barCount = 0;

    if (!currentTime2) return
    $('.range-handle').css({ transform: `translateX(${-100 + currentTime2}%)` });

    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#000'
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

  $('.player-controls').on('click', function (e) {
    const control = e.target.dataset.control;
    switch (control) {
      case 'play':
        audioPlay();
        break;
      case 'stop':
        audioStop();
        break;
      case 'pause':
        audioPause();
        break;
    }
  })

  const audioPlay = () => {
    audio.play();
  };

  const audioStop = () => {
    audio.pause();
    audio.currentTime = 0;
    $('.range-handle').css({ transform: `translateX(${-100 + 0}%)` });
    $('#player').removeClass('active');
  }

  const audioPause = () => {
    audio.pause();
  };

  render();

  console.log('Init player');
})()