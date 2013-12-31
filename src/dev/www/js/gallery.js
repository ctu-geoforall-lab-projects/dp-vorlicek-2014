/*
 * jQuery Gallery plug-in by Drahomir Hanak
 * Is an open-source jQuery plug-in developed for the Saixon corporation. This source code
 * is licensed under the MIT license, and the plug-in is used as a Saixon user interface.
 * Plug-in was tested on jQuery 1.6. If you'd use it, have to let here the comments.
 * (c) 2011 Drahomír Hanák and the Saixon corporation
 * 
 * Actual version: 0.9b
 * File name: gallery.js  
 * Public date: November 17th 2011   
 * Documentation: English (http://projects.drahak.eu/sui-gallery/) 
 * Comments: English  
 */   

(function( $ ) {

  /** Gallery class */
  var Gallery = new function()
  {
      /** Variables */
      this.settings = null;
      this.images = [];
      this.gal = null;
      this.img = { path: null, title: null, description: null };
      this.state = null;
      
      /** Initialize gallery */
      this.init = function(settings)
      {
          this.settings = settings;  
          this.gal = this.settings.gallery;
          $(this.settings.galleryView.element).html("<img />");
          this.loadImages();
          var firstSrc = $(this.images[0]).attr('src');
          var src = null;
          if(this.settings.galleryView.default === null) {
              src = firstSrc;    
          } else {
              src = this.settings.galleryView.default;
          }
          $(this.settings.galleryView.element + " img").attr('src', src); 
      };
      
      /** Resize */
      this.tip = function()
      {
          $("<div></div>")
              .addClass("galleryTip")
              .appendTo(this.settings.galleryView.element);    
      };
      
      /** Find and build gallery */
      this.loadImages = function()
      {
          this.images = this.settings.gallery.find(this.settings.galleryTag);
          for(var i = 0; i < this.images.length; i++) {
              var image = $(this.images[i]);
              image.css({ visibility: "hidden" });
              image.load(function() {
                  // Load successd
                  $(this).css({ visibility: "visible" });
                  $(this).bind("click", function(event) {  Gallery.showImage(event); });
              }).error(function() {
                  // Image error
                  $(this).attr('src', Gallery.settings.error.notExists);
              });
          }
      };
      
      /** Show image */
      this.showImage = function(event)
      {
          var img = $(event.target); 
          var link = img.parent();
          var href = link.attr('href');
          link.removeAttr('href');
          this.tip();
          
          // Make view
          $(this.settings.galleryView.element)
              .css({ width: this.settings.galleryView.width, height: this.settings.galleryView.height, textAlign: 'center', fontSize: '20px' });
              
          $(this.settings.galleryView.element + " img")
              .fadeOut(500, function() {
                  $(this).attr('src', img.attr('src'));
                  $(this).css({ display: 'none', height: '100%',width:'100%', left: 0, top: 0 });
                  $(this).fadeIn(500);
              });
      };
  };

  // Date picker plug-in
  $.fn.gallery = function(options) { 
      
      /** Settable options */
      var settings = {
          gallery: this,
          galleryTag: "img",
          galleryView: { element: "#image",width:'50%', height: '50%', default: null },
          error: { notExists: "images/notExists.png" },
          opacityDuration: 500
      };
      
      // Each element
      return this.each(function() {
          // Make options
          if(options) $.extend( settings, options );
          Gallery.init(settings);
      });
  };
})( jQuery );
