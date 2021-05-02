// this is a hacky and brutal polyfill to somewhat implement zoom in firefox
// https://caniuse.com/#feat=css-zoom
// it allows to use jQuery's $('.element').css({zoom: 1.5});
// there is no effort to actually implement a normal css polyfill
// this polyfill also doesn't work when the zoomed element has margins since they are used to fake the new size.

$.cssNumber.zoom = true;
if (!("zoom" in document.body.style)) {
    $.cssHooks.zoom = {
        get: function (elem, computed, extra) {
            var value = $(elem).data('zoom');
            return value != null ? value : 1;
        },
        set: function (elem, value) {
            var $elem = $(elem);
            var size = { // without margin
                width: $elem.outerWidth(),
                height: $elem.outerWidth()
            };
            $elem.data('zoom', value);
            if (value != 1) {
                $elem.css({
                    transform: 'scale(' + value + ')',
                    marginLeft: (size.width * value - size.width) / 2,
                    marginRight: (size.width * value - size.width) / 2,
                    marginTop: (size.height * value - size.height) / 2,
                    marginBottom: (size.height * value - size.height) / 2
                });
            } else {
                $elem.css({
                    transform: null,
                    margin: null
                });
            }
        }
    };
}

$(document).ready(function () {

    var defaultWidth = 1920;
    var currentWindowWidth = window.innerWidth;

    if (currentWindowWidth > 1024 && currentWindowWidth < defaultWidth) {
        var percent = (currentWindowWidth * 100) / defaultWidth;
        document.body.style.zoom = Math.round(percent) + '%';

    }
    //$(document).on("scroll", onScroll);
    //smoothscroll
    $('a.nav:not(.dropbtn)').on('click', function (e) {
        $('a.nav').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
    });

    setTimeout(() => { $('html').css("scroll-behavior", "smooth"); }, 1000);

});



function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('.nav').each(function () {
        var percent = 100;
        var defaultWidth = 1920;
        var currentWindowWidth = window.innerWidth;
        if (currentWindowWidth > 1024 && currentWindowWidth < defaultWidth) {
            percent = (currentWindowWidth * 100) / defaultWidth;
        }
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));

        if (refElement.position().top <= (scrollPos + (scrollPos * (1 - percent / 100) + (window.innerHeight / 2)))) {
            $('.nav').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
}


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function openDropdown() {
    $(".dropdown-content").toggleClass("show");
    $(".dropbtn").toggleClass("open");
    $('.dropbtn').blur();
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
                $(".dropbtn").removeClass("open");
            }
        }
    }
}