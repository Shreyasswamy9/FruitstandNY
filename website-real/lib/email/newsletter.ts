/**
 * Mailchimp Marketing API integration for newsletter signups
 * 
 * This module handles subscribing users to email and SMS newsletters via Mailchimp
 * 
 * Required environment variables:
 * - MAILCHIMP_API_KEY: Your Mailchimp API key
 * - MAILCHIMP_LIST_ID: Your Mailchimp audience/list ID for email newsletters
 * - MAILCHIMP_SMS_AUDIENCE_ID: Your Mailchimp SMS audience ID (optional, if using Mailchimp SMS)
 */

/**
 * Subscribe a user to newsletter
 * @param email - User's email address
 * @param phone - User's phone number (optional)
 * @param signupType - 'email' or 'phone' to indicate which list to subscribe to
 */
export async function subscribeToNewsletter(
  email?: string,
  phone?: string,
  signupType?: 'email' | 'phone'
) {
  try {
    // Validate at least one contact method
    if (!email && !phone) {
      return { success: false, error: 'Email or phone number required' }
    }

    // Get API key and list ID from environment
    const apiKey = process.env.MAILCHIMP_API_KEY
    const listId = process.env.MAILCHIMP_LIST_ID
    const smsAudienceId = process.env.MAILCHIMP_SMS_AUDIENCE_ID

    if (!apiKey || !listId) {
      console.error('Missing Mailchimp configuration')
      return { success: false, error: 'Newsletter service not configured' }
    }

    // Extract server name from API key (format: xxxx-us1, xxxx-us2, etc)
    const serverName = apiKey.split('-')[1]

    // For email signup
    if ((signupType === 'email' || !signupType) && email) {
      const emailResult = await subscribeEmail(email, apiKey, listId, serverName)
      if (!emailResult.success) {
        return emailResult
      }
    }

    // For SMS signup
    if ((signupType === 'phone' || !signupType) && phone && smsAudienceId) {
      const smsResult = await subscribeSMS(phone, apiKey, smsAudienceId, serverName)
      if (!smsResult.success) {
        return smsResult
      }
    }

    return { success: true, message: 'Successfully subscribed to newsletter' }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'Failed to subscribe to newsletter' }
  }
}

/**
 * Subscribe email to Mailchimp audience
 */
async function subscribeEmail(
  email: string,
  apiKey: string,
  listId: string,
  serverName: string
) {
  try {
    // Encode credentials in base64
    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')

    const response = await fetch(
      `https://${serverName}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          // Optional: add merge fields or tags
          tags: ['15% Discount'],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      
      // If user already subscribed, don't treat it as error
      if (response.status === 400 && errorData.detail?.includes('already')) {
        return { success: true, message: 'Already subscribed' }
      }

      console.error('Mailchimp email error:', errorData)
      return { success: false, error: errorData.detail || 'Failed to subscribe email' }
    }

    return { success: true, message: 'Email subscribed successfully' }
  } catch (error) {
    console.error('Email subscription error:', error)
    return { success: false, error: 'Failed to subscribe email' }
  }
}

/**
 * Subscribe phone to Mailchimp SMS audience
 */
async function subscribeSMS(
  phone: string,
  apiKey: string,
  smsAudienceId: string,
  serverName: string
) {
  try {
    // Normalize phone number (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '')

    const auth = Buffer.from(`anystring:${apiKey}`).toString('base64')

    const response = await fetch(
      `https://${serverName}.api.mailchimp.com/3.0/lists/${smsAudienceId}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: normalizedPhone,
          status: 'subscribed',
          tags: ['15% Discount'],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      
      if (response.status === 400 && errorData.detail?.includes('already')) {
        return { success: true, message: 'Already subscribed' }
      }

      console.error('Mailchimp SMS error:', errorData)
      return { success: false, error: errorData.detail || 'Failed to subscribe to SMS' }
    }

    return { success: true, message: 'SMS subscribed successfully' }
  } catch (error) {
    console.error('SMS subscription error:', error)
    return { success: false, error: 'Failed to subscribe to SMS' }
  }
}
