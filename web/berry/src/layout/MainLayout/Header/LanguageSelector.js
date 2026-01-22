import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconLanguage } from '@tabler/icons-react';

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' }
];

const LanguageSelector = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <>
      <Box
        sx={{
          ml: 2,
          mr: 2,
          [theme.breakpoints.down('md')]: {
            mr: 1
          }
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
            color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
            '&:hover': {
              background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
              color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <IconLanguage stroke={1.5} size="1.3rem" />
        </Avatar>
      </Box>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h4">{currentLanguage.name}</Typography>
                  </Box>
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      maxWidth: 200,
                      minWidth: 150,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '10px',
                      [theme.breakpoints.down('md')]: {
                        minWidth: '100%'
                      },
                      '& .MuiListItemButton-root': {
                        mt: 0.5
                      }
                    }}
                  >
                    {languages.map((lang) => (
                      <ListItemButton
                        key={lang.code}
                        selected={i18n.language === lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <ListItemText primary={lang.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default LanguageSelector;

