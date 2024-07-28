/*  
    updated:    01/28/2019 - lbrown@brightline.tv
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.0.0.js

    updated:    09/21/2022 - korozco@brightline.tv
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.2.js

    updated:    11/08/2022 - csaad@brightline.tv
    fixing keycode callback
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.2.js

    updated:    12/08/2022 - ehokayem@brightline.tv
    fixing older browsers support
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.3-h.js

    updated:    12/15/2022 - csaad@brightline.tv
    add the complete creative URL to the ad requested analytics on app_session_id
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.3.js

    updated:    02/09/2023 - ehokayem@brightline.tv
    Update openAd call to include optional channel name parameter
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.3.js

    updated:    14/03/2023 - ehokayem@brightline.tv
     added support for optional parameter for ingesting createView tracking URL.
     //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.6.js

    updated:    19/07/2023 - ehokayem@brightline.tv
    added a new method "on_BL_keyPress" for capturing key codes on key press.
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.7.js

     updated:    21/07/2023 - ehokayem@brightline.tv
    added a new method "on_BL_Error" for capturing error codes.
    //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.7.js

   updated:    08/09/2023 - ehokayem@brightline.tv
   general code fixes to fix warnings and error logs displaying on certain Tizen devices.
   //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.1.7.js

    updated:    18/10/2023 - ehokayem@brightline.tv
   added "enableAnalytics" Flag in deviceInfo to completely disable and enable analytics.
   //cdn-media.brightline.tv/sdk/gen2/webkit/media/js/brightline.webkit.sdk.2.2.2.js
*/

/* set up variables and object for use */

"use strict";

var BLFactory = function () {
  var BL = {
    sdkVersion: "2.2.2",
    /* Bright:ine WebKit SDK version */
    checkCallbacks: 0,
    di: window.navigator,
    timeoutState: 4000,

    //bumper end card -->
    bumperTimeout: 0,
    //bumper end card <--

    /* determines how long to wait for the ad creative response before aborting */
    onPlayerSizeChange: null,
    video_target: null,
    video_target_width: null,
    video_target_height: null,
    video_rect: null,
    adSessionID: null,
    deviceInfo: {},
    config: {},
    configUrl: "https://services.brightline.tv/api/v2/config/",
    sinks: [],
    supports: true,
    enableCloseCTA: null,

    //!
    channelName: null,
    urlSessionID: null,
    hostPlatform: navigator.platform,
    //windowURL: window.location.hostname,
    windowURL: window.location.href,
    enableAnalytics: true, //flag to enable or disable analytics completely from app deviceInfo
    //!

    //trackingNode
    trackingNode: null,

    /* this object is used to populate and retrieve video player attributes that the friendly iframe will use for positioning */
    player_attributes: {
      position: "",
      width: "",
      height: "",
      top: "",
      left: "",
    },

    /* START callbacks */

    /**
     * _logger methods used by the partner
     * @method _logger
     */
    _logger: function (msg) {
      console.log("[BL] ", msg);
    },

    // `external` method for exposing an external logger
    setLogger: function (logger) {
      BL._logger = logger;
      BL._logger("new logger set:");
      BL._logger(logger);
    },

    _loggingEnabled: true,

    enableLogging: function () {
      BL._loggingEnabled = true;
    },

    disableLogging: function () {
      BL._loggingEnabled = false;
    },

    /**
     * Callback for when the BrightLine ad is opened. Called from adState() method
     * @method on_BL_opened
     */
    on_BL_opened: function () {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: BL.openAd() was called");
    },

    /**
     * Callback for when the BrightLine ad has rendered. Called from BL_adState() method
     * @method on_BL_rendered
     */
    on_BL_rendered: function () {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: creative has rendered");
    },

    /**
     * Callback for when the BrightLine overlay is expanded. Called from BL_adState() method
     * This is only used when an overlay is expanded to a full screen experience and the commercial spot must be paused
     * @method on_BL_expanded
     */
    on_BL_expanded: function () {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: overlay has expanded, pause the stream");
    },

    /**
     * Callback for when the BrightLine overlay is collapsed. Called from BL_adState() method
     * This is only used when an overlay is closed from a full screen experience and the commercial spot must be resumed
     * @method on_BL_collapsed
     */
    on_BL_collapsed: function () {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: overlay has collapsed, resume the stream");
    },

    /**
     * Callback for when the BrightLine overlay is collapsed. Called from BL_adState() method
     * The clean up is automatic, but this can be used to give more understanding of the ad life cycle
     * @method on_BL_closed
     */
    on_BL_closed: function (keycode) {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: BL.closeAd() was called");
      console.log("[sdk keycode]", keycode);
    },

    /**
     Callback for when the Click to convert button is clicked
     */
    on_BL_raiseEvent: function (deepLink) {
      /* pub does something here */
      console.log("----> the deep link is being called from the SDK", deepLink);
      // BL._analytics.raiseEvent(deepLink);
    },

    /**
     * Callback for fetching the deviceInfo object
     * @method on_deviceInfo
     */
    on_deviceInfo: function () {
      /* pub retuns deviceInfo object */
      BL._logger("BRIGHTLINE SDK: BL.on_deviceInfo() was called");
      return null;
    },

    //bumper end card -->
    /**
     * Callback for retrieving player current time for bumper-end-card
     * @method on_BL_player_currentTime
     */
    on_BL_player_currentTime: function () {
      /* pub does something here */
      BL._logger("BRIGHTLINE SDK: BL.on_BL_player_currentTime() was called");
      BL._logger(this.bumperTimeout);
      return this.bumperTimeout;
    },
    //bumper end card <--
    /* END callbacks */

    /**
     * Closes the ad by destroying the iFrame and reset for the next ad request.
     * App should call this when the BrightLine enabled commercial spot is over.
     * Ad creative logic will also call this method for engageable and non-expanded overlays to prevent bleeding into another ad or content
     * @method closeAd
     */
    closeAd: function (keycode) {
      if (this.cleanUp) {
        this.cleanUp();
      }

      if (document.getElementById("bl_fif")) {
        BL._logger("closeAd called");
        console.log(keycode);
        var fif = document.getElementById("bl_fif");
        fif.parentNode.removeChild(fif);
        clearInterval(this.onPlayerSizeChange);
        this.on_BL_closed(keycode);
      }
    },

    /**
     * This method is called by the ad creative for the callbacks and on init
     * TODO - Error handling if there is no response from the creative. Threshold set by var timeoutState, defaults at 4000 MS
     * @method adState
     * @param {string} state - the state of the ad (opened, rendered, expanded, collapsed, closed)
     */
    adState: function (state) {
      /*
        setTimeout(function(){
            if( state != 'rendered' ){
                fif = document.getElementById('bl_fif');
                fif.contentWindow.recState('level','renderer', 'collapsed', 'feature', 'asset', 'closed', 'timeout');
                BL_closeAd();
            }
        }, timeoutState);
        */

      switch (state) {
        case "opened":
          this.on_BL_opened();
          break;

        case "rendered":
          this.on_BL_rendered();
          break;

        case "expanded":
          this.on_BL_expanded();
          break;

        case "collapsed":
          this.on_BL_collapsed();
          break;

        case "closed":
          this.on_BL_closed();
          break;
      }
    },

    /* END callbacks */

    /**
     * This method is called by the ad creative for the callbacks
     * Error handling if there is no response from the creative. Threshold set by var timeout, defaults at 4000 MS
     * @method BL_openAd
     * @param {string} src - the companion banner URL from the ad response that is used to render the content into the friendly iframe
     * @param {string} player - the ID of the video player where BrightLine ads will render over. If no ID is passed, a present video player will be used
     */
    openAd: function (
      src,
      player,
      enableCloseCTA,
      channel_name,
      tracking_node
    ) {
      //filter arguments
      for (var i = 0; i < arguments.length; i++) {
        if (i > 1) {
          //
          var optionalArgument = arguments[i];

          //
          /* console.log("----------------->");
          console.log("----------------->");
          console.log(optionalArgument);
          console.log(typeof optionalArgument);
          if (typeof optionalArgument === "string") {
            if (optionalArgument.includes("trackingEvents", 0)) {
              console.log(JSON.parse(optionalArgument));
            }
          }
          console.log("----------------->");
          console.log("----------------->"); */

          //
          if (typeof optionalArgument === "string") {
            if (optionalArgument.includes("trackingEvents", 0)) {
              this.trackingNode = JSON.parse(optionalArgument);
            } else {
              this.channelName = optionalArgument;
            }
          }
        }
      }

      //
      BL._logger("openAd " + src);

      //
      if (typeof player === "string") {
        BL.enableCloseCTA = enableCloseCTA;
      } else {
        BL.enableCloseCTA = player;
        player = null;
      }

      /* OPTIONAL start the timeout to abort if the rendered state has not been passed by the creative set by the var timeoutState */
      this.adState("opened");

      /* if the video player object is passed, use it. If not, use the video player object in the DOM fallback */
      if (document.getElementById(player) || player != null) {
        this.video_target = document.getElementById(player);
      } else {
        var players = document.getElementsByTagName("video");
        for (i = 0; i < players.length; i++) {
          if (
            players[i].currentTime > 0 &&
            !players[i].paused &&
            !players[i].ended &&
            players[i].readyState > 2
          ) {
            this.video_target = players[i];
          }
        }
      }

      /* get and assign the values to the player_attributes object */
      this.checkPlayerAttributes();

      /* setInterval check only when a BrightLine ad is open to determine the video player dimensions and position */
      BL.onPlayerSizeChange = setInterval(BL.checkPlayerAttributes, 250);
      BL.adSessionID = this.getParameterByName("session_id", src);

      /* set up the friendly iframe with video player attributes for positioning */
      var fif = document.createElement("iframe");
      fif.id = "bl_fif";
      fif.class = "bl_fif";
      fif.name = "bl_fif";
      fif.setAttribute("scrolling", "no");
      fif.setAttribute("frameborder", "0");
      fif.setAttribute("allowfullscreen", "true");
      fif.src = "about:blank";

      fif.style.width = this.player_attributes.width;
      fif.style.height = this.player_attributes.height;
      fif.style.zIndex = "2147483647";
      fif.style.position = "absolute";
      fif.style.top = this.player_attributes.top;
      fif.style.right = this.player_attributes.right;
      fif.style.bottom = this.player_attributes.bottom;
      fif.style.left = this.player_attributes.left;

      /* this gets the src and document.writes it's content into the friendly iframe DOM */
      var request = this.makeHttpObject();
      request.open("GET", src, true);
      //request.send(null);

      //!add session id param to OnAdRequested
      function getSessionID() {
        var urlSessionID;
        //
        if (window.location.href.indexOf("?session_id=") !== -1) {
          urlSessionID = window.location.href;
          urlSessionID = urlSessionID.split("?session_id=")[1];
          return urlSessionID;
        } else if (src.indexOf("?session_id=") !== -1) {
          urlSessionID = src;
          urlSessionID = src.split("?session_id=")[1];
          return urlSessionID;
        } else {
          return null;
        }
        /* else {
          //
          if (
            BL.adSessionID != null &&
            BL.adSessionID != undefined &&
            BL.adSessionID != ""
          ) {
            return BL.adSessionID;
          } else {
            if (
              deviceInfo &&
              deviceInfo.hasOwnProperty("adSessionID") &&
              deviceInfo.adSessionID != null &&
              deviceInfo.adSessionID != undefined
            ) {
              return deviceInfo.adSessionID;
            } else {
              return BL.guid();
            }
          }
        } */
      }

      //
      this.urlSessionID = getSessionID();

      console.log("xxxxxxxxxxxxxxxxxxxx");
      console.log(this.urlSessionID);
      console.log(this.hostPlatform);
      console.log(this.windowURL);
      console.log("xxxxxxxxxxxxxxxxxxxx");

      //attach c vars to OnAdRequested
      function addSessionId() {
        if (BL._analytics) {
          BL._analytics.raiseEvent("OnAdRequested", {
            //c2
            /* c2:
          this.urlSessionID && this.urlSessionID !== ""
            ? this.urlSessionID
            : "", */
            //c3
            c3:
              this.channelName && this.channelName !== ""
                ? this.channelName
                : "",
            //c4
            c4:
              this.hostPlatform && this.hostPlatform !== ""
                ? this.hostPlatform
                : "",
            //c5
            c5: this.windowURL && this.windowURL !== "" ? this.windowURL : "",
          });

          //
          console.log("OnAdRequested fired");
        }
      }
      //
      setTimeout(addSessionId, 200);
      //!add session id param to OnAdRequested

      //
      var that = this;

      /* if the request response is 200, contimue or close of failed, error is tracked */
      request.onloadend = function () {
        if (request.status == 200) {
          if (!document.getElementById("bl_fif")) {
            document.body.appendChild(fif);
            //document.querySelector("#player_holder").appendChild(fif);
            var doc = fif.contentWindow.document;
            doc.open();
            doc.write(request.responseText);
            doc.close();
          }
        } else {
          that.handleError(request.status, src);
          BL._analytics.raiseEvent("OnAdUnavailable");
        }
      };

      //
      request.send(null);
    },

    //! window.BL._logger("[raiseEvent] " + name + JSON.stringify(args));

    /**
     * returns key event that is clicked when the overlay is open. "samsung updates".
     * @method on_BL_keyPress
     */
    on_BL_keyPress: function (keycode) {
      var fif = document.getElementById("bl_fif");
      if (fif) {
        //console.log(keycode);
        BL._logger(keycode);
        return keycode;
      }
    },

    /**
     * returns creative errors "samsung updates".
     * @method on_BL_Error
     */
    on_BL_Error: function (verb, msg) {
      var fif = document.getElementById("bl_fif");
      if (fif) {
        //
        BL._logger(verb + ": " + msg);
        //
        return verb, msg;
      }
    },

    /**
     * This method called if there are any errors in the ad life cycle
     * @method handleError
     * @param {string} error - the error code is passed
     * @param {string} asset - the URL of the asset where the error occured
     */
    handleError: function (error, asset) {
      BL._logger("code: " + error + " on asset: " + asset);
    },

    /**
     * This method resizes and repositions the friendly iframe with the video player
     * @method BL_resetDisplay
     */
    BL_resetDisplay: function () {
      if (document.getElementById("bl_fif")) {
        var fif = document.getElementById("bl_fif");
        fif.style.width = BL.player_attributes.width;
        fif.style.height = BL.player_attributes.height;
        fif.style.position = "absolute";
        fif.style.top = BL.player_attributes.top;
        fif.style.left = BL.player_attributes.left;
      }
    },

    //get top and left values from each property
    getTopLeftValues: function (body_property) {
      var top_value, left_value;

      body_property = body_property.replace(/px/g, "");
      body_property = body_property.split(" ");
      top_value = body_property[0];
      left_value =
        body_property.length > 3
          ? body_property[3]
          : body_property.length > 1
          ? body_property[1]
          : body_property[0];

      top_value = parseInt(top_value, 10);
      left_value = parseInt(left_value, 10);

      return {
        top_value: top_value,
        left_value: left_value,
      };
    },

    /**
     * This method checks and populates the player_attributes object. The friendly iframe will use these values for positioning
     * @method checkPlayerAttributes
     */
    checkPlayerAttributes: function () {
      if (BL.video_target) {
        var body = document.getElementsByTagName("body")[0];
        var body_rect = body.getBoundingClientRect();

        var body_style = window.getComputedStyle(body);
        var body_margin = body_style.getPropertyValue("margin");
        var body_padding = body_style.getPropertyValue("padding");
        var body_top_margin,
          body_left_margin,
          body_top_padding,
          body_left_padding;

        //if (body_margin !== null || body_margin !== undefined) {
        if (typeof body_margin !== "undefined" && body_margin !== null) {
          //margin values
          var margin_values = BL.getTopLeftValues(body_margin);
          body_top_margin = margin_values.top_value;
          body_left_margin = margin_values.left_value;
        }

        //if (body_padding != null || body_padding != undefined) {
        if (typeof body_padding !== "undefined" && body_padding !== null) {
          //padding values
          var padding_values = BL.getTopLeftValues(body_padding);
          body_top_padding = padding_values.top_value;
          body_left_padding = padding_values.left_value;
        }

        var body_top_spacing = body_top_margin + body_top_padding;
        var body_left_spacing = body_left_margin + body_left_padding;

        BL.video_target_width = BL.video_target.clientWidth;
        BL.video_target_height = BL.video_target.clientHeight;
        BL.video_rect = BL.video_target.getBoundingClientRect();

        var player_css = window.getComputedStyle(BL.video_target);
        BL.player_attributes.position = player_css.getPropertyValue("position");
        BL.player_attributes.width = BL.video_target_width + "px";
        BL.player_attributes.height = BL.video_target_height + "px";
        BL.player_attributes.top =
          BL.video_rect.top + body_top_spacing - body_rect.top + "px";
        BL.player_attributes.left =
          BL.video_rect.left + body_left_spacing - body_rect.left + "px";

        if (document.getElementById("bl_fif")) {
          var fif_resize = document.getElementById("bl_fif");
          var fif_resize_rect = fif_resize.getBoundingClientRect();
          if (
            fif_resize.offsetWidth != BL.video_target_width ||
            fif_resize_rect.top != BL.video_target.offsetTop ||
            fif_resize_rect.left != BL.video_target.offsetLeft
          ) {
            BL.BL_resetDisplay();
          }
        }
      }
    },

    guid: function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
      );
    },

    getParameterByName: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    /**
     * This method is used to take the companion banner URL and retrieve its response to use in the friendly iframe. Used by BL_openAd()
     * @method makeHttpObject
     */
    makeHttpObject: function () {
      try {
        return new XMLHttpRequest();
      } catch (error) {}
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (error) {}
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (error) {}

      throw new Error("Could not create HTTP request object.");
    },

    setupWebkitAnalytics: function (deviceInfo) {
      /**
       * _analytics factory
       * @param {object} w - BL object
       */

      (function (w, factory) {
        w._analytics = factory(w);
      })(window.BL, function (w) {
        "use strict";

        /* utility -------------------------------------------------------------------- */

        function includes(collection, value) {
          for (var i = 0; i < collection.length; i++)
            if (collection[i] == value) return true;

          return false;
        }

        function isObject(object) {
          if (Object.prototype.toString.call(object) === "[object Object]") {
            return true;
          }
          return false;
        }

        function isArray(object) {
          if (Object.prototype.toString.call(object) === "[object Array]") {
            return true;
          }
          return false;
        }

        function hasProperty(object, name) {
          return object.hasOwnProperty(name);
        }

        function forEach(collection, callback, scope) {
          if (
            Object.prototype.toString.call(collection) === "[object Object]"
          ) {
            for (var prop in collection) {
              if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                callback.call(scope, collection[prop], prop, collection);
              }
            }
          } else {
            for (var i = 0, len = collection.length; i < len; i++) {
              callback.call(scope, collection[i], i, collection);
            }
          }
        }

        function extend(defaults, options) {
          var extended = {};
          forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
          });
          forEach(options, function (value, prop) {
            extended[prop] = options[prop];
          });
          return extended;
        }

        function getTimestamp() {
          return new Date().getTime();
        }

        function getTimezoneOffset() {
          return new Date().getTimezoneOffset();
        }

        /* network --------------------------------------------------------------------- */

        function makeHttpObject() {
          try {
            return new XMLHttpRequest();
          } catch (error) {}
          try {
            return new ActiveXObject("Msxml2.XMLHTTP");
          } catch (error) {}
          try {
            return new ActiveXObject("Microsoft.XMLHTTP");
          } catch (error) {}

          throw new Error("Unable to create HTTP request object.");
        }

        function doJSONRequest(url, verb, body, success, failure) {
          var request = makeHttpObject();
          request.open(verb, encodeURI(url), true);
          request.setRequestHeader("Content-Type", "application/json");

          if (body == null) request.send(null);
          else request.send(JSON.stringify(body));

          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              if (request.status == 200) {
                if (request.responseText) {
                  success(JSON.parse(request.responseText));
                }
              } else {
                failure(request.status, request.statusText);
              }
            }
          };
        }

        function getJSONRequest(url, success, failure) {
          doJSONRequest(url, "GET", null, success, failure);
        }

        function postJSONRequest(url, body, success, failure) {
          doJSONRequest(url, "POST", body, success, failure);
        }

        /* analytics ------------------------------------------------------------------- */
        var configUrl =
          "https://services.brightline.tv/api/v2/config/" + deviceInfo.configId;
        var analytics = {};
        var settings;
        var defaults = {
          deviceInfo: {
            os: "",
            osVersion: "",
            appSessionID: "",
            applicationName: "",
            deviceUUID: "",
            platformName: "",
            mobileCarrier: "",
            manufacturer: "",
            advertiserIdentifier: "",
            applicationIdentifier: "",
            applicationVersion: "",
            sdkVersion: "",
            deviceModel: "",
            screenResolution: "",
            deviceConnectionType: "",
            trackFlag: 0,
          },
        };
        var sinks = [];
        var supports = true;

        function setupEvents() {
          //
          analytics.settings = function () {
            return settings;
          };

          if (!settings.trackers && settings.analytics) {
            settings.trackers = settings.analytics;
          }

          for (var i = 0; i < settings.trackers.length; i++) {
            var tracker = settings.trackers[i];

            if (
              location.protocol == "https:" &&
              tracker.call_uri.match("http://")
            ) {
              tracker.call_uri = tracker.call_uri.replace(
                "http://",
                "https://"
              );
            } else if (
              location.protocol == "http:" &&
              tracker.call_uri.match("https://")
            ) {
              tracker.call_uri = tracker.call_uri.replace(
                "https://",
                "http://"
              );
            }

            var sink = {
              name: tracker.tracker_type
                ? tracker.tracker_type
                : tracker.analytic_type,
              events: [],
            };
            if (!tracker.triggers && tracker.eventPoints) {
              tracker.triggers = tracker.eventPoints;
            }

            for (var j = 0; j < tracker.triggers.length; j++) {
              var trigger = tracker.triggers[j];
              if (
                (typeof isSamsung == "undefined" ||
                  isSamsung == false ||
                  isSamsung == "false") &&
                trigger.type !== "app"
              )
                continue;

              var event = {
                name: trigger.eventPoint,
                type: trigger.type,
                app_event_type: trigger.app_event_type,
                verb: tracker.method,
                uri: tracker.call_uri,
                args: trigger.omit_request_base_args
                  ? {}
                  : tracker.call_request_base_args.data,
              };

              for (var k = 0; k < tracker.additional_request_args.length; k++) {
                var extraArgs = tracker.additional_request_args[k];
                if (includes(extraArgs.subscribers, event.name)) {
                  event.args = extend(event.args, extraArgs.args);
                }
              }

              sink.events.push(event);
            }
            sinks.push(sink);
          }

          setTimeout(function () {
            BL._analytics.raiseEvent("OnInit", {
              elementUrl: location.href,
            });
            BL._analytics.raiseEvent("OnManifestLoaded");
          }, 100);
        }

        function findEvents(name) {
          var events = [];
          for (var i = 0; i < sinks.length; i++) {
            for (var j = 0; j < sinks[i].events.length; j++) {
              if (sinks[i].events[j].name == name)
                events.push(sinks[i].events[j]);
            }
          }
          return events;
        }

        function evalEvent(event, args) {
          var body = {};

          forEach(event.args, function (value, prop) {
            var newProp = prop;
            var newValue = value;
            if (prop == "user_init" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "action_type" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "action_name" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "type" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "duration_type" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "percent_complete" && isObject(event.args[prop])) {
              if ((hasProperty(event.args[prop]), event.name))
                newValue = event.args[prop][event.name];
            }

            if (prop == "test_group") return;

            if (
              prop == "c1" /*||
               prop == "c2" ||
              prop == "c3" ||
              prop == "c4" ||
              prop == "c5" */
            )
              return;

            switch (value) {
              case "%C1%":
                newValue = null;
                break;
              case "%C2%":
                newValue = null;
                break;
              case "%C3%":
                !BL.channelName == ""
                  ? (newValue = BL.channelName)
                  : (newValue = null);
                break;
              case "%C4%":
                !BL.hostPlatform == ""
                  ? (newValue = BL.hostPlatform)
                  : (newValue = null);
                break;
              case "%C5%":
                !BL.windowURL == ""
                  ? (newValue = BL.windowURL)
                  : (newValue = null);
                break;
              case "%ID%":
                newValue =
                  event.type == "impression" ? settings.adSessionID : null;
                break;
              case "%TYPE%":
                if (!isObject(event.args[prop])) newValue = event.type;
                break;
              case "%APP_SESSION_ID%":
                newValue = settings.deviceInfo.appSessionID;
                break;
              case "%APP_EVENT_TYPE%":
                newValue = event.app_event_type;
                break;
              case "%PLATFORM_APP_ID%":
                newValue =
                  typeof isSamsung == "undefined" ||
                  isSamsung == false ||
                  isSamsung == "false"
                    ? settings.deviceInfo.applicationIdentifier
                    : "Samsung";
                break;
              case "%PLATFORM_APP_V%":
                newValue = settings.deviceInfo.applicationVersion;
                break;
              case "%APP_ID%":
                newValue = settings.developer.id;
                break;
              case "%APP_NAME%":
                newValue = settings.deviceInfo.applicationName;
                break;
              case "%DISPLAY_TITLE%":
                newValue = args.display;
                break;
              case "%MEDIA_VER%":
                newValue = null;
                break;
              case "%SESSION_ID%":
                newValue = settings.adSessionID;
                break;
              case "%AD_ID%":
                newValue = adInfo.adID;
                break;
              case "%RAD_ID%":
                newValue = adInfo.adID;
                break;
              case "%CAMAIGN_ID%":
                newValue = adInfo.campaignID;
                break;
              case "%RCAMAIGN_ID%":
                newValue = adInfo.campaignID;
                break;
              case "%CREATIVE_ID%":
                newValue = adInfo.creativeID;
                break;
              case "%RCREATIVE_ID%":
                newValue = adInfo.creativeID;
                break;
              case "%LINE_ITEM_ID%":
                newValue = adInfo.lineItemID;
                break;
              case "%AD_UNIT1%":
                newValue = adInfo.adUnit1;
                break;
              case "%RAD_UNIT1%":
                newValue = adInfo.adUnit1;
                break;
              case "%AD_UNIT2%":
                newValue = adInfo.adUnit2;
                break;
              case "%RAD_UNIT2%":
                newValue = adInfo.adUnit2;
                break;
              case "%REFERRER_PAGE_ID%":
                newValue = args.referrerPageId;
                break;
              case "%PAGE_ID%":
                newValue = args.page_id;
                break;
              case "%PAGE_VIEW_COUNT%":
                newValue = args.pageViewCount;
                break;
              case "%ELEMENT_URL%":
                newValue = args.elementUrl;
                break;
              case "%META%":
                newValue = null;
                break;
              case "%VIDEO_VIEW_ID%":
                newValue = args.videoViewId;
                break;
              case "%DURATION%":
                newValue = args.duration;
                break;
              case "%TRACK_FLAG%":
                //console.log(BL.deviceInfo.trackFlag);
                //console.log(BL.on_deviceInfo().trackFlag);
                //newValue = settings.deviceInfo.trackFlag;
                BL.deviceInfo.trackFlag === false ||
                BL.deviceInfo.trackFlag === null
                  ? (newValue = 0)
                  : (newValue = 1);
                break;
              case "%REFERRER_AD_ID%":
                newValue =
                  typeof adInfo != "undefined" ? adInfo.referrer_ad_id : null;
                break;
              case "%REFERRER_SESSION_ID%":
                newValue = null;
                break;
              case "%DEVICE_ID%":
                newValue = settings.deviceInfo.deviceUUID;
                break;
              case "%RDEVICE_ID%":
                newValue = settings.deviceInfo.deviceUUID;
                break;
              case "%DEVICE_MODEL%":
                newValue = settings.deviceInfo.deviceModel;
                break;
              case "%RDEVICE_MODEL%":
                newValue = settings.deviceInfo.deviceModel;
                break;
              case "%DEVICE_VERSION%":
                newValue = null;
                break;
              case "%RDEVICE_VERSION%":
                newValue = null;
                break;
              case "%CLIENT_HEIGHT%":
                newValue = window.innerHeight;
                break;
              case "%CLIENT_WIDTH%":
                newValue = window.innerWidth;
                break;
              case "%CLIENT_TIME%":
                newValue = getTimestamp();
                break;
              case "%CLIENT_OFFSET%":
                newValue = getTimezoneOffset();
                break;
              case "%HOME_ID%":
                newValue = null;
                break;
              case "%LATITUDE%":
                newValue = settings.location.latitude;
                break;
              case "%LONGITUDE%":
                newValue = settings.location.longitude;
                break;
              case "%CONNECTION_TYPE%":
                newValue = settings.deviceInfo.deviceConnectionType;
                break;
              case "%CARRIER%":
                newValue = settings.deviceInfo.mobileCarrier;
                break;
              case "%RCARRIER%":
                newValue = settings.deviceInfo.mobileCarrier;
                break;
              case "%PLATFORM%":
                newValue = settings.deviceInfo.platformName;
                break;
              case "%SDK_V%":
                newValue = settings.deviceInfo.sdkVersion;
                break;
              case "%USER_ID%":
                newValue = null;
                break;
              case "%ADVERTISER_ID%":
                newValue = settings.deviceInfo.advertisingIdentifier
                  ? settings.deviceInfo.advertisingIdentifier
                  : BL.deviceInfo.advertisingIdentifier;
                /*  BL.on_deviceInfo().advertisingIdentifier === null ||
                BL.on_deviceInfo().advertisingIdentifier === ""
                  ? (newValue = settings.deviceInfo.advertisingIdentifier)
                  : (newValue = BL.on_deviceInfo().advertisingIdentifier); */

                break;
              case "%RADVERTISER_ID%":
                newValue = settings.deviceInfo.advertisingIdentifier
                  ? settings.deviceInfo.advertisingIdentifier
                  : settings.deviceInfo.advertiserIdentifier;
                break;
              default:
                break;
            }

            //
            /* body = { ...body, key: "value" }; */
            !BL.urlSessionID == ""
              ? (body["session_id"] = BL.urlSessionID)
              : null;

            //
            if (newValue != null) body[newProp] = newValue;
          });

          return {
            url: event.uri,
            verb: event.verb,
            body: body,
          };
        }

        analytics.settings = function () {
          return settings;
        };
        analytics.makeHttpObject = makeHttpObject;

        analytics.destroy = function () {
          if (!settings) return;
          events = [];
          settings = null;
        };

        analytics.init = function (options) {
          if (!supports) return;

          analytics.destroy();
          settings = extend(defaults, options || {});

          if (!settings.developer) {
            postJSONRequest(
              configUrl,
              settings.deviceInfo,
              function (data) {
                settings = extend(settings, data || {});
                setupEvents();
              },
              function (status, statusText) {
                /* LOG : alert(status + statusText); */
              }
            );
          } else {
            setupEvents();
          }
        };

        analytics.raiseEvent = function (name, args) {
          window.BL._logger("[raiseEvent] " + name + JSON.stringify(args));

          //
          var events = findEvents(name);
          for (var i = 0; i < events.length; i++) {
            var request = evalEvent(events[i], args);
            if (request.verb == "GET") {
              var protocol = "";
              if (request.url.startsWith("//")) protocol = location.protocol;
              request.url =
                protocol +
                request.url +
                "?data=" +
                JSON.stringify(request.body);

              getJSONRequest(
                request.url,
                function (data) {},
                function (status, statusText) {}
              );
            } else {
              if (!request.url.match("//"))
                request.url = location.protocol + request.url;
              postJSONRequest(
                request.url,
                request.body,
                function (data) {},
                function (code, text) {}
              );
            }
          }
        };

        return analytics;
      });

      if (typeof deviceInfo == "string") {
        deviceInfo = JSON.parse(deviceInfo);
      }

      if (BL.adSessionID) {
        deviceInfo.adSessionID = BL.adSessionID;
      } else if (!BL.getParameterByName("session_id")) {
        deviceInfo.adSessionID = BL.guid();
      } else {
        deviceInfo.adSessionID = BL.getParameterByName("session_id");
      }

      BL.adSessionID = deviceInfo.adSessionID;
      BL._analytics.init(deviceInfo);
    },
    genGUID: function () {
      function setCookie(cvalue) {
        if (typeof Storage !== "undefined") {
          // Code for localStorage/sessionStorage.

          localStorage.setItem("brightline", cvalue);
        } else {
          // Sorry! No Web Storage support. Try cookies instead.
          var d = new Date();
          d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          document.cookie = "brightline=" + cvalue + ";" + expires + ";path=/";
        }
      }

      function getCookie() {
        var name = "brightline=";
        if (typeof Storage !== "undefined") {
          return localStorage.getItem("brightline");
        }
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

      var isAFTB = navigator.userAgent.match("AFTB");
      var cookie = getCookie();
      var uuid;

      if (cookie === "" || cookie === null) {
        var d = new Date().getTime();
        uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
          }
        );
        setCookie(uuid);
      } else {
        uuid = cookie;
      }
      return uuid;
    },

    // checking enableAnalytics param fallback sdk
    checkParam: function () {
      if (window.location.search) {
        const urlParams = window.location.search.substring(1).split("&");

        for (let i = 0; i < urlParams.length; i++) {
          const param = urlParams[i].split("=");

          if (param[0] === "enableAnalytics") {
            const enableAnalytics =
              param[1] === undefined ? null : decodeURIComponent(param[1]);

            if (enableAnalytics !== null) {
              if (enableAnalytics === "false") {
                BL.enableAnalytics = false;
              }
            }
          }
        }
      }
    },

    //
    init: function () {
      this.deviceInfo = BL.on_deviceInfo();
      console.log(this.deviceInfo);
      //
      BL.enableAnalytics = this.deviceInfo.enableAnalytics;
      this.checkParam();
      //console.log(this.deviceInfo);
      //this.deviceInfo.advertisingIdentifier = this.genGUID();

      this.deviceInfo.deviceUUID = this.genGUID();
      if (this.deviceInfo.configId) {
        var request = this.makeHttpObject();
        var url = this.configUrl + this.deviceInfo.configId;
        request.open("POST", encodeURI(url), true);
        request.setRequestHeader("Content-Type", "application/json");
        if (BL.enableAnalytics !== false) {
          request.send(JSON.stringify(this.deviceInfo));
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              if (request.status == 200) {
                BL.config = request.responseText;
                BL.setupWebkitAnalytics(BL.config);
              } else {
                BL._logger("[BL] config Request failed: " + request.status);
              }
            }
          };
        }
      }
    },
  };
  return BL;
};

var context = window || this;
context.BL = BLFactory();
