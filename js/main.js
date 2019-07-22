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
