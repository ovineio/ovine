import React from 'react'

import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Layout from '@theme/Layout'

import styles from './styles.module.css'

function Home() {
  return (
    <Layout
      permalink="/"
      title="用JSON快速构建管理系统"
      description="RT-ADMIN 用JSON快速构建管理系统"
    >
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroProjectTagline}>
            <img
              alt="DashboardIcon"
              className={styles.heroLogo}
              src={useBaseUrl('img/dashboard.svg')}
            />
            Build <span className={styles.heroProjectKeywords}>complex</span> admin system{' '}
            <span className={styles.heroProjectKeywords}>blazing fast, </span>
            with <span className={styles.heroProjectKeywords}> json</span> schema
          </h1>
          <div className={styles.indexCtas}>
            <Link className={styles.indexCtasGetStartedButton} to={useBaseUrl('docs/introduction')}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.announcementDark} />
      <div className={styles.section}>
        <div className="container text--center margin-bottom--xl">
          <div className="row">
            <div className="col">
              <img
                className={styles.featureImage}
                alt="Powered by MDX"
                src={useBaseUrl('img/json.svg')}
              />
              <h3 className="padding-top--md">强大JSON配置</h3>
              <p className="padding-horiz--md">
                路由、权限、页面、组件都由 json
                配置，可简单、快速的生成复杂的管理页面。支持通过代码生成 json
                数据渲染组件。也可无缝接入自定义组件。
              </p>
            </div>
            <div className="col">
              <img
                alt="Built Using React"
                className={styles.featureImage}
                src={useBaseUrl('img/limit.svg')}
              />
              <h3 className="padding-top--md">完整权限管理</h3>
              <p className="padding-horiz--md">
                内置企业级权限管理完整实现，并集成到 json 配置中。支持自定义权限、权限依赖、接口 api
                权限、基本可控制页面上渲染的任意节点。
              </p>
            </div>
            <div className="col">
              <img
                alt="Ready for Translations"
                className={styles.featureImage}
                src={useBaseUrl('img/theme.svg')}
              />
              <h3 className="padding-top--md">可扩展自定义主题</h3>
              <p className="padding-horiz--md">
                内置三套主题可选。主题采用 scss
                变量定义，可非常方便修改现有主题或者定制属于自己的新的主题。
              </p>
            </div>
          </div>
        </div>
        <div className="container text--center">
          <div className="row">
            <div className="col col--4 col--offset-2">
              <img
                alt="Document Versioning"
                className={styles.featureImage}
                src={useBaseUrl('img/mock.svg')}
              />
              <h3 className="padding-top--md">高效MOCK方案</h3>
              <p className="padding-horiz--md">
                支持基本的 crud
                模拟数据生成，并且可以完全用程序生成模拟数据来实现各种场景的数据模拟。从而可实现脱离后端开发前端页面。
              </p>
            </div>
            <div className="col col--4">
              <img
                alt="Document Search"
                className={styles.featureImage}
                src={useBaseUrl('img/baidu.svg')}
              />
              <h3 className="padding-top--md">基于百度Amis框架</h3>
              <p className="padding-horiz--md">
                本项目依赖百度 amis 框架二次封装。该框架由百度 FEX
                团队开发，已广泛应用于企业级项目中，经得起实践的考验。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
