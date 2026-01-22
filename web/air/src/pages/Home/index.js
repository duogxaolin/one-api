import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row } from '@douyinfe/semi-ui';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [statusState] = useContext(StatusContext);
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const { t } = useTranslation();

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        const htmlNotice = marked(data);
        showNotice(htmlNotice, true);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);
    } else {
      showError(message);
      setHomePageContent(t('home.loading_failed'));
    }
    setHomePageContentLoaded(true);
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.start_time;
    return statusState.status ? timestamp2string(timestamp) : '';
  };

  useEffect(() => {
    displayNotice().then();
    displayHomePageContent().then();
  }, []);
  return (
    <>
      {
        homePageContentLoaded && homePageContent === '' ?
          <>
            <Card
              bordered={false}
              headerLine={false}
              title={t('home.system_status.title')}
              bodyStyle={{ padding: '10px 20px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    title={t('home.system_status.info.title')}
                    headerExtraContent={<span
                      style={{ fontSize: '12px', color: 'var(--semi-color-text-1)' }}>{t('home.system_status.info.title')}</span>}>
                    <p>{t('home.system_status.info.name')}{statusState?.status?.system_name}</p>
                    <p>{t('home.system_status.info.version')}{statusState?.status?.version ? statusState?.status?.version : 'unknown'}</p>
                    <p>
                      {t('home.system_status.info.source')}
                      <a
                        href='https://github.com/songquanpeng/one-api'
                        target='_blank' rel='noreferrer'
                      >
                        https://github.com/songquanpeng/one-api
                      </a>
                    </p>
                    <p>{t('home.system_status.info.start_time')}{getStartTimeString()}</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={t('home.system_status.config.title')}
                    headerExtraContent={<span
                      style={{ fontSize: '12px', color: 'var(--semi-color-text-1)' }}>{t('home.system_status.config.title')}</span>}>
                    <p>
                      {t('home.system_status.config.email_verify')}
                      {statusState?.status?.email_verification === true ? t('home.system_status.config.enabled') : t('home.system_status.config.disabled')}
                    </p>
                    <p>
                      {t('home.system_status.config.github_oauth')}
                      {statusState?.status?.github_oauth === true ? t('home.system_status.config.enabled') : t('home.system_status.config.disabled')}
                    </p>
                    <p>
                      {t('home.system_status.config.wechat_login')}
                      {statusState?.status?.wechat_login === true ? t('home.system_status.config.enabled') : t('home.system_status.config.disabled')}
                    </p>
                    <p>
                      {t('home.system_status.config.turnstile')}
                      {statusState?.status?.turnstile_check === true ? t('home.system_status.config.enabled') : t('home.system_status.config.disabled')}
                    </p>
                    {/*<p>*/}
                    {/*  Telegram 身份验证：*/}
                    {/*  {statusState?.status?.telegram_oauth === true*/}
                    {/*    ? t('home.system_status.config.enabled') : t('home.system_status.config.disabled')}*/}
                    {/*</p>*/}
                  </Card>
                </Col>
              </Row>
            </Card>

          </>
          : <>
            {
              homePageContent.startsWith('https://') ?
                <iframe src={homePageContent} style={{ width: '100%', height: '100vh', border: 'none' }} /> :
                <div style={{ fontSize: 'larger' }} dangerouslySetInnerHTML={{ __html: homePageContent }}></div>
            }
          </>
      }

    </>
  );
};

export default Home;