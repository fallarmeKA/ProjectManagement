export default {
  admin: {
    projects: {
      create: true,
      edit: true,
      delete: true,
      others: {
        edit: true,
      },
    },
    tasks: {
      create: true,
      edit: true,
      delete: true,
      others: {
        edit: true,
      },
    },
  },
  employee: {
    projects: {
      create: false,
      edit: false,
      delete: false,
      others: {
        edit: false,
      },
    },
    tasks: {
      create: true,
      edit: true,
      delete: true,
      others: {
        edit: false,
      },
    },
  },
};
