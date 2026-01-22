import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/User';
import { API, getLogo, showError, showInfo, showSuccess } from '../helpers';
import { onGitHubOAuthClicked } from './utils';
import Turnstile from 'react-turnstile';
import { Button, Card, Divider, Form, Icon, Layout, Modal } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import TelegramLoginButton from 'react-telegram-login';
import { useTranslation } from 'react-i18next';

import { IconGithubLogo } from '@douyinfe/semi-icons';
import WeChatIcon from './WeChatIcon';

const LoginForm = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    wechat_verification_code: ''
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const [userState, userDispatch] = useContext(UserContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  let navigate = useNavigate();
  const [status, setStatus] = useState({});
  const logo = getLogo();
  const { t } = useTranslation();

  useEffect(() => {
    if (searchParams.get('expired')) {
      showError(t('messages.error.login_expired'));
    }
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);

  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('messages.error.turnstile_wait'));
      return;
    }
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechat_verification_code}`
    );
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/');
      showSuccess(t('messages.success.login'));
      setShowWeChatLoginModal(false);
    } else {
      showError(message);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit(e) {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('messages.error.turnstile_wait'));
      return;
    }
    setSubmitted(true);
    if (username && password) {
      const res = await API.post(`/api/user/login?turnstile=${turnstileToken}`, {
        username,
        password
      });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess(t('messages.success.login'));
        if (username === 'root' && password === '123456') {
          Modal.error({ title: t('messages.error.root_password'), content: t('messages.error.root_password'), centered: true });
        }
        navigate('/token');
      } else {
        showError(message);
      }
    } else {
      showError(t('auth.login.username') + ' / ' + t('auth.login.password'));
    }
  }

  // 添加Telegram登录处理函数
  const onTelegramLoginClicked = async (response) => {
    const fields = ['id', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date', 'hash', 'lang'];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    const res = await API.get(`/api/oauth/telegram/login`, { params });
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      showSuccess(t('messages.success.login'));
      navigate('/');
    } else {
      showError(message);
    }
  };

  return (
    <div>
      <Layout>
        <Layout.Header>
        </Layout.Header>
        <Layout.Content>
          <div style={{ justifyContent: 'center', display: 'flex', marginTop: 120 }}>
            <div style={{ width: 500 }}>
              <Card>
                <Title heading={2} style={{ textAlign: 'center' }}>
                  {t('auth.login.title')}
                </Title>
                <Form>
                  <Form.Input
                    field={'username'}
                    label={t('auth.login.username')}
                    placeholder={t('auth.login.username')}
                    name="username"
                    onChange={(value) => handleChange('username', value)}
                  />
                  <Form.Input
                    field={'password'}
                    label={t('auth.login.password')}
                    placeholder={t('auth.login.password')}
                    name="password"
                    type="password"
                    onChange={(value) => handleChange('password', value)}
                  />

                  <Button theme="solid" style={{ width: '100%' }} type={'primary'} size="large"
                          htmlType={'submit'} onClick={handleSubmit}>
                    {t('auth.login.button')}
                  </Button>
                </Form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                  <Text>
                    {t('auth.login.no_account')} <Link to="/register">{t('auth.login.register')}</Link>
                  </Text>
                  <Text>
                    {t('auth.login.forgot_password')} <Link to="/reset">{t('auth.login.reset_password')}</Link>
                  </Text>
                </div>
                {status.github_oauth || status.wechat_login || status.telegram_oauth ? (
                  <>
                    <Divider margin="12px" align="center">
                      {t('auth.login.other_methods')}
                    </Divider>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                      {status.github_oauth ? (
                        <Button
                          type="primary"
                          icon={<IconGithubLogo />}
                          onClick={() => onGitHubOAuthClicked(status.github_client_id)}
                        />
                      ) : (
                        <></>
                      )}
                      {status.wechat_login ? (
                        <Button
                          type="primary"
                          style={{ color: 'rgba(var(--semi-green-5), 1)' }}
                          icon={<Icon svg={<WeChatIcon />} />}
                          onClick={onWeChatLoginClicked}
                        />
                      ) : (
                        <></>
                      )}

                      {status.telegram_oauth ? (
                        <TelegramLoginButton dataOnauth={onTelegramLoginClicked} botName={status.telegram_bot_name} />
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <Modal
                  title={t('auth.login.other_methods')}
                  visible={showWeChatLoginModal}
                  maskClosable={true}
                  onOk={onSubmitWeChatVerificationCode}
                  onCancel={() => setShowWeChatLoginModal(false)}
                  okText={t('auth.login.button')}
                  size={'small'}
                  centered={true}
                >
                  <div style={{ display: 'flex', alignItem: 'center', flexDirection: 'column' }}>
                    <img src={status.wechat_qrcode} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p>
                      {t('auth.login.wechat.scan_tip')}
                    </p>
                  </div>
                  <Form size="large">
                    <Form.Input
                      field={'wechat_verification_code'}
                      placeholder={t('auth.login.wechat.code_placeholder')}
                      label={t('auth.login.wechat.code_placeholder')}
                      value={inputs.wechat_verification_code}
                      onChange={(value) => handleChange('wechat_verification_code', value)}
                    />
                  </Form>
                </Modal>
              </Card>
              {turnstileEnabled ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                  <Turnstile
                    sitekey={turnstileSiteKey}
                    onVerify={(token) => {
                      setTurnstileToken(token);
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

        </Layout.Content>
      </Layout>
    </div>
  );
};

export default LoginForm;
