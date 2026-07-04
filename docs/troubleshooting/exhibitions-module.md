# Exhibitions Module Troubleshooting

## Purpose

The Exhibitions Module handles field sales event management, representative attendance, lead attribution, and event performance review.

## Common Issues

### Migration conflicts

If you see shadow database errors during migrations, ensure that older migrations do not conflict with new enums.

### Access Denied

Verify that the user has the correct RBAC role (ADMIN, MANAGER, SALES_REPRESENTATIVE) and the appropriate team scope for the exhibition.

### Stale Updates

If an update is rejected, it means another user modified the exhibition concurrently. Reload the exhibition data and try again.
