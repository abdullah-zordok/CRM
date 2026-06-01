export const BUSINESS_ROLES = ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"] as const;
export type BusinessRoleCode = (typeof BUSINESS_ROLES)[number];

export const OPERATIONS_REVIEWER = "OPERATIONS_REVIEWER" as const;

export const PermissionCode = {
  UsersManage: "users.manage",
  UsersRead: "users.read",
  RolesAssign: "roles.assign",
  PermissionsRead: "permissions.read",
  TeamsManage: "teams.manage",
  TeamsRead: "teams.read",
  ProfileRead: "profile.read",
  AuditRead: "audit.read",
  LeadsCreate: "leads.create",
  LeadsRead: "leads.read",
  LeadsUpdate: "leads.update",
  LeadsAssign: "leads.assign",
  LeadsStatusChange: "leads.status.change",
  LeadsNoteAdd: "leads.note.add",
  LeadsHistoryRead: "leads.history.read",
  LeadsSearch: "leads.search",
} as const;

export type PermissionCode = (typeof PermissionCode)[keyof typeof PermissionCode];

export interface PermissionDefinition {
  code: PermissionCode;
  resource: string;
  action: string;
  description: string;
  grantedTo: string[];
}

export const PERMISSION_MATRIX: PermissionDefinition[] = [
  {
    code: PermissionCode.UsersManage,
    resource: "users",
    action: "manage",
    description: "Create, update, disable, and re-enable users",
    grantedTo: ["ADMIN"],
  },
  {
    code: PermissionCode.UsersRead,
    resource: "users",
    action: "read",
    description: "View user records",
    grantedTo: ["ADMIN", "MANAGER"],
  },
  {
    code: PermissionCode.RolesAssign,
    resource: "roles",
    action: "assign",
    description: "Assign fixed business roles and reviewer access",
    grantedTo: ["ADMIN"],
  },
  {
    code: PermissionCode.PermissionsRead,
    resource: "permissions",
    action: "read",
    description: "Inspect the fixed permission matrix",
    grantedTo: ["ADMIN"],
  },
  {
    code: PermissionCode.TeamsManage,
    resource: "teams",
    action: "manage",
    description: "Create, update, and assign teams",
    grantedTo: ["ADMIN"],
  },
  {
    code: PermissionCode.TeamsRead,
    resource: "teams",
    action: "read",
    description: "View permitted team scope",
    grantedTo: ["ADMIN", "MANAGER"],
  },
  {
    code: PermissionCode.ProfileRead,
    resource: "profile",
    action: "read",
    description: "View own profile and role summary",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.AuditRead,
    resource: "audit",
    action: "read",
    description: "Search security audit activity",
    grantedTo: ["ADMIN", OPERATIONS_REVIEWER],
  },
  {
    code: PermissionCode.LeadsCreate,
    resource: "leads",
    action: "create",
    description: "Create leads in permitted CRM scope",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsRead,
    resource: "leads",
    action: "read",
    description: "View permitted lead records",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsUpdate,
    resource: "leads",
    action: "update",
    description: "Update permitted lead records",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsAssign,
    resource: "leads",
    action: "assign",
    description: "Assign or reassign leads",
    grantedTo: ["ADMIN", "MANAGER"],
  },
  {
    code: PermissionCode.LeadsStatusChange,
    resource: "leads",
    action: "change_status",
    description: "Change lead pipeline status",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsNoteAdd,
    resource: "leads",
    action: "add_note",
    description: "Add append-only lead notes",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsHistoryRead,
    resource: "leads",
    action: "read_history",
    description: "View permitted lead history",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
  {
    code: PermissionCode.LeadsSearch,
    resource: "leads",
    action: "search",
    description: "Search permitted lead records",
    grantedTo: ["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"],
  },
];
