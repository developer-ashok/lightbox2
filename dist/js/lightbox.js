/*!
 * Lightbox v2.11.4
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.lightbox = factory(root.jQuery);
    }
}(this, function ($) {

    function Lightbox(options) {
        this.album = [];
        this.currentImageIndex = void 0;
        this.init();

        // options
        this.options = $.extend({}, this.constructor.defaults);
        this.option(options);
    }

    // Descriptions of all options available on the demo site:
    // http://lokeshdhakar.com/projects/lightbox2/index.html#options
    Lightbox.defaults = {
        albumLabel: 'Image %1 of %2',
        alwaysShowNavOnTouchDevices: false,
        fadeDuration: 600,
        fitImagesInViewport: true,
        imageFadeDuration: 600,
        positionFromTop: 50,
        resizeDuration: 700,
        showImageNumberLabel: true,
        wrapAround: false,
        disableScrolling: false,
        sanitizeTitle: false
    };

    Lightbox.prototype.option = function(options) {
        $.extend(this.options, options);
    };

    Lightbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
        return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
    };

    Lightbox.prototype.init = function() {
        var self = this;
        // Both enable and build methods require the body tag to be in the DOM.
        $(document).ready(function() {
            self.enable();
            self.build();
        });
    };

    Lightbox.prototype.enable = function() {
        var self = this;
        $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(event) {
            self.start($(event.currentTarget));
            return false;
        });
    };

    Lightbox.prototype.build = function() {
        if ($('#lightbox').length > 0) {
            return;
        }

        var self = this;

        $('<div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"></div><div id="lightbox" tabindex="-1" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/><video class="lb-video" controls></video><div class="lb-nav"><a class="lb-prev" role="button" tabindex="0" aria-label="Previous image" href=""></a><a class="lb-next" role="button" tabindex="0" aria-label="Next image" href=""></a></div><div class="lb-loader"><a class="lb-cancel" role="button" tabindex="0"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close" role="button" tabindex="0"></a></div></div></div></div>').appendTo($('body'));

        // Cache jQuery objects
        this.$lightbox       = $('#lightbox');
        this.$overlay        = $('#lightboxOverlay');
        this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
        this.$container      = this.$lightbox.find('.lb-container');
        this.$image          = this.$lightbox.find('.lb-image');
        this.$video          = this.$lightbox.find('.lb-video');
        this.$nav            = this.$lightbox.find('.lb-nav');

        // Other initialization code...
    };

    Lightbox.prototype.start = function($link) {
        var self    = this;
        var $window = $(window);

        $window.on('resize', $.proxy(this.sizeOverlay, this));

        this.sizeOverlay();

        this.album = [];
        var imageNumber = 0;

        function addToAlbum($link) {
            self.album.push({
                alt: $link.attr('data-alt'),
                link: $link.attr('href'),
                title: $link.attr('data-title') || $link.attr('title')
            });
        }

        var dataLightboxValue = $link.attr('data-lightbox');
        var $links;

        if (dataLightboxValue) {
            $links = $($link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
            for (var i = 0; i < $links.length; i = ++i) {
                addToAlbum($($links[i]));
                if ($links[i] === $link[0]) {
                    imageNumber = i;
                }
            }
        } else {
            if ($link.attr('rel') === 'lightbox') {
                addToAlbum($link);
            } else {
                $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
                for (var j = 0; j < $links.length; j = ++j) {
                    addToAlbum($($links[j]));
                    if ($links[j] === $link[0]) {
                        imageNumber = j;
                    }
                }
            }
        }

        var top  = $window.scrollTop() + this.options.positionFromTop;
        var left = $window.scrollLeft();
        this.$lightbox.css({
            top: top + 'px',
            left: left + 'px'
        }).fadeIn(this.options.fadeDuration);

        if (this.options.disableScrolling) {
            $('body').addClass('lb-disable-scrolling');
        }

        this.changeImage(imageNumber);
    };

    Lightbox.prototype.changeImage = function(imageNumber) {
        var self = this;
        var filename = this.album[imageNumber].link;
        var $image = this.$lightbox.find('.lb-image');
        var $video = this.$lightbox.find('.lb-video');

        var isVideo = /\.(mp4|webm|ogg)$/i.test(filename);

        if (isVideo) {
            $image.hide();
            $video.attr('src', filename).show();
        } else {
            $video.hide();
            $image.attr('src', filename).show();
        }

        // Other logic...
    };

    Lightbox.prototype.showImage = function() {
        this.$lightbox.find('.lb-loader').stop(true).hide();
        this.$lightbox.find('.lb-image, .lb-video').fadeIn(this.options.imageFadeDuration);

        // Other logic...
    };

    // Other methods...

    return new Lightbox();
}));
