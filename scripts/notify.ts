#!/usr/bin/env tsx
/**
 * Notification Script
 * Sends notifications to various channels (Slack, Discord, Email)
 */

import 'dotenv/config'
import chalk from 'chalk'

interface NotificationOptions {
  success: boolean
  message: string
  channel?: 'slack' | 'discord' | 'all'
  details?: {
    added?: number
    modified?: number
    removed?: number
    version?: string
  }
}

interface NotificationResult {
  channel: string
  success: boolean
  error?: string
}

/**
 * Format notification message with emoji and details
 */
function formatMessage(options: NotificationOptions): string {
  const emoji = options.success ? '✅' : '❌'
  const status = options.success ? 'Success' : 'Failed'

  let message = `${emoji} **Design Tokens ${status}**\n\n${options.message}`

  if (options.details) {
    message += '\n\n**Changes:**'
    if (options.details.added !== undefined) {
      message += `\n• ${options.details.added} tokens added`
    }
    if (options.details.modified !== undefined) {
      message += `\n• ${options.details.modified} tokens modified`
    }
    if (options.details.removed !== undefined) {
      message += `\n• ${options.details.removed} tokens removed`
    }
    if (options.details.version) {
      message += `\n\n**Version:** ${options.details.version}`
    }
  }

  // Add timestamp
  message += `\n\n_${new Date().toLocaleString()}_`

  return message
}

/**
 * Send notification to Slack
 */
async function sendToSlack(message: string): Promise<NotificationResult> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    return {
      channel: 'slack',
      success: false,
      error: 'SLACK_WEBHOOK_URL not configured',
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: message.replace(/\*\*/g, '*'), // Slack uses single * for bold
        unfurl_links: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return { channel: 'slack', success: true }
  } catch (error) {
    return {
      channel: 'slack',
      success: false,
      error: (error as Error).message,
    }
  }
}

/**
 * Send notification to Discord
 */
async function sendToDiscord(message: string): Promise<NotificationResult> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    return {
      channel: 'discord',
      success: false,
      error: 'DISCORD_WEBHOOK_URL not configured',
    }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
        username: 'Design Tokens Bot',
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return { channel: 'discord', success: true }
  } catch (error) {
    return {
      channel: 'discord',
      success: false,
      error: (error as Error).message,
    }
  }
}

/**
 * Send notification to configured channels
 */
export async function sendNotification(
  options: NotificationOptions
): Promise<NotificationResult[]> {
  const message = formatMessage(options)
  const results: NotificationResult[] = []
  const channel = options.channel || 'all'

  if (channel === 'slack' || channel === 'all') {
    results.push(await sendToSlack(message))
  }

  if (channel === 'discord' || channel === 'all') {
    results.push(await sendToDiscord(message))
  }

  return results
}

/**
 * CLI interface
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // Parse CLI args
  let message = 'Token sync notification'
  let success = true
  let channel: 'slack' | 'discord' | 'all' = 'all'

  for (const arg of args) {
    if (arg.startsWith('--message=')) {
      message = arg.split('=').slice(1).join('=')
    } else if (arg === '--failed') {
      success = false
    } else if (arg === '--slack') {
      channel = 'slack'
    } else if (arg === '--discord') {
      channel = 'discord'
    }
  }

  console.log(chalk.blue('\n📤 Sending notifications...\n'))

  const results = await sendNotification({ success, message, channel })

  for (const result of results) {
    if (result.success) {
      console.log(chalk.green(`✓ ${result.channel}: sent`))
    } else {
      console.log(chalk.yellow(`⚠ ${result.channel}: ${result.error}`))
    }
  }

  console.log('')
}

// Run if executed directly
if (process.argv[1]?.includes('notify')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}
