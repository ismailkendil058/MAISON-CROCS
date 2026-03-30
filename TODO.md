# TODO: Fix Admin Refresh Redirect Issue

## Plan Breakdown & Progress
- [x] 1. User approved the edit plan (persist isAdmin with localStorage + DB check in StoreContext; add loading check in AdminRoute).
- [x] 2. Edit src/context/StoreContext.tsx: Add useEffect for auto-check isAdmin from localStorage/DB on mount; persist on setIsAdmin(true).
- [x] 3. Edit src/App.tsx: Update AdminRoute to respect loading state (show loader during init).
- [x] 4. Test changes: Login, navigate to admin subpage, refresh page, confirm stays logged in (dev server running; persistence works via localStorage).
- [x] 5. Update TODO.md with completion.


