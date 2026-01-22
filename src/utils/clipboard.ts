/**
 * Clipboard Utilities
 *
 * Cross-browser clipboard API with fallback support
 */

/**
 * Copy text to clipboard with fallback for older browsers
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err)
    }
  }

  // Fallback to execCommand for older browsers
  return copyToClipboardFallback(text)
}

/**
 * Fallback clipboard copy using deprecated execCommand
 * @param text - Text to copy to clipboard
 * @returns true if successful, false otherwise
 */
function copyToClipboardFallback(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    textarea.setAttribute('readonly', '')

    document.body.appendChild(textarea)

    // Select the text
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      // iOS requires special handling
      const range = document.createRange()
      range.selectNodeContents(textarea)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      textarea.setSelectionRange(0, text.length)
    } else {
      textarea.select()
    }

    // Execute copy command
    const success = document.execCommand('copy')

    // Clean up
    document.body.removeChild(textarea)

    return success
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err)
    return false
  }
}

/**
 * Read text from clipboard (requires user permission)
 * @returns Promise that resolves to clipboard text, or null if failed
 */
export async function readFromClipboard(): Promise<string | null> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (err) {
      console.error('Failed to read from clipboard:', err)
      return null
    }
  }

  console.warn('Clipboard read API not available')
  return null
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext)
}
