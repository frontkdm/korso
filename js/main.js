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
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  const mainSlider = $('.video-slider').slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1
  })

  $('.slider-controls').click(function (e) {
    const target = e.target.dataset.move;
    $(this)
      .parent()
      .children('.page-slider')
      .slick(`slick${target}`);
  });

  const body = $('body');
  const drawer = $('.drawer');
  $('.header-menu').click(function () {
    body.addClass('noflow');
    drawer.addClass('open');
  })

  const closeDrawer = $('.drawer-close');
  closeDrawer.click(function () {
    body.removeClass('noflow');
    drawer.removeClass('open');
  })

  $(document).on('click', 'a[href^="#"]', function (e) {
    const id = $(this).attr('href');
    const $id = $(id);
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
  })

  let timer;
  function detectScroll(e) {
    clearTimeout(timer);
    if (!$('body').has('disable-hover')) {
      $('body').addClass('disable-hover')
    }

    timer = setTimeout(function () {
      $('body').removeClass('disable-hover')
    }, 200);

  }

  $(window).scroll(detectScroll);

  $(document).click(function (e) {
    const target = e.target.classList[0];
    if (target === 'modal') {
      body.removeClass('noflow');
      $('.modal').removeClass('show')
    }
  })

  $('.btn-modal').click(function (e) {
    const formType = $(this).data('modal-type');
    body.addClass('noflow')
    $('.modal').addClass('show');

    console.log(formType)
  })

  console.log('The main script is ready');
})();
