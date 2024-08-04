'use client';

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';
import './globals.css';  // Ensure global CSS is applied

// Define the custom font
const inter = Inter({ subsets: ['latin'] });

// Create the custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Fresh green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF9800', // Warm orange
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F5F5', // Light grey
      paper: '#ffffff', // White paper elements
    },
    text: {
      primary: '#333333', // Dark grey text
      secondary: '#666666', // Medium grey text
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#4CAF50',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#4CAF50',
    },
    body1: {
      fontSize: '1rem',
      color: '#333333',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  },
});

// Define the layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


