export default function componentStyleOverrides(theme) {
  const bgColor = theme.mode === 'dark' ? theme.backgroundDefault : theme.colors?.grey50;
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px -8px rgba(76, 175, 80, 0.4)'
          },
          '&:active': {
            transform: 'translateY(0)'
          },
          '&.Mui-disabled': {
            color: theme.colors?.grey600,
            backgroundColor: theme.colors?.grey200
          }
        },
        contained: {
          boxShadow: '0 4px 12px -4px rgba(76, 175, 80, 0.4)',
          '&:hover': {
            boxShadow: '0 12px 24px -8px rgba(76, 175, 80, 0.5)'
          }
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(76, 175, 80, 0.04)'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          boxShadow: theme.mode === 'dark'
            ? '0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 20px 40px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          borderRadius: '16px',
          marginTop: '8px',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'
        },
        listbox: {
          padding: '8px',
          '& .MuiAutocomplete-option': {
            borderRadius: '8px',
            marginBottom: '2px'
          }
        },
        option: {
          fontSize: '0.9375rem',
          fontWeight: '500',
          padding: '10px 14px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.08)'
          },
          '&[aria-selected="true"]': {
            backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.12)',
            fontWeight: '600'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          color: theme.darkTextPrimary,
          '&:hover': {
            backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : theme.colors?.grey200,
            transform: 'scale(1.05)'
          },
          '&:active': {
            transform: 'scale(0.95)'
          }
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        rounded: {
          borderRadius: `${theme?.customization?.borderRadius}px`
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: theme.mode === 'dark'
            ? '0 8px 24px -8px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 8px 24px -8px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.03)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.mode === 'dark'
              ? '0 16px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)'
              : '0 16px 40px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(15, 23, 42, 0.05)'
          }
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors?.textDark,
          padding: '24px',
          borderBottom: theme.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(15, 23, 42, 0.05)'
        },
        title: {
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.01em'
        },
        subheader: {
          fontSize: '0.875rem',
          marginTop: '4px',
          opacity: 0.7
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px'
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: theme.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(15, 23, 42, 0.05)'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          marginBottom: '4px',
          transition: 'all 0.2s ease',
          color: theme.darkTextPrimary,
          paddingTop: '10px',
          paddingBottom: '10px',
          position: 'relative',
          '&.Mui-selected': {
            color: theme.menuSelected,
            backgroundColor: theme.menuSelectedBack,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: theme.menuSelectedBack
            },
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '4px',
              height: '60%',
              borderRadius: '0 4px 4px 0',
              backgroundColor: theme.menuSelected
            }
          },
          '&:hover': {
            backgroundColor: theme.menuSelectedBack,
            color: theme.menuSelected,
            transform: 'translateX(4px)',
            '& .MuiListItemIcon-root': {
              color: theme.menuSelected
            }
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.darkTextPrimary,
          minWidth: '40px',
          transition: 'all 0.2s ease'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark,
          fontWeight: 500,
          fontSize: '0.9375rem'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease'
        },
        input: {
          color: theme.textDark,
          '&::placeholder': {
            color: theme.darkTextSecondary,
            fontSize: '0.9375rem',
            opacity: 0.6
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: bgColor,
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.colors?.grey300,
            borderWidth: '2px',
            transition: 'all 0.3s ease'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.4)' : theme.colors?.primaryLight,
            borderWidth: '2px'
          },
          '&.Mui-focused': {
            backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.05)' : 'rgba(76, 175, 80, 0.02)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.colors?.primaryMain,
              borderWidth: '2px',
              boxShadow: theme.mode === 'dark' ? '0 0 0 4px rgba(76, 175, 80, 0.1)' : '0 0 0 4px rgba(76, 175, 80, 0.08)'
            }
          },
          '&.MuiInputBase-multiline': {
            padding: '12px'
          }
        },
        input: {
          fontWeight: 500,
          background: 'transparent',
          padding: '14px 16px',
          fontSize: '0.9375rem',
          '&.MuiInputBase-inputSizeSmall': {
            padding: '10px 14px',
            fontSize: '0.875rem'
          }
        },
        inputAdornedStart: {
          paddingLeft: 4
        },
        notchedOutline: {
          borderRadius: '12px'
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 6,
          '&.Mui-disabled': {
            color: theme.colors?.grey300
          }
        },
        thumb: {
          width: 20,
          height: 20,
          transition: 'all 0.3s ease',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 0 0 8px rgba(76, 175, 80, 0.16)',
            transform: 'scale(1.1)'
          }
        },
        track: {
          height: 6,
          borderRadius: 3
        },
        rail: {
          height: 6,
          borderRadius: 3,
          opacity: 0.3
        },
        mark: {
          backgroundColor: theme.paper,
          width: '4px',
          height: '4px',
          borderRadius: '50%'
        },
        valueLabel: {
          borderRadius: '8px',
          padding: '4px 8px',
          backgroundColor: theme.colors?.primaryMain,
          fontWeight: 600
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : theme.divider,
          opacity: 1
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: theme.colors?.primaryDark,
          background: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : theme.colors?.primary200,
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '0.8125rem',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)'
          },
          '&.MuiChip-deletable .MuiChip-deleteIcon': {
            color: 'inherit',
            opacity: 0.7,
            transition: 'all 0.2s ease',
            '&:hover': {
              opacity: 1,
              transform: 'scale(1.1)'
            }
          }
        },
        filled: {
          fontWeight: 600
        },
        outlined: {
          borderWidth: '2px',
          fontWeight: 600
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme.mode === 'dark'
            ? '0 4px 12px -4px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px -4px rgba(15, 23, 42, 0.08)'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: theme.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.05)'
            : '1px solid ' + theme.tableBorderBottom,
          padding: '16px',
          fontSize: '0.9375rem',
          textAlign: 'center',
          transition: 'all 0.2s ease'
        },
        head: {
          color: theme.darkTextSecondary,
          backgroundColor: theme.mode === 'dark'
            ? 'rgba(76, 175, 80, 0.05)'
            : theme.headBackgroundColor,
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          borderBottom: theme.mode === 'dark'
            ? '2px solid rgba(76, 175, 80, 0.2)'
            : '2px solid rgba(76, 175, 80, 0.1)',
          padding: '18px 16px'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: theme.mode === 'dark'
              ? 'rgba(76, 175, 80, 0.05)'
              : theme.headBackgroundColor,
            transform: 'scale(1.001)'
          },
          '&:last-child .MuiTableCell-root': {
            borderBottom: 'none'
          }
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : theme.colors?.grey900,
          color: theme.colors.paper,
          fontSize: '0.8125rem',
          fontWeight: 500,
          padding: '8px 12px',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.3)'
        },
        arrow: {
          color: theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : theme.colors?.grey900
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: theme.mode === 'dark'
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.6)'
            : '0 24px 48px -12px rgba(15, 23, 42, 0.2)',
          backdropFilter: 'blur(10px)'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 700,
          padding: '24px 24px 16px',
          letterSpacing: '-0.01em'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: '12px'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '0.9375rem',
          fontWeight: 500,
          boxShadow: theme.mode === 'dark'
            ? '0 4px 12px -4px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px -4px rgba(15, 23, 42, 0.08)'
        },
        standardSuccess: {
          backgroundColor: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.15)' : theme.colors?.successLight,
          color: theme.colors?.successDark
        },
        standardError: {
          backgroundColor: theme.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : theme.colors?.errorLight,
          color: theme.colors?.errorDark
        },
        standardWarning: {
          backgroundColor: theme.mode === 'dark' ? 'rgba(245, 158, 11, 0.15)' : theme.colors?.warningLight,
          color: theme.colors?.warningDark
        },
        standardInfo: {
          backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.15)' : theme.colors?.primaryLight,
          color: theme.colors?.primaryDark
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 52,
          height: 32,
          padding: 0
        },
        switchBase: {
          padding: 4,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.colors?.primaryMain,
              opacity: 1
            }
          }
        },
        thumb: {
          width: 24,
          height: 24,
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        },
        track: {
          borderRadius: 16,
          backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : theme.colors?.grey300,
          opacity: 1,
          transition: 'all 0.3s ease'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: `
      * {
        scrollbar-width: thin;
        scrollbar-color: ${theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'} transparent;
      }

      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      *::-webkit-scrollbar-track {
        background: transparent;
      }

      *::-webkit-scrollbar-thumb {
        background: ${theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'};
        border-radius: 10px;
        transition: all 0.3s ease;
      }

      *::-webkit-scrollbar-thumb:hover {
        background: ${theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.4)'};
      }

      .apexcharts-title-text {
        fill: ${theme.textDark} !important;
        font-weight: 700 !important;
      }
      .apexcharts-text {
        fill: ${theme.textDark} !important
      }
      .apexcharts-legend-text {
        color: ${theme.textDark} !important
      }
      .apexcharts-menu {
        background: ${theme.backgroundDefault} !important;
        border-radius: 12px !important;
        box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.2) !important;
      }
      .apexcharts-gridline, .apexcharts-xaxistooltip-background, .apexcharts-yaxistooltip-background {
        stroke: ${theme.divider} !important;
      }
      `
    }
  };
}
