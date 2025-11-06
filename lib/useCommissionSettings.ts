'use client'

import { useState, useEffect } from 'react'
import { CommissionSettings } from './types'

const DEFAULT_COMMISSION_SETTINGS: CommissionSettings = {
  mode: 'percentage',
  fixed_amount: 5,
  percentage: 8,
  min_amount: 5
}

export function useCommissionSettings() {
  const [settings, setSettings] = useState<CommissionSettings>(DEFAULT_COMMISSION_SETTINGS)
  const [defaultShipping, setDefaultShipping] = useState<number>(35)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/settings?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        })
        if (response.ok) {
          const { data } = await response.json()
          
          console.log('[useCommissionSettings] Fetched settings:', data)
          
          if (data.commission_config) {
            setSettings(data.commission_config)
            console.log('[useCommissionSettings] Updated commission settings:', data.commission_config)
          }
          
          if (data.pritti_default_shipping) {
            setDefaultShipping(typeof data.pritti_default_shipping === 'number' 
              ? data.pritti_default_shipping 
              : 35)
          }
        } else {
          console.error('[useCommissionSettings] Failed to fetch settings:', response.status, response.statusText)
        }
      } catch (error) {
        console.error('[useCommissionSettings] Error fetching commission settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
    
    // Refetch settings every 10 seconds to pick up changes faster
    const interval = setInterval(fetchSettings, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return { commissionSettings: settings, defaultShipping, loading }
}

