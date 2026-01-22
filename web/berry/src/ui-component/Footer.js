// material-ui
import { Link, Container, Box } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const Footer = () => {
  const siteInfo = useSelector((state) => state.siteInfo);
  const { t } = useTranslation();

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
      <Box sx={{ textAlign: 'center' }}>
        {siteInfo.footer_html ? (
          <div className="custom-footer" dangerouslySetInnerHTML={{ __html: siteInfo.footer_html }}></div>
        ) : (
          <>
            <Link href="https://github.com/songquanpeng/one-api" target="_blank">
              {siteInfo.system_name} {process.env.REACT_APP_VERSION}{' '}
            </Link>
            {t('footer.built_by')}{' '}
            <Link href="https://github.com/songquanpeng" target="_blank">
              {t('footer.built_by_name')}
            </Link>{' '}
            {t('footer.license')}{' '}
            <Link href="https://opensource.org/licenses/mit-license.php"> {t('footer.mit')}</Link>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Footer;
