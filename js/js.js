var slideWrapper = $(".main-slider"),
    iframes = slideWrapper.find('.embed-player'),
    lazyImages = slideWrapper.find('.slide-image'),
    lazyCounter = 0;
var resulation = 1 / 1.8;
tabKeyPressed = false;
$(document).ready(function() {
  if ($(window).width() < 768) {
      $(".navigation").click(function(){
        $("body").toggleClass("no-move");
        $(".content").toggleClass("overflow");
      });
  }
  
  $('.one-time').slick({
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchMove: false
  });
  $('.autor-slider').slick({
    dots: false,
    arrow: true,
    infinite: true,
    slidesToShow: 1
  });
  $('.property-listing-image').slick({
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchMove: false
  });

$('.playclick').click(function () {
  var $this = $(this);
  $(this).siblings(".slide-image").hide();

  var alliframeTags = null;
  alliframeTags = document.getElementsByTagName("iframe");

  for(i=0;i<alliframeTags.length;i++)
  {    if (alliframeTags[i].getAttribute('data-iframe'))
  {
    alliframeTags[i].setAttribute('src',alliframeTags[i].getAttribute('data-iframe'));
    alliframeTags[i].removeAttribute("data-iframe");
  }
  }
  if ($this.hasClass('active')) {
    $("body").removeClass("videoLoad");
    var currentSlide = $(".main-slider").slick("getSlick").$slider;
    playPauseVideo(currentSlide, "pause");
    $this.removeClass('active');
  } else {
    $("body").addClass("videoLoad");
    // $this.text('pause');
    $this.addClass('active');
    var currentSlide = $(".main-slider").slick("getSlick").$slider;
    playPauseVideo(currentSlide, "play");
  }
});
});

// POST commands to YouTube or Vimeo API
function postMessageToPlayer(player, command) {
  if (player == null || command == null) return;
  player.contentWindow.postMessage(JSON.stringify(command), "*");
}
// When the slide is changing
function playPauseVideo(slick, control) {
  var currentSlide, slideType, startTime, player, video;
  currentSlide = slick.find(".slick-current");
  slideType = currentSlide.attr("class").split(" ")[1];
  player = currentSlide.find("iframe").get(0);
  startTime = currentSlide.data("video-start");

  if (slideType === "vimeo") {
    switch (control) {
      case "play":
        if ((startTime != null && startTime > 0) && !currentSlide.hasClass('started')) {
          currentSlide.addClass('started');
          postMessageToPlayer(player, {
            "method": "setCurrentTime",
            "value": startTime
          });
        }
        postMessageToPlayer(player, {
          "method": "play",
          "value": 1
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "method": "pause",
          "value": 1
        });
        break;
                   }
  } else if (slideType === "youtube") {
    switch (control) {
      case "play":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "mute"
        });
        postMessageToPlayer(player, {
          "event": "command",
          "func": "playVideo"
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "pauseVideo"
        });
        break;
                   }
  } else if (slideType === "video") {
    video = currentSlide.children("video").get(0);
    if (video != null) {
      if (control === "play") {
        video.play();
      } else {
        video.pause();
      }
    }
  }
}
// Resize player
function resizePlayer(iframes, ratio) {
  if (!iframes[0]) return;
  var win = $(".main-slider"),
      width = win.width(),
      playerWidth,
      height = win.height(),
      playerHeight,
      ratio = ratio || resulation;

  iframes.each(function () {
    var current = $(this);
    if (width / ratio < height) {
      playerWidth = Math.ceil(height * ratio);
      current.width(playerWidth).height(height).css({
        left: (width - playerWidth) / 2,
        top: 0
      });
    } else {
      playerHeight = Math.ceil(width / ratio);
      current.width(width).height(playerHeight).css({
        left: 0,
        top: (height - playerHeight) / 2
      });
    }
  });
}
$(document).ready(function() {
  $('iframe').on('ended', function() {
    console.log('Video Complete');
    // slider.slick('slickPlay');
  });
});
// DOM Ready
$(function () {
  // Initialize
 
    slideWrapper.on("init", function (slick) {
      slick = $(slick.currentTarget);
      setTimeout(function () {
        // playPauseVideo(slick, "play");
      }, 1000);
      resizePlayer(iframes, resulation);
    });
    slideWrapper.on("beforeChange", function (event, slick) {
      slick = $(slick.$slider);
      //  playPauseVideo(slick, "play");



      var currentSlide = $(".main-slider").slick("getSlick").$slider;
      var Slide = currentSlide.find(".slick-current");
      slideType = Slide.attr("class").split(" ")[1];
      // $this.toggleClass('active');

      Slide.find('button.playclick').removeClass('active');
      Slide.find('button.playclick').text('pause');

    });
    slideWrapper.on("afterChange", function (event, slick) {
      slick = $(slick.$slider);
      playPauseVideo(slick, "pause");
    });
    slideWrapper.on("lazyLoaded", function (event, slick, image, imageSource) {
      lazyCounter++;
      if (lazyCounter === lazyImages.length) {
        lazyImages.addClass('show');
        // slideWrapper.slick("slickPlay");
      }
    });
    //start the slider
    $('.main-slider').slick({
      dots: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      touchMove: false
    });
  });
// Resize event
$(window).on("resize.slickVideoPlayer", function () {
  resizePlayer(iframes, resulation);
});
$(document).ready(function() {

  $('.number ul').slick({
    infinite: false,
    centerMode: true,
    centerPadding: '40px',
    slidesToScroll: 1,
    slidesToShow: 3,

    responsive: [
     {
        breakpoint: 1366,
        settings: {
          centerMode: true,
          centerPadding: '0',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });
  $(".navbar-toggler").click(function(){

    $("body").toggleClass("menu-open");

  });
  var $el = $(".logo");
  setTimeout(function () {
      $el.addClass('in-view');
  }, 2000);

  var $el2 = $(".top-nav");
  setTimeout(function () {
      $el2.addClass('in-view');
  }, 3000);

  var $el3 = $(".bottom-bar");
  setTimeout(function () {
      $el3.addClass('in-view');
  }, 4000);

  var $el4 = $("h1");
  setTimeout(function () {
      $el4.addClass('in-view');
  }, 5000);
  var $el5 = $(".content-view");
  setTimeout(function () {
      $el5.addClass('in-view');
  }, 6000);
  
});


$(window).on('load resize orientationchange', function() {
        $('.property-listing-left').each(function(){
            var $carousel = $(this);
            /* Initializes a slick carousel only on mobile screens */
            // slick on mobile
            if ($(window).width() > 768) {
                if ($carousel.hasClass('slick-initialized')) {
                    $carousel.slick('unslick');
                }
            }
            else{
                if (!$carousel.hasClass('slick-initialized')) {
                    $carousel.slick({
                        centerMode: true,
                        slidesToShow: 1
                    });
                }
            }
        });
});

$(window).on('load resize orientationchange', function() {
        $('.mobile-slider').each(function(){
            var $carousel = $(this);
            /* Initializes a slick carousel only on mobile screens */
            // slick on mobile
            if ($(window).width() > 768) {
                if ($carousel.hasClass('slick-initialized')) {
                    $carousel.slick('unslick');
                }
            }
            else{
                if (!$carousel.hasClass('slick-initialized')) {
                    $carousel.slick({
                        centerMode: true,
                        slidesToShow: 1
                    });
                }
            }
        });
});