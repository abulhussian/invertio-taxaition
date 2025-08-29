"use client"

import { useState, useEffect } from "react"

const ensureLeadingSlash = (path) => {
  if (!path) return "/"
  return path.startsWith("/") ? path : `/${path}`
}

const normalizePath = (path) => {
  // ensure one leading slash and collapse duplicates
  const withSlash = ensureLeadingSlash(path)
  return withSlash.replace(/\/{2,}/g, "/")
}

let currentPath = typeof window !== "undefined" ? normalizePath(window.location.pathname || "/login") : "/login"
let navigationListeners = []

const notifyListeners = (path) => {
  navigationListeners.forEach((listener) => listener(path))
}

export const navigate = (path) => {
  const next = normalizePath(path)
  if (typeof window !== "undefined") {
    window.history.pushState({}, "", next)
  }
  currentPath = next
  notifyListeners(next)
}

export const useNavigate = () => navigate

export const Link = ({ to, children, className, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault()
    navigate(to)
    if (onClick) onClick(e)
  }

  // Always render normalized href so middle-click/copy works nicely
  const href = normalizePath(to)

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}

export const useLocation = () => {
  const [pathname, setPathname] = useState(currentPath)

  useEffect(() => {
    // keep local state synced with global currentPath
    const listener = (path) => setPathname(path)
    navigationListeners.push(listener)

    const handlePopState = () => {
      const path = normalizePath(window.location.pathname || "/login")
      currentPath = path
      setPathname(path)
      notifyListeners(path)
    }

    // initialize from real location on mount
    handlePopState()
    window.addEventListener("popstate", handlePopState)

    return () => {
      navigationListeners = navigationListeners.filter((l) => l !== listener)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  return { pathname }
}
