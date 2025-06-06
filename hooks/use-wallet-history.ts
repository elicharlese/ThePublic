"use client"

import { useState, useEffect, useCallback } from "react"

export interface WalletHistoryEntry {
  id: string
  name: string
  publicKey: string
  lastConnected: number
  connectionCount: number
  isFavorite: boolean
}

const STORAGE_KEY = "wallet_connection_history"

export function useWalletHistory() {
  const [history, setHistory] = useState<WalletHistoryEntry[]>([])

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY)
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error("Failed to load wallet history:", error)
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error("Failed to save wallet history:", error)
    }
  }, [history])

  const addToHistory = useCallback((entry: { id: string; name: string; publicKey: string }) => {
    try {
      setHistory((prevHistory) => {
        // Check if this wallet is already in history
        const existingEntryIndex = prevHistory.findIndex((item) => item.publicKey === entry.publicKey)

        if (existingEntryIndex !== -1) {
          // Update existing entry
          const updatedHistory = [...prevHistory]
          updatedHistory[existingEntryIndex] = {
            ...updatedHistory[existingEntryIndex],
            lastConnected: Date.now(),
            connectionCount: updatedHistory[existingEntryIndex].connectionCount + 1,
          }
          return updatedHistory
        } else {
          // Add new entry
          return [
            {
              id: entry.id,
              name: entry.name,
              publicKey: entry.publicKey,
              lastConnected: Date.now(),
              connectionCount: 1,
              isFavorite: false,
            },
            ...prevHistory,
          ]
        }
      })
    } catch (error) {
      console.error("Failed to add to wallet history:", error)
    }
  }, [])

  const removeFromHistory = useCallback((publicKey: string) => {
    try {
      setHistory((prevHistory) => prevHistory.filter((item) => item.publicKey !== publicKey))
    } catch (error) {
      console.error("Failed to remove from wallet history:", error)
    }
  }, [])

  const clearHistory = useCallback(() => {
    try {
      setHistory([])
    } catch (error) {
      console.error("Failed to clear wallet history:", error)
    }
  }, [])

  const toggleFavorite = useCallback((publicKey: string) => {
    try {
      setHistory((prevHistory) =>
        prevHistory.map((item) => (item.publicKey === publicKey ? { ...item, isFavorite: !item.isFavorite } : item)),
      )
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }, [])

  const getFavorites = useCallback(() => {
    try {
      return history.filter((item) => item.isFavorite)
    } catch (error) {
      console.error("Failed to get favorites:", error)
      return []
    }
  }, [history])

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    toggleFavorite,
    getFavorites,
  }
}
