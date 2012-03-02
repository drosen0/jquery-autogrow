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
            // add a line immediately when user presses Enter
            this.textarea.bind('keypress', function (event) {
                if (event.which === 13)
                    self.setHeight(1);
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
                    'font-size'      : this.textarea.css('font-size'),
                    'font-family'    : this.textarea.css('font-family'),
                    'padding-top'    : this.textarea.css('padding-top'),
                    'padding-right'  : this.textarea.css('padding-right'),
                    'padding-bottom' : this.textarea.css('padding-bottom'),
                    'padding-left'   : this.textarea.css('padding-left'),
                    'line-height'    : this.lineHeight + 'px',
                    'overflow-x'     : 'hidden',
                    'position'       : 'absolute',
                    'top'            : 0,
                    'left'           : -9999
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
            html = html + " mmm";

            if (this.dummy.html() !== html) {
                // in case width of textarea changes, reset width of dummy div
                this.dummy.width(this.textarea.width());

                this.dummy.html(html);

                this.setHeight(0);
            }

            if (this.expandCallback) {
                var self = this;
                window.setTimeout(function () {
                    self.expandCallback();
                }, 500);
            }
        },

        setHeight: function (addLines) {
            var newHeight = this.dummy.height() + addLines * this.lineHeight;
            var oldHeight = this.textarea.height();

            // don't remove a line if just removing one line
            if (newHeight > oldHeight || newHeight + this.lineHeight < oldHeight) {
                if (this.maxHeight > 0 && newHeight > this.maxHeight) {
                    newHeight = this.maxHeight;
                    this.textarea.css('overflow-y', 'auto');
                } else {
                    if (newHeight < this.minHeight)
                        newHeight = this.minHeight;
                    this.textarea.css('overflow-y', 'hidden');
                }

                this.textarea.css({ height: newHeight + 'px' });
                this.resizeCallback(newHeight);
            }
        }

    };
}(jQuery));
