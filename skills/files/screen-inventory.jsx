import { useState } from 'react'

const screens = [
  {
    id: 1,
    label: '01 — Home / Dashboard',
    type: 'Home / Dashboard',
    interaction: 'Choose a tool or filter to create a study',
    components: ['Trial banner', 'Welcome greeting', 'Filter chips', 'Tool cards'],
    mermaidNode: 'B[Home / Dashboard]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1.5 flex items-center justify-between">
          <div className="text-[8px] text-blue-700 leading-tight">Free trial ends in 7 days</div>
          <div className="text-[7px] bg-white border border-blue-300 rounded px-1.5 py-0.5">
            Upgrade
          </div>
        </div>
        <div className="px-2 pt-1">
          <div className="text-[8px] text-gray-500">👋 Hello Martin</div>
          <div className="text-sm font-bold leading-tight mt-0.5">Welcome to Optimal!</div>
          <div className="text-[8px] text-gray-500 mt-0.5">Choose a tool or filter below</div>
        </div>
        <div className="flex flex-wrap gap-1 px-2">
          {['Explore', 'Validate', 'Structure', 'Feedback'].map(f => (
            <div key={f} className="text-[7px] border border-gray-300 rounded-full px-2 py-0.5">
              {f}
            </div>
          ))}
        </div>
        <div className="mx-2 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-1">
          <div className="w-5 h-5 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-[8px]">
            ✓
          </div>
          <div className="text-[10px] font-semibold mt-1">Surveys</div>
          <div className="text-[7px] text-gray-400 mt-0.5">
            Quickly gather feedback from real users
          </div>
          <div className="flex gap-1 mt-1.5">
            <div className="text-[7px] bg-green-600 text-white rounded px-1.5 py-0.5">+ New</div>
            <div className="text-[7px] border border-gray-300 rounded px-1.5 py-0.5">▶ Intro</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    label: '02 — Tool Catalog Card',
    type: 'Detail View (within catalog)',
    interaction: 'Start new study, watch intro, or view example',
    components: ['Tool icon', 'Description', 'Methodology tags', 'Action buttons'],
    mermaidNode: 'C[Tool Catalog - Surveys]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        <div className="mx-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="w-8 h-8 bg-purple-100 border border-purple-300 rounded-lg flex items-center justify-center text-sm">
            🧪
          </div>
          <div className="text-xs font-bold mt-2">Prototype testing</div>
          <div className="text-[8px] text-gray-500 mt-1 leading-relaxed">
            Test clickable prototypes with real users to spot usability issues early.
          </div>
          <div className="flex gap-1 mt-1">
            <div className="text-[7px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
              Quantitative
            </div>
            <div className="text-[7px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
              Unmoderated
            </div>
          </div>
          <div className="flex gap-1.5 mt-2">
            <div className="text-[7px] bg-green-600 text-white rounded-full px-2 py-1">+ New</div>
            <div className="text-[7px] border border-gray-300 rounded-full px-2 py-1">▶ Intro</div>
            <div className="text-[7px] border border-gray-300 rounded-full px-2 py-1">
              🔍 Example
            </div>
          </div>
        </div>
        <div className="mx-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="w-8 h-8 bg-pink-100 border border-pink-300 rounded-lg flex items-center justify-center text-sm">
            👆
          </div>
          <div className="text-xs font-bold mt-2">First-click testing</div>
          <div className="text-[8px] text-gray-500 mt-1 leading-relaxed">
            Test where users click first, and whether it sets them on the right path.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    label: '03 — Knowledge Base — Guides',
    type: 'List / Feed',
    interaction: 'Read a methodology guide',
    components: ['Guide cards', 'Illustrations', 'Descriptions'],
    mermaidNode: 'F[Knowledge Base - Guides]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        {['101 guide to tree testing', '101 guide to prototype testing'].map((title, i) => (
          <div key={i} className="mx-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-14 bg-blue-50 flex items-center justify-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center text-[8px] text-blue-400">
                img
              </div>
            </div>
            <div className="p-2">
              <div className="text-[10px] font-bold">{title}</div>
              <div className="text-[7px] text-gray-400 mt-0.5 leading-relaxed">
                A simple guide to using this methodology to find navigation issues.
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 4,
    label: '04 — Side Menu / Drawer',
    type: 'Side Menu / Drawer',
    interaction: 'Navigate between main sections',
    components: ['User name', 'Workspace label', 'Nav items', 'Utility links', 'Avatar menu'],
    mermaidNode: 'G[Side Menu / Drawer]',
    wireframe: (
      <div className="flex w-full h-full">
        <div className="w-3/4 bg-white border-r border-gray-200 flex flex-col p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold italic">Logo</div>
            <div className="text-gray-400 text-xs">✕</div>
          </div>
          <div className="text-[8px] text-gray-600 mb-3">Martin Gomez Kennedy ▾</div>
          <div className="flex flex-col gap-0.5">
            <div className="text-[9px] bg-green-50 text-green-700 rounded px-2 py-1.5 font-medium">
              🏠 Home
            </div>
            <div className="text-[9px] text-gray-600 px-2 py-1.5">📋 Studies</div>
          </div>
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="text-[8px] text-gray-400">💬 Give feedback ↗</div>
            <div className="text-[8px] text-gray-400">❓ Help center ↗</div>
            <div className="border-t border-gray-100 pt-2 mt-1 flex items-center gap-1.5">
              <div className="w-5 h-5 bg-gray-200 rounded-full" />
              <div className="text-[8px] text-gray-600">Martin Gomez K...</div>
              <div className="text-[8px] text-gray-400 ml-auto">⋮</div>
            </div>
          </div>
        </div>
        <div className="w-1/4 bg-gray-100 opacity-50" />
      </div>
    ),
  },
  {
    id: 5,
    label: '05 — User Popover',
    type: 'Dropdown Open',
    interaction: 'Access profile or log out',
    components: ['My profile link', 'Logout link'],
    mermaidNode: 'H[User Popover]',
    wireframe: (
      <div className="flex w-full h-full">
        <div className="w-3/4 bg-white border-r border-gray-200 flex flex-col p-3 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold italic">Logo</div>
            <div className="text-gray-400 text-xs">✕</div>
          </div>
          <div className="text-[8px] text-gray-600 mb-3">Martin Gomez Kennedy ▾</div>
          <div className="flex flex-col gap-0.5">
            <div className="text-[9px] bg-green-50 text-green-700 rounded px-2 py-1.5 font-medium">
              🏠 Home
            </div>
            <div className="text-[9px] text-gray-600 px-2 py-1.5">📋 Studies</div>
          </div>
          <div className="mt-auto">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="absolute bottom-10 right-3 bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 w-24">
              <div className="text-[8px] text-gray-700 px-2 py-1 hover:bg-gray-50 rounded">
                👤 My profile
              </div>
              <div className="text-[8px] text-gray-700 px-2 py-1 hover:bg-gray-50 rounded">
                🚪 Logout
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 bg-gray-100 opacity-50" />
      </div>
    ),
  },
  {
    id: 6,
    label: '06 — My Profile — Form',
    type: 'Settings / Profile View',
    interaction: 'Edit profile information',
    components: [
      'Name fields',
      'Email (read-only)',
      'Job Title',
      'Organization Name',
      'Google SSO section',
    ],
    mermaidNode: 'I[My Profile - Form]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">My Profile</div>
          <div className="text-[7px] text-gray-400">martin.gomez@redsalud.cl</div>
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Name</div>
          <div className="flex gap-1.5">
            <div className="flex-1 border border-gray-300 rounded px-1.5 py-1 text-[8px]">
              Martin
            </div>
            <div className="flex-1 border border-gray-300 rounded px-1.5 py-1 text-[8px]">
              Gomez K...
            </div>
          </div>
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Email</div>
          <div className="border border-gray-200 bg-gray-50 rounded px-1.5 py-1 text-[8px] text-gray-400">
            martin.gomez@redsalud.cl
          </div>
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Job Title</div>
          <div className="border border-gray-300 rounded px-1.5 py-1 text-[8px] h-5" />
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Organization Name</div>
          <div className="border border-gray-300 rounded px-1.5 py-1 text-[8px] h-5" />
        </div>
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50 mt-1">
          <div className="text-[8px] font-medium">Google Account Login</div>
          <div className="text-[7px] text-gray-400 mt-0.5">Connected with Google</div>
          <div className="text-[7px] bg-blue-500 text-white rounded px-2 py-0.5 mt-1 inline-block">
            Disconnect
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    label: '07 — Expanded Navigation Menu',
    type: 'Side Menu / Drawer (Full)',
    interaction: 'Access all navigation + workspace management',
    components: [
      'Full nav list',
      'Switch Workspace',
      'Workspace Settings',
      'Invite Members',
      'Trial badge',
      'Upgrade CTA',
    ],
    mermaidNode: 'G[Side Menu - Expanded]',
    wireframe: (
      <div className="flex flex-col p-3 w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center text-[8px] text-gray-400">
            ✕
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          {[
            'Home',
            'Studies',
            'Switch Workspace',
            'Workspace Settings',
            'Invite Members',
            'My Profile',
            'Log out',
          ].map((item, i) => (
            <div
              key={i}
              className={`text-[9px] px-2 py-1.5 rounded ${i === 0 ? 'font-medium' : 'text-gray-600'}`}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <div className="text-[7px] border border-gray-300 rounded-full px-2 py-0.5">
            Free trial - 7 days
          </div>
          <div className="text-[7px] bg-green-700 text-white rounded-full px-2 py-0.5 font-medium">
            Upgrade
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 8,
    label: '08 — Workspace Settings',
    type: 'Settings',
    interaction: 'Configure workspace across multiple tabs',
    components: [
      'Tab navigation (6 tabs)',
      'Workspace Name field',
      'Subdomain field',
      'Warning text',
    ],
    mermaidNode: 'K[Workspace Settings]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">Settings</div>
          <div className="text-[7px] text-gray-400">Martin Gomez Kennedy's Workspace</div>
        </div>
        <div className="flex gap-0 text-[7px] border-b border-gray-200">
          {['Settings', 'Members', 'Usage', 'Plans', 'Billing', 'Features'].map((t, i) => (
            <div
              key={i}
              className={`px-1.5 py-1 ${i === 0 ? 'border-b-2 border-green-600 font-medium' : 'text-gray-400'}`}
            >
              {t}
            </div>
          ))}
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Workspace Name</div>
          <div className="border border-gray-300 rounded px-1.5 py-1 text-[8px]">
            Martin Gomez Kennedy's...
          </div>
        </div>
        <div>
          <div className="text-[8px] font-medium mb-0.5">Workspace Subdomain</div>
          <div className="flex items-center gap-0.5">
            <div className="text-[7px] text-gray-400">http://</div>
            <div className="border border-gray-300 rounded px-1.5 py-1 text-[8px] flex-1">
              2358obq9
            </div>
            <div className="text-[7px] text-gray-400">.optimalworkshop.com</div>
          </div>
          <div className="text-[7px] text-orange-500 mt-0.5 italic">
            ⚠ Changing subdomain will break links
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 9,
    label: '09 — Workspace Branding',
    type: 'Settings (scroll continuation)',
    interaction: 'Upload logo and set brand color',
    components: ['Logo drop zone', 'Color picker', 'Hex input', 'Update button'],
    mermaidNode: 'L[Workspace Branding]',
    wireframe: (
      <div className="flex flex-col gap-2.5 w-full p-3">
        <div>
          <div className="text-[8px] font-medium mb-1">Logo</div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <div className="text-[9px] text-gray-500 font-medium">Drop image file here</div>
            <div className="text-[7px] text-gray-400 mt-0.5">.png, .jpg, or .gif</div>
            <div className="text-[7px] text-blue-500 mt-0.5">or browse for a file</div>
          </div>
        </div>
        <div>
          <div className="text-[8px] font-medium mb-1">Color</div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-teal-700 rounded" />
            <div className="border border-gray-300 rounded px-1.5 py-1 text-[8px]">#007A66</div>
          </div>
        </div>
        <div className="text-[8px] bg-green-600 text-white rounded px-3 py-1.5 font-medium w-fit mt-1">
          Update
        </div>
      </div>
    ),
  },
  {
    id: 10,
    label: '10 — Workspace Switcher',
    type: 'Dropdown Open',
    interaction: 'Switch between workspaces',
    components: [
      'Current workspace (checkmark)',
      'Workspace settings shortcut',
      'Invite members shortcut',
    ],
    mermaidNode: 'T[Workspace Switcher]',
    wireframe: (
      <div className="flex w-full h-full">
        <div className="w-3/4 bg-white border-r border-gray-200 flex flex-col p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold italic">Logo</div>
            <div className="text-gray-400 text-xs">✕</div>
          </div>
          <div className="text-[8px] text-gray-600 mb-1 flex items-center gap-1">
            Martin Gomez Kennedy <span className="text-[10px]">▴</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-1.5 mb-3">
            <div className="text-[8px] bg-green-50 text-gray-700 px-2 py-1 rounded flex items-center justify-between">
              <span>RedSalud Casa Matriz's Workspace</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="border-t border-gray-100 my-0.5" />
            <div className="text-[8px] text-gray-600 px-2 py-1">⚙ Workspace settings</div>
            <div className="text-[8px] text-gray-600 px-2 py-1">✉ Invite members</div>
          </div>
        </div>
        <div className="w-1/4 bg-gray-100 opacity-50" />
      </div>
    ),
  },
  {
    id: 11,
    label: '11 — Create Your First Study',
    type: 'Category / Browse (Empty State)',
    interaction: 'Choose a study type to get started',
    components: ['Guided heading', 'Study type cards', 'Same card pattern as home'],
    mermaidNode: 'R[Create Your First Study]',
    wireframe: (
      <div className="flex flex-col gap-2 w-full p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-bold italic">Logo</div>
          <div className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
            <div className="w-4 h-0.5 bg-gray-400" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold">Create your first study</div>
          <div className="text-[8px] text-gray-500">Choose a study type below to get started:</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center text-[8px]">
            ✓
          </div>
          <div className="text-[10px] font-semibold mt-1.5">Surveys</div>
          <div className="text-[7px] text-gray-400 mt-0.5">
            Quickly gather feedback from real users
          </div>
          <div className="flex gap-1 mt-1.5">
            <div className="text-[7px] bg-green-600 text-white rounded-full px-2 py-0.5">+ New</div>
            <div className="text-[7px] border border-gray-300 rounded-full px-2 py-0.5">
              ▶ Intro
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <div className="w-6 h-6 bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-[8px]">
            💬
          </div>
          <div className="text-[10px] font-semibold mt-1.5">Qualitative insights</div>
          <div className="text-[7px] text-gray-400 mt-0.5">Gather in-depth qualitative data</div>
        </div>
      </div>
    ),
  },
  {
    id: 12,
    label: '12 — Recruiting Participants',
    type: 'Category / Browse',
    interaction: 'Choose participant recruitment method',
    components: ['Section header', 'Managed Recruitment card', 'Standard Recruitment card'],
    mermaidNode: 'S[Recruiting Participants]',
    wireframe: (
      <div className="flex flex-col gap-2.5 w-full p-3">
        <div>
          <div className="text-sm font-bold">Recruiting participants</div>
          <div className="text-[8px] text-gray-500">
            Find the perfect participants for your studies
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="w-7 h-7 bg-green-100 border border-green-300 rounded-full flex items-center justify-center text-[10px]">
            👥
          </div>
          <div className="text-[10px] font-bold mt-1.5">Managed Recruitment</div>
          <div className="text-[7px] text-gray-400 mt-0.5">
            Fully managed by our team from brief to delivery.
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="w-7 h-7 bg-green-100 border border-green-300 rounded-full flex items-center justify-center text-[10px]">
            👥
          </div>
          <div className="text-[10px] font-bold mt-1.5">Standard Recruitment</div>
          <div className="text-[7px] text-gray-400 mt-0.5">
            Self-serve and on-demand through our platform.
          </div>
        </div>
      </div>
    ),
  },
]

export default function ScreenInventory() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Screen Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Optimal Workshop — Platform Exploration Flow · 12 unique screens
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {screens.map(screen => (
            <div
              key={screen.id}
              className="group cursor-pointer"
              onClick={() => setSelected(selected === screen.id ? null : screen.id)}
            >
              {/* Phone wireframe */}
              <div
                className={`bg-white border-2 rounded-2xl overflow-hidden aspect-[9/16] flex flex-col transition-all ${
                  selected === screen.id
                    ? 'border-blue-500 shadow-lg shadow-blue-100'
                    : 'border-gray-200 group-hover:border-gray-400 group-hover:shadow-md'
                }`}
              >
                <div className="flex-1 overflow-hidden p-0.5">{screen.wireframe}</div>
              </div>

              {/* Label */}
              <div className="mt-2 px-0.5">
                <div className="text-xs font-semibold text-gray-800 leading-tight">
                  {screen.label}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{screen.type}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected &&
          (() => {
            const screen = screens.find(s => s.id === selected)
            return (
              <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{screen.label}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{screen.type}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Primary Interaction
                    </div>
                    <div className="text-sm text-gray-700">{screen.interaction}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Key Components
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {screen.components.map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Mermaid Node
                    </div>
                    <code className="text-[11px] bg-gray-900 text-green-400 rounded px-2 py-1 inline-block font-mono">
                      {screen.mermaidNode}
                    </code>
                  </div>
                </div>
              </div>
            )
          })()}
      </div>
    </div>
  )
}
