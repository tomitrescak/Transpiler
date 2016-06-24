import React from "react";
import { Grid, Column, Header1, Header3, Jumbo } from 'semanticui-react';

export const Component = () => (
  <main id="home">
    <div className="content">
      <Grid page>
        <Column>
          <Jumbo style={{ background: "white", textAlign: "center", borderRadius: 10 }}>
            <Header1 text="info.unsupportedBrowser" />
            <Header3 text="info.unsupportedBrowserMore" />
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
          </Jumbo>
        </Column>
      </Grid>
    </div>
  </main>
)

export default Component;
