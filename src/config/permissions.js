const FULL_ACCESS = {
  dashboard: ["view"],
  reports: ["view", "export", "print"],
  students: ["view", "create", "edit", "delete", "export", "print"],
  teachers: ["view", "create", "edit", "delete", "export", "print"],
  parents: ["view", "create", "edit", "delete", "export", "print"],
  classes: ["view", "create", "edit", "delete", "export", "print"],
  subjects: ["view", "create", "edit", "delete", "export", "print"],
  attendance: ["view", "create", "edit", "delete", "export", "print"],
  fees: ["view", "create", "edit", "delete", "export", "print"],
  exams: ["view", "create", "edit", "delete", "export", "print"],
  timetable: ["view", "create", "edit", "delete", "export", "print"],
  library: ["view", "create", "edit", "delete", "export", "print"],
  transport: ["view", "create", "edit", "delete", "export", "print"],
  hostel: ["view", "create", "edit", "delete", "export", "print"],
  notices: ["view", "create", "edit", "delete", "export", "print"],
  settings: ["view", "edit"],
};

const ROLE_PERMISSIONS = {
  admin: FULL_ACCESS,
  teacher: {
    dashboard: ["view"],
    reports: ["view", "export", "print"],
    students: ["view", "export", "print"],
    teachers: ["view", "export", "print"],
    parents: ["view", "export", "print"],
    classes: ["view", "export", "print"],
    subjects: ["view", "export", "print"],
    attendance: ["view", "create", "edit", "delete", "export", "print"],
    fees: ["view", "export", "print"],
    exams: ["view", "export", "print"],
    timetable: ["view", "create", "edit", "delete", "export", "print"],
    notices: ["view", "create", "edit", "export", "print"],
  },
  student: {
    dashboard: ["view"],
    reports: ["view", "print"],
    students: ["view"],
    teachers: ["view"],
    attendance: ["view"],
    fees: ["view"],
    timetable: ["view"],
    notices: ["view"],
  },
  parent: {
    dashboard: ["view"],
    reports: ["view", "print"],
    students: ["view"],
    teachers: ["view"],
    attendance: ["view"],
    fees: ["view"],
    timetable: ["view"],
    notices: ["view"],
  },
};

export function hasPermission(role, resource, action) {
  if (!role || !resource || !action) return false;
  const permissions = ROLE_PERMISSIONS[role] || {};
  const allowedActions = permissions[resource] || [];
  return allowedActions.includes(action);
}
