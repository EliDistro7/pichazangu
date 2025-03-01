// components/UIInitializer.js
"use client";

import Script from "next/script";

export default function UIInitializer() {
    const initializeUI = `
        (function ($) {
            "use strict";

            // Spinner
            const spinner = function () {
                setTimeout(function () {
                    if ($('#spinner').length > 0) {
                        $('#spinner').removeClass('show');
                    }
                }, 1);
            };
            spinner();
            
            // Initiate WOW.js
            new WOW().init();
            
            // Back to top button
            $(window).scroll(function () {
                if ($(this).scrollTop() > 300) {
                    $('.back-to-top').fadeIn('slow');
                } else {
                    $('.back-to-top').fadeOut('slow');
                }
            });
            $('.back-to-top').click(function () {
                $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
                return false;
            });

            // Testimonial carousel
            $(".testimonial-carousel").owlCarousel({
                autoplay: true,
                smartSpeed: 1500,
                center: true,
                dots: true,
                loop: true,
                margin: 50,
                responsiveClass: true,
                responsive: {
                    0: { items: 1 },
                    576: { items: 1 },
                    768: { items: 2 },
                    992: { items: 2 },
                    1200: { items: 3 }
                }
            });
        })(jQuery);
    `;

    return (
        <Script
            id="initialize-ui-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: initializeUI,
            }}
        />
    );
}
