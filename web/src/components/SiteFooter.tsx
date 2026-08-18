import React from 'react'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="site-footer__tag">One sip, one bite, one step at a time.</p>
        <div className="site-footer__grid">
          <div>
            <h2>Find the market</h2>
            <p>
              2401 Welton St
              <br />
              Five Points, Denver, CO
            </p>
          </div>
          <div>
            <h2>Say hello</h2>
            <p>
              <a href="mailto:mbgmanager@gmail.com">mbgmanager@gmail.com</a>
            </p>
          </div>
          <div>
            <h2>Follow along</h2>
            <p>
              <a
                href="https://www.facebook.com/mobettagreenMKT/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @mobettagreenMKT
              </a>
              <br />
              <a
                href="https://www.instagram.com/mobettagreen/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @mobettagreen
              </a>
            </p>
          </div>
        </div>
        <div className="site-footer__legal">
          <span>&copy; {new Date().getFullYear()} R&amp;B&rsquo;s Mo&rsquo;Betta Green MarketPlace</span>
          <span>
            Site by{' '}
            <a href="https://wrightadventures.org/" target="_blank" rel="noopener noreferrer">
              Wright Adventures
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
