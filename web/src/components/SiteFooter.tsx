import React from 'react'

/** Matches the coming-soon page: find-us columns, then the tagline and credit. */
export function SiteFooter() {
  return (
    <>
      <section className="find-us" aria-label="Find us">
        <div className="find-us__grid">
          <div className="find-us__col">
            <h2>Find the market</h2>
            <p className="find-us__addr">
              2401 Welton St
              <br />
              Five Points, Denver, CO
            </p>
            <p className="find-us__note">
              Market days &amp; seasonal locations announced on our social channels.
            </p>
          </div>

          <div className="find-us__col">
            <h2>Say hello</h2>
            <p className="find-us__addr">
              <a className="link" href="mailto:mbgmanager@gmail.com">
                mbgmanager@gmail.com
              </a>
            </p>
            <p className="find-us__note">
              Vendors, partners, volunteers &mdash; we&rsquo;d love to hear from you.
            </p>
          </div>

          <div className="find-us__col">
            <h2>Follow along</h2>
            <p className="find-us__addr">
              <a
                className="link"
                href="https://www.facebook.com/mobettagreenMKT/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @mobettagreenMKT
              </a>
              <br />
              <a
                className="link"
                href="https://www.instagram.com/mobettagreen/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @mobettagreen
              </a>
            </p>
            <p className="find-us__note">Daily updates, market photos, and event news.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p className="site-footer__tag">One sip, one bite, one step at a time.</p>
        <p className="site-footer__meta">
          <span>&copy; {new Date().getFullYear()} R&amp;B&rsquo;s Mo&rsquo;Betta Green MarketPlace</span>
          <span className="dot" aria-hidden="true">
            &bull;
          </span>
          <span>
            Site by{' '}
            <a
              className="link"
              href="https://wrightadventures.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wright Adventures
            </a>
          </span>
        </p>
      </footer>
    </>
  )
}
