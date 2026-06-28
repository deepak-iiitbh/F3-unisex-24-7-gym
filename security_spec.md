# Firebase Security and Attributes Spec

## 1. Data Invariants
- **Profile Ownership**: A user profile located at `/users/{userId}` must only be accessed by the authenticated user whose `uid` matches `{userId}`.
- **Identity Honesty**: The `email` stored inside `/users/{userId}` must match the `email` contained inside the security rules' token (`request.auth.token.email`).
- **Plan Validity**: A user can only set their `membershipStatus` to `"Active"` if a valid `membershipPlanId` is provided. Users are forbidden from giving themselves privileged roles.
- **Newsletter Subscription Integrity**: Any guest or authenticated user can subscribe to newsletters, but they cannot read others' email subscriptions.

## 2. The "Dirty Dozen" Threat Payloads
Here are the 12 JSON data payloads used to attempt identity spoofing, state shortcutting, resource poisoning, or privilege escalation:

1. **Spoofed Owner ID**: Setting someone else's ID under `users/` collection.
2. **Missing Vital Fields**: Submitting profile creation without required keys like name or email.
3. **Ghost Fields injection**: Injecting field `isAdmin: true` into the profile to bypass RBAC gates.
4. **Huge Resource Poisoning**: Submitting a name containing a 10MB string.
5. **Junk Path ID Poisoning**: Specifying user ID `users/$$$malicious$$$` containing special symbol patterns.
6. **Self-Upgrade Status**: Directly toggling membership status to active without subscribing to any plan.
7. **Invalid Type for field**: Writing `emailVerified: "true"` (string instead of boolean).
8. **Immutability violation**: Attempting to alter the immutable `memberSince` timestamp field during profile modifications.
9. **Fake Email claim**: Submitting user profile with email `admin@f3gym.com` while authenticated as standard user `user@gmail.com`.
10. **Unauthenticated Read on profile**: Bypassing logins to request `users/test_user_id`.
11. **Malicious Delete Action**: Attempting unauthorized purging of subscriber email logs under `newsletters/`.
12. **Bypassing Verification requirement**: Requesting write permissions while using an unverified email (if strict verification is turned on).

## 3. Security Rules draft
See the rules draft under `DRAFT_firestore.rules` which protects against all 12 of these threat vectors.
