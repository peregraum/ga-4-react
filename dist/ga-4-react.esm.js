import React, { useState, useEffect } from 'react';

var GA4ReactGlobalIndex = '__ga4React__';
/**
 * @desc class required to manage google analitycs 4
 * @class GA4React
 *  */

class GA4React {
  constructor(gaCode, gaConfig, additionalGaCode, timeout, options) {
    this.gaCode = gaCode;
    this.gaConfig = gaConfig;
    this.additionalGaCode = additionalGaCode;
    this.timeout = timeout;
    this.options = options;
    this.scriptSyncId = 'ga4ReactScriptSync';
    this.scriptAsyncId = 'ga4ReactScriptAsync';
    this.nonceAsync = '';
    this.nonceSync = '';
    this.gaConfig = gaConfig ? gaConfig : {};
    this.gaCode = gaCode;
    this.timeout = timeout || 5000;
    this.additionalGaCode = additionalGaCode;
    this.options = options;

    if (this.options) {
      var {
        nonce
      } = this.options;
      this.nonceAsync = nonce && nonce[0] ? nonce[0] : '';
      this.nonceSync = nonce && nonce[1] ? nonce[1] : '';
    }
  }
  /**
   * @desc output on resolve initialization
   */


  outputOnResolve() {
    return {
      pageview: this.pageview,
      event: this.event,
      gtag: this.gtag
    };
  }
  /**
   * @desc Return main function for send ga4 events, pageview etc
   * @returns {Promise<GA4ReactResolveInterface>}
   */


  initialize() {
    return new Promise((resolve, reject) => {
      if (GA4React.isInitialized()) {
        reject(new Error('GA4React is being initialized'));
      } // in case of retry logics, remove previous scripts


      var previousScriptAsync = document.getElementById(this.scriptAsyncId);

      if (previousScriptAsync) {
        previousScriptAsync.remove();
      }

      var head = document.getElementsByTagName('head')[0];
      var scriptAsync = document.createElement('script');
      scriptAsync.setAttribute('id', this.scriptAsyncId);
      scriptAsync.setAttribute('async', '');

      if (this.nonceAsync && typeof this.nonceAsync === 'string' && this.nonceAsync.length > 0) {
        scriptAsync.setAttribute('nonce', this.nonceAsync);
      }

      scriptAsync.setAttribute('src', "https://www.googletagmanager.com/gtag/js?id=" + this.gaCode);

      scriptAsync.onload = () => {
        var target = document.getElementById(this.scriptSyncId);

        if (target) {
          target.remove();
        } // in case of retry logics, remove previous script sync


        var previousScriptSync = document.getElementById(this.scriptSyncId);

        if (previousScriptSync) {
          previousScriptSync.remove();
        }

        var scriptSync = document.createElement('script');
        scriptSync.setAttribute('id', this.scriptSyncId);

        if (this.nonceSync && typeof this.nonceSync === 'string' && this.nonceSync.length > 0) {
          scriptSync.setAttribute('nonce', this.nonceSync);
        }

        var scriptHTML = "window.dataLayer = window.dataLayer || [];\n        function gtag(){dataLayer.push(arguments);};\n        gtag('js', new Date());\n        gtag('config', '" + this.gaCode + "', " + JSON.stringify(this.gaConfig) + ");";

        if (this.additionalGaCode) {
          this.additionalGaCode.forEach(code => {
            scriptHTML += "\ngtag('config', '" + code + "', " + JSON.stringify(this.gaConfig) + ");";
          });
        }

        scriptSync.innerHTML = scriptHTML;
        head.appendChild(scriptSync);
        var resolved = this.outputOnResolve();
        Object.assign(window, {
          [GA4ReactGlobalIndex]: resolved
        });
        resolve(resolved);
      };

      scriptAsync.onerror = event => {
        if (typeof event === 'string') {
          reject("GA4React intialization failed " + event);
        } else {
          var error = new Error();
          error.name = 'GA4React intialization failed';
          error.message = JSON.stringify(event, ['message', 'arguments', 'type', 'name']);
          reject(error);
        }
      };


      if (!GA4React.isInitialized()) {
        head.appendChild(scriptAsync);
      }

      setTimeout(() => {
        reject(new Error('GA4React Timeout'));
      }, this.timeout);
    });
  }
  /**
   * @desc send pageview event to gtag
   * @param path
   */


  pageview(path, location, title) {
    return this.gtag('event', 'page_view', {
      page_path: path,
      page_location: location || window.location,
      page_title: title || document.title
    });
  }
  /**
   * @desc set event and send to gtag
   * @param action
   * @param label
   * @param category
   * @param nonInteraction
   */


  event(action, label, category, nonInteraction) {
    if (nonInteraction === void 0) {
      nonInteraction = false;
    }

    return this.gtag('event', action, {
      event_label: label,
      event_category: category,
      non_interaction: nonInteraction
    });
  }
  /**
   * @desc direct access to gtag
   * @param args
   */


  gtag() {
    //@ts-ignore
    return window.gtag(...arguments);
  }
  /**
   * @desc ga is initialized?
   */


  static isInitialized() {
    switch (typeof window[GA4ReactGlobalIndex] !== 'undefined') {
      case true:
        return true;

      default:
        return false;
    }
  }
  /**
   * @desc get ga4react from global
   */


  static getGA4React() {
    if (GA4React.isInitialized()) {
      return window[GA4ReactGlobalIndex];
    } else {
      console.error(new Error('GA4React is not initialized'));
    }
  }

}

var outputGA4 = (children, setComponents, ga4) => {
  setComponents(React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return React.createElement(React.Fragment, null, child);
    } //@ts-ignore


    if (child.type && typeof child.type.name !== 'undefined') {
      return React.cloneElement(child, {
        //@ts-ignore
        ga4: ga4,
        index
      });
    } else {
      return child;
    }
  }));
};

var GA4R = (_ref) => {
  var {
    code,
    timeout,
    config,
    additionalCode,
    children,
    options
  } = _ref;
  var [components, setComponents] = useState(null);
  useEffect(() => {
    if (!GA4React.isInitialized()) {
      var ga4manager = new GA4React("" + code, config, additionalCode, timeout, options);
      ga4manager.initialize().then(ga4 => {
        outputGA4(children, setComponents, ga4);
      }, err => {
        console.error(err);
      });
    } else {
      var ga4 = GA4React.getGA4React();

      if (ga4) {
        outputGA4(children, setComponents, ga4);
      }
    }
  }, []);
  return React.createElement(React.Fragment, null, components);
};

var useGA4React = (gaCode, gaConfig, gaAdditionalCode, gaTimeout, options) => {
  var [ga4, setGA4] = useState(undefined);
  useEffect(() => {
    if (gaCode) {
      switch (GA4React.isInitialized()) {
        case false:
          var ga4react = new GA4React("" + gaCode, gaConfig, gaAdditionalCode, gaTimeout, options);
          ga4react.initialize().then(ga4 => {
            setGA4(ga4);
          }, err => {
            console.error(err);
          });
          break;

        case true:
          setGA4(GA4React.getGA4React());
          break;
      }
    } else {
      setGA4(GA4React.getGA4React());
    }
  }, [gaCode]);
  return ga4;
};

function withTracker(MyComponent) {
  return props => {
    var {
      path,
      location,
      title,
      gaCode,
      gaTimeout,
      gaConfig,
      gaAdditionalCode,
      options
    } = props;
    useEffect(() => {
      switch (GA4React.isInitialized()) {
        case true:
          var ga4 = GA4React.getGA4React();

          if (ga4) {
            ga4.pageview(path, location, title);
          }

          break;

        default:
        case false:
          var ga4react = new GA4React("" + gaCode, gaConfig, gaAdditionalCode, gaTimeout, options);
          ga4react.initialize().then(ga4 => {
            ga4.pageview(path, location, title);
          }, err => {
            console.error(err);
          });
          break;
      }
    });
    return React.createElement(MyComponent, Object.assign({}, props));
  };
}

export default GA4React;
export { GA4R, GA4React, useGA4React, withTracker };
//# sourceMappingURL=ga-4-react.esm.js.map
