import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import clsx from 'clsx'
import Badges from './Badges.mdx'

import styles from './index.module.css'

export default function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext()
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <Badges />
                <div className={styles.buttons}>
                    <Link
                        className="button button--info button--lg button--outline"
                        to="/docs"
                    >
                        Get Started 🤸‍♂️
                    </Link>
                    <Link
                        className="button button--info button--lg button--outline"
                        to="/docs/installation"
                    >
                        tl;dr 👀
                    </Link>
                </div>
            </div>
        </header>
    )
}
