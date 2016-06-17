import React from "react";

export const Component = () => (
  <main id="home">
    <div className="content">
      <div className="ui page grid">
        <div className="column">
          <div className="ui jumbo" style={{ background: "white", textAlign: "center", borderRadius: 10 }}>
            <h1 className="ui header">
              { mf("info.unsupportedBrowser") }
            </h1>
            <h3>
              { mf("info.unsupportedBrowserMore") }
            </h3>
            <p>
              <a href="http://chrome.google.com">
                <img src="/images/chrome-logo.png" />
              </a>
              <a href="https://www.mozilla.org/en-US/firefox/new/">
                <img src="/images/firefox-logo.png" />
              </a>
              <a href="http://www.apple.com/safari/">
                <img src="/images/safari-logo.png" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
)

export default Component;
