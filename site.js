
$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $ ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function(options) {
        settings = $.extend({
            scrollToOffset: 60,
            scrollSpeed: 200,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
    	navItems.on('click', function(event){
    		event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
        	$('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset},
                settings.scrollSpeed, "easeInOutExpo", function(){
                    disableScrollFn = false;
                }
            );
    	});

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }
})( jQuery );


$(document).ready(function (){

    $('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
	$(".sectiondivider").on('click', function(event) {
    	$('html,body').animate({scrollTop: $(event.target.parentNode).offset().top - 50}, 400, "linear");
	});

    //links going to other sections nicely scroll
	$(".container a").each(function(){
        if ($(this).attr("href").charAt(0) == '#'){
            $(this).on('click', function(event) {
        		event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight =  $(target.attr("href")).offset().top
            	$('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
	});

});

/** 
 * This is what generates the list of shows
 */

fetch('https://raw.githubusercontent.com/jacobjavits/jacobjavits.github.io/master/shows.json')
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    appendData(data);
    })
    .catch(function (err) {
    console.log('Error: ' + err)
    });

function appendData(data) {
    var showContainer = document.querySelector('.show-list');

    for (var i = 0; i < data.length; i++) {
    
    /** Create individual show div and add class */
    var show = document.createElement('div');
    show.setAttribute('class', 'show');

    var today = new Date();
    console.log(today.setHours(0, 0, 0, 0));
    var date = new Date( data[i].date );

    console.log( date.setHours(0, 0, 0, 0) );
    
    show.innerHTML = '';

    if( date.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0) ) {

        show.innerHTML += `
            <time class="show__date">${data[i].date} @ ${data[i].time}</time>
            `;

        if(data[i].solo_or_band != 'band') {
            show.innerHTML += `<p class="show__badge"><span class="">${data[i].solo_or_band}</span></p>`;
        }

        show.innerHTML += `
            <p class="show__city">
                <strong>${data[i].city}, ${data[i].state}</strong><br/>
                ${data[i].venue}
            </p>
            `;

        if( data[i].otherbands != '') {
            show.innerHTML += `
            <p class="show__otherbands"><small>w/ ${data[i].otherbands}</small></p>
            `;
        }

        if( data[i].link != '') {
            show.innerHTML += `
            <p class="show__link">
                <a class="button" href="${data[i].link}">More Info</a>
            </p>
            `;
        } else {
            show.innerHTML += `
            <p class="show__link">
                <small>Contact us for info</small>
            </p>
            `;
        }

        showContainer.appendChild(show);
        }
        
    }
}

