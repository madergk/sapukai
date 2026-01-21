import * as React from 'react'
import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#09090b' },
      ],
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundation',
          ['Design Tokens', 'Components Overview'],
          'Primitives',
          ['Button', 'Badge', 'Avatar', 'Divider', 'Heading', 'Text'],
          'Forms',
          ['Input', 'TextArea', 'Checkbox', 'Radio', 'Switch', 'Select', 'Listbox'],
          'Data',
          ['Table', 'DescriptionList'],
          'Feedback',
          ['Dialog'],
          'Navigation',
          ['Dropdown', 'Pagination', 'Navbar', 'Sidebar'],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      
      // Apply theme class to document
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', theme === 'dark')
      }

      return (
        <div className={`${theme === 'dark' ? 'dark bg-zinc-950' : 'bg-white'} min-h-screen p-6`}>
          <Story />
        </div>
      )
    },
  ],
}

export default preview
