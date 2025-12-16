# Dynamic Role Assignment System

## Overview
Updated the system to use dynamic role assignments instead of fixed user roles. Users don't have predefined "Risk Owner" or "Action Owner" roles - they become owners when assigned by Risk Management.

## Role Structure

### Fixed Roles
Only **Risk Management** has a fixed role:
- **RiskManagement** - Can create risks, assign owners, create mitigations, manage versions

### Dynamic Assignments
All other users have role: **"User"** and gain responsibilities through assignments:
- **Risk Owner** - When RM assigns them to a risk's `owners` array
- **Action Owner** - When RM assigns them as `actionOwner` on a mitigation

## User Database Structure

```json
{
  "userId": "U001",
  "name": "Michael Wong",
  "email": "michael.wong@company.com",
  "role": "User",  // Generic role
  "department": "Operations",
  "permissions": [],  // No predefined permissions
  "active": true
}
```

## How Assignments Work

### Risk Owner Assignment
1. RM creates a risk
2. RM assigns users to the risk via `owners` array
3. Assigned users can now:
   - View the risk details
   - Submit/update ratings
   - Add comments to basis thread

### Action Owner Assignment
1. RM creates a mitigation on a risk
2. RM selects a user as `actionOwner`
3. Assigned user can now:
   - See the mitigation in "My Actions"
   - Update mitigation status
   - Update progress percentage
   - Modify target dates
   - Add progress comments

## Navigation & Access

### My Actions Menu
- **Visibility**: Shown to ALL users
- **Content**: Dynamically filtered to show only mitigations where user is `actionOwner`
- **Empty State**: If user has no assigned mitigations, shows friendly empty state

### Risk Rating
- **Access**: Only shown if user is in the risk's `owners` array
- **Status Check**: Risk must be "Published"

### Mitigation Management
- **Create**: Only Risk Management
- **Update**: Action Owner (assigned user) + Risk Management

## Test Accounts

### Risk Management
- **Email**: risk.manager@company.com
- **Password**: password123
- **Can**: Create risks, assign owners, create mitigations, publish/lock risks

### Regular Users
All have role "User" - become owners through assignments:

1. **Michael Wong** (michael.wong@company.com)
   - Currently assigned as Risk Owner on "Energy Transition Risk 1"
   - Can rate that specific risk

2. **David Lee** (david.lee@company.com)
   - Can be assigned as Action Owner on mitigations
   - Will see assigned mitigations in "My Actions"

3. **Jennifer Tan** (jennifer.tan@company.com)
   - Generic user, can be assigned to any risk/mitigation

4. **Robert Kim** (robert.kim@company.com)
   - Generic user, can be assigned to any risk/mitigation

5. **Lisa Anderson** (lisa.anderson@company.com)
   - Generic user, can be assigned to any risk/mitigation

## Benefits of This Approach

1. **Flexibility**: Users can have different roles on different risks
2. **Simplicity**: No need to manage complex role hierarchies
3. **Realistic**: Matches real-world scenarios where people wear multiple hats
4. **Scalable**: Easy to add new users without role configuration

## Example Scenarios

### Scenario 1: Multi-Role User
- Michael Wong is Risk Owner on Risk A
- Michael Wong is Action Owner on Mitigation B (different risk)
- He sees both in his respective views

### Scenario 2: Department Head
- Jennifer Tan is Risk Owner on all Finance risks
- She can rate all assigned risks
- She might also be Action Owner on specific mitigations

### Scenario 3: Project Manager
- David Lee is Action Owner on multiple mitigations across different risks
- He sees all his assigned actions in "My Actions"
- He's not a Risk Owner on any risk (yet)

## Migration Notes

- Removed `RiskOwner`, `ActionOwner`, `HeadOfDepartment`, `Admin` as fixed roles
- All non-RM users now have role: `"User"`
- Permissions are now context-based (assignment-based) rather than role-based
- Navigation items are shown to all users, filtered by actual assignments
