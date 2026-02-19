# Screen Taxonomy Reference

Use this taxonomy to classify screens identified in flow analysis.
Pick the most specific match. If a screen combines multiple types, use the primary purpose.

## Navigation & Structure

| Type                 | Description                                    | Common Components                       |
| -------------------- | ---------------------------------------------- | --------------------------------------- |
| Home / Dashboard     | Main landing screen, hub for navigation        | Nav bar, cards, quick actions, stats    |
| Tab Bar / Bottom Nav | Screen dominated by tab-based navigation       | Bottom tabs, active indicator           |
| Side Menu / Drawer   | Navigation via slide-out drawer                | Menu items, user avatar, sections       |
| Search               | Dedicated search interface                     | Search bar, filters, recent searches    |
| Search Results       | List of results after a query                  | Result cards, sorting, pagination       |
| Detail View          | Single item detail (product, article, profile) | Hero image, title, description, actions |
| List / Feed          | Scrollable list of items                       | Cards, infinite scroll, pull-to-refresh |
| Grid / Gallery       | Items in grid layout                           | Thumbnails, grid layout, filters        |
| Category / Browse    | Category selection or browsing                 | Category cards, icons, labels           |

## Forms & Input

| Type              | Description                                   | Common Components                          |
| ----------------- | --------------------------------------------- | ------------------------------------------ |
| Form - Simple     | 1-3 input fields                              | Text inputs, labels, submit button         |
| Form - Complex    | 4+ fields, possibly multi-section             | Multiple inputs, sections, progress        |
| Form - Multi-step | Wizard or stepper form                        | Progress indicator, next/back, step labels |
| Date/Time Picker  | Specialized date or time selection            | Calendar, time slots, confirm              |
| File Upload       | File or media upload interface                | Drop zone, file list, progress bar         |
| Text Editor       | Rich text or content editing                  | Toolbar, text area, formatting options     |
| Selection         | Pick from options (radio, checkbox, dropdown) | Option list, selection indicator           |

## Authentication & Account

| Type            | Description                      | Common Components                                |
| --------------- | -------------------------------- | ------------------------------------------------ |
| Login           | Sign-in screen                   | Email/password fields, social login, forgot link |
| Registration    | Account creation                 | Form fields, terms checkbox, social signup       |
| Forgot Password | Password recovery initiation     | Email input, send button                         |
| Verification    | Code input or email verification | Code inputs, resend button, timer                |
| MFA / 2FA       | Multi-factor authentication step | Code input, authenticator prompt                 |
| Profile Setup   | Initial profile configuration    | Avatar upload, name, preferences                 |
| Profile View    | View own or others' profile      | Avatar, bio, stats, edit button                  |
| Settings        | App or account settings          | Toggle switches, option rows, sections           |

## Feedback & Status

| Type                 | Description                    | Common Components                         |
| -------------------- | ------------------------------ | ----------------------------------------- |
| Loading              | Content loading state          | Spinner, skeleton screens, progress bar   |
| Success              | Action completed successfully  | Check icon, success message, next action  |
| Error                | Something went wrong           | Error icon, message, retry button         |
| Empty State          | No content to display          | Illustration, message, CTA                |
| Confirmation Dialog  | Confirm before action          | Modal, confirm/cancel buttons             |
| Alert / Notification | System notification or alert   | Banner, icon, dismiss action              |
| Permission Request   | OS or in-app permission prompt | Permission description, allow/deny        |
| Toast / Snackbar     | Transient feedback message     | Brief text, optional action, auto-dismiss |

## Commerce & Transactions

| Type                   | Description                     | Common Components                      |
| ---------------------- | ------------------------------- | -------------------------------------- |
| Product Card / Listing | Product in a catalog            | Image, price, title, add-to-cart       |
| Cart / Basket          | Items selected for purchase     | Item list, quantities, total, checkout |
| Checkout - Shipping    | Delivery address and method     | Address form, shipping options         |
| Checkout - Payment     | Payment method selection        | Card form, payment methods, total      |
| Order Review           | Final review before purchase    | Summary, items, total, place order     |
| Order Confirmation     | Purchase completed              | Order number, details, next steps      |
| Pricing / Plans        | Subscription or plan comparison | Plan cards, features, CTAs             |

## Content & Media

| Type             | Description              | Common Components                    |
| ---------------- | ------------------------ | ------------------------------------ |
| Article / Blog   | Long-form text content   | Title, body text, images, share      |
| Video Player     | Video playback screen    | Player, controls, title, description |
| Image Viewer     | Full-screen image view   | Image, zoom, navigation arrows       |
| Map View         | Geographic map interface | Map, pins, search, layers            |
| Chat / Messaging | Conversation interface   | Message bubbles, input, send         |
| Comments         | Comment thread           | Comments, reply, like, input         |

## Onboarding & Education

| Type                   | Description                      | Common Components                   |
| ---------------------- | -------------------------------- | ----------------------------------- |
| Welcome / Splash       | First screen, brand introduction | Logo, tagline, get started CTA      |
| Value Proposition      | Feature or benefit highlight     | Illustration, headline, description |
| Tutorial / Walkthrough | Step-by-step guide overlay       | Highlight, tooltip, next/skip       |
| Onboarding Carousel    | Swipeable intro slides           | Dots indicator, illustrations, skip |
| Completion             | Onboarding finished              | Celebration, summary, go to app     |

## Social & Sharing

| Type        | Description               | Common Components                  |
| ----------- | ------------------------- | ---------------------------------- |
| Share Sheet | Share content externally  | Platform icons, copy link, message |
| Invite      | Invite others to platform | Contact list, invite button, link  |
| Referral    | Referral program screen   | Code, share options, rewards       |
| Social Feed | Social media timeline     | Posts, likes, comments, share      |

## Transition States

| Type                | Description                     | When to Use                                 |
| ------------------- | ------------------------------- | ------------------------------------------- |
| Transition          | Mid-animation or between states | Frame caught during page transition         |
| Scroll Position     | Same screen, different scroll   | Only keep if new content is revealed        |
| Hover / Focus State | Interactive state highlight     | Note as variant, don't count as new screen  |
| Modal Overlay       | Dialog over existing screen     | Count as separate if it has its own purpose |
| Dropdown Open       | Expanded dropdown/menu          | Note as interaction state                   |

---

## Classification Tips

1. **Primary purpose wins**: If a screen is a "Settings" page with a form, classify as "Settings" not "Form"
2. **Modals count**: A confirmation modal is a distinct screen in the flow
3. **Loading states**: Only include if they last long enough to be a meaningful screen (>1-2 seconds)
4. **Scroll variants**: Same screen at different scroll positions = ONE screen, unless scrolling reveals a fundamentally different section
5. **Platform awareness**: Native mobile may have platform-specific patterns (iOS sheets, Android bottom sheets) — note the platform convention
