# API Endpoint Linking Issues - Scan Report

**Date:** 2025-12-13 20:12
**Status:** 🔍 In Progress

## Issue Summary
The codebase has inconsistent API endpoint prefixes. The backend mounts all routes at `/api`, but some frontend calls include `/api/` prefix while others don't.

### Backend Configuration
```javascript
// backend/index.js line 60
app.use("/api", require("./routes/completeRoutes"));
```

This means all routes are accessible at:
- ✅ `http://localhost:4000/api/teacher/...`
- ❌ `http://localhost:4000/teacher/...` (will return 404)

### Frontend Configuration
```javascript
// frontend/src/constants/api.js
export const BASE_URL = "http://localhost:4000";
```

This means frontend calls should include `/api/` prefix:
- ✅ `api.get('/api/teacher/...')` → `http://localhost:4000/api/teacher/...`
- ❌ `api.get('/teacher/...')` → `http://localhost:4000/teacher/...` (404 error)

## Files Requiring Fixes

### Teacher Pages (Missing /api prefix)

#### ✅ FIXED: TeacherAttendance.jsx
- Line 37: `/teacher/${teacherId}/dashboard` → `/api/teacher/${teacherId}/dashboard`
- Line 47: `/teacher/${teacherId}/subjects/...` → `/api/teacher/${teacherId}/subjects/...`
- Line 81: `/teacher/${teacherId}/attendance` → `/api/teacher/${teacherId}/attendance`

#### 🔧 TO FIX: TeacherAssignments.jsx
- Line 42: `api.get(\`/teacher/${teacherId}/assignments\`)`
- Line 43: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 85: `api.post(\`/teacher/${teacherId}/assignments\`)`

#### 🔧 TO FIX: TeacherMaterials.jsx
- Line 35: `api.get(\`/teacher/${teacherId}/materials\`)`
- Line 36: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 68: `api.post(\`/teacher/${teacherId}/materials\`)`

#### 🔧 TO FIX: TeacherNotices.jsx
- Line 34: `api.get(\`/teacher/${teacherId}/notices\`)`
- Line 35: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 59: `api.post(\`/teacher/${teacherId}/notices\`)`

#### 🔧 TO FIX: TeacherProfile.jsx
- Line 41: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 105: `api.get(\`/teacher/${teacherId}/assignments\`)`
- Line 114: `api.get(\`/teacher/${teacherId}/materials\`)`
- Line 123: `api.get(\`/teacher/${teacherId}/notices\`)`

#### 🔧 TO FIX: TeacherResources.jsx
- Line 55: `api.get(\`/teacher/${teacherId}/resources\`)`
- Line 56: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 90: `api.post(\`/teacher/${teacherId}/resources\`)`

#### 🔧 TO FIX: TeacherMarks.jsx
- Line 43: `api.get(\`/teacher/${teacherId}/dashboard\`)`
- Line 55: `api.get(\`/teacher/${teacherId}/subjects/${selectedSubject}/students\`)`
- Line 56: `api.get(\`/teacher/${teacherId}/marks/${selectedSubject}\`)`

#### 🔧 TO FIX: TeacherTimetable.jsx
- Line 25: `api.get(\`/teacher/${teacherId}/dashboard\`)`

### Student Pages (Need verification)
- Most student pages appear to have correct `/api/` prefixes
- Need to verify StudentSubjects.jsx, StudentNotes.jsx, StudentMaterials.jsx

## Fix Strategy

### Option 1: Update BASE_URL (Rejected)
- Change BASE_URL to include `/api`
- Would require updating 31+ files that already have `/api/`
- Too error-prone

### Option 2: Fix Individual Files (Selected) ✅
- Add `/api/` prefix to ~17 files missing it
- Maintains consistency with majority of codebase
- Less risk of breaking existing functionality

## Progress
- ✅ TeacherAttendance.jsx - FIXED
- 🔧 16 more files to fix
- ⏳ Estimated time: 10-15 minutes

## Testing Required After Fix
1. Test all teacher pages (attendance, assignments, materials, notices, etc.)
2. Verify API calls return 200 OK instead of 404
3. Check browser console for any remaining endpoint errors
4. Test student pages for any regressions

## Related Issues
- ✅ Fixed: Route ordering for `/teacher/admin/attendance` (see ATTENDANCE_FIX.md)
- ✅ Fixed: Backend running on port 4000 with nodemon
- 🔧 Pending: API endpoint consistency across all pages
