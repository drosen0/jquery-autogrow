/*
 * Auto Expanding Text Area (1.2.3)
 * by Chrys Bader (www.chrysbader.com)
 * chrysb@gmail.com
 *
 * Special thanks to:
 * Jake Chapa - jake@hybridstudio.com
 * John Resig - jeresig@gmail.com
 *
 * Copyright (c) 2008 Chrys Bader (www.chrysbader.com)
 * Licensed under the GPL (GPL-LICENSE.txt) license.
 *
 *
 */

(function (jQuery) {
    jQuery.fn.autogrow = function (options) {
        return this.each(function () {
            new jQuery.autogrow(this, options);
        });
    };

    jQuery.autogrow = function (element, options) {
        this.options = options || {};
        this.dummy = null;
        this.interval = null;
        this.minHeight = parseInt(this.options.minHeight || jQuery(element).css('min-height'), 10);
        this.maxHeight = parseInt(this.options.maxHeight || jQuery(element).css('max-height'), 10);
        this.lineHeight = parseInt(this.options.lineHeight || jQuery(element).css('line-height'), 10);

        if (isNaN(this.lineHeight)) {
            throw new TypeError("The line-height must be a number (either the option or the css property on the element)");
        }

        this.expandCallback = this.options.expandCallback;
        this.resizeCallback = this.options.resizeCallback || function () {};
        this.textarea = jQuery(element);
        this.evenNumberedHeight = this.options.evenNumberedHeight || false;

        this.init();
    };

    jQuery.autogrow.fn = jQuery.autogrow.prototype = {
        autogrow: '1.2.3',

        init: function () {
            var self = this;
            this.textarea.css({ overflow: 'hidden', display: 'block' });
            this.textarea.bind('focus', function () {
                self.startExpand();
            });
            this.textarea.bind('blur', function () {
                self.stopExpand();
            });
            this.checkExpand();
        },

        startExpand: function () {
            var self = this;
            this.interval = window.setInterval(function () {
                self.checkExpand();
            }, 400);
        },

        stopExpand: function () {
            clearInterval(this.interval);
        },

        checkExpand: function () {
            if (this.dummy === null) {
                this.dummy = jQuery('<div></div>');
                this.dummy.css({
                    'font-size'  : this.textarea.css('font-size'),
                    'font-family': this.textarea.css('font-family'),
                    'width'      : this.textarea.css('width'),
                    'padding'    : this.textarea.css('padding'),
                    'line-height': this.lineHeight + 'px',
                    'overflow-x' : 'hidden',
                    'position'   : 'absolute',
                    'top'        : 0,
                    'left'       : -9999
                }).appendTo('body');
            }

            var html = this.textarea.val();

            // Strip HTML tags
            html = html.replace(/(<|>)/g, '');

            // IE is different, as per usual
            if (jQuery.browser.msie) {
                html = html.replace(/\n/g, '<BR>new');
            } else {
                html = html.replace(/\n/g, '<br>new');
            }

            // add some padding at end to open a new line a little early
            // and ensure it never collapses to 0
            html = html + "mmm";

            if (this.dummy.html() !== html) {
                this.dummy.html(html);

                if (this.maxHeight > 0 && (this.dummy.height() > this.maxHeight)) {
                    this.textarea.css('overflow-y', 'auto');
                } else {
                    this.textarea.css('overflow-y', 'hidden');
                    if (this.dummy.height() !== this.textarea.height()) {
                        var newHeight = this.dummy.height();
                        if (newHeight < this.minHeight) {
                            newHeight = this.minHeight;
                        }

                        if (this.evenNumberedHeight) {
                            newHeight += newHeight % 2;
                        }
                        this.textarea.css({ height: newHeight + 'px' });
                        this.resizeCallback(newHeight);
                    }
                }
            }

            if (this.expandCallback) {
                var self = this;
                window.setTimeout(function () {
                    self.expandCallback();
                }, 500);
            }
        }

    };
}(jQuery));
